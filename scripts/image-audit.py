from pathlib import Path
import csv
import re
import xml.etree.ElementTree as ET

SVG_DIR = Path("assets/images/shapes")
OUT = Path("reports/svg-audit.csv")

def strip_ns(tag):
    return tag.split("}", 1)[-1]

def count_path_nodes(d):
    # rough node estimate: counts path commands like M, L, C, Q, etc.
    return len(re.findall(r"[MmLlHhVvCcSsQqTtAaZz]", d or ""))

rows = []

for file in sorted(SVG_DIR.glob("*.svg")):
    text = file.read_text(encoding="utf-8", errors="ignore")

    wrapped_raster = "<image" in text or "data:image" in text
    path_count = 0
    polygon_count = 0
    shape_count = 0
    estimated_nodes = 0

    try:
        root = ET.fromstring(text)
        for el in root.iter():
            tag = strip_ns(el.tag)

            if tag == "path":
                path_count += 1
                estimated_nodes += count_path_nodes(el.attrib.get("d", ""))

            if tag in {"polygon", "polyline"}:
                polygon_count += 1
                points = el.attrib.get("points", "")
                estimated_nodes += len(re.findall(r"[-+]?\d*\.?\d+[, ]+[-+]?\d*\.?\d+", points))

            if tag in {"rect", "circle", "ellipse", "line"}:
                shape_count += 1

    except ET.ParseError:
        rows.append({
            "file": str(file),
            "status": "parse error",
            "wrapped_raster": wrapped_raster,
            "path_count": "",
            "polygon_count": "",
            "basic_shape_count": "",
            "estimated_nodes": "",
            "recommendation": "Open manually"
        })
        continue

    if wrapped_raster:
        recommendation = "Fix: raster wrapped in SVG"
    elif estimated_nodes > 100:
        recommendation = "Review: high node count"
    elif path_count or polygon_count or shape_count:
        recommendation = "Good: vector"
    else:
        recommendation = "Review: no obvious vector shape"

    rows.append({
        "file": str(file),
        "status": "ok",
        "wrapped_raster": wrapped_raster,
        "path_count": path_count,
        "polygon_count": polygon_count,
        "basic_shape_count": shape_count,
        "estimated_nodes": estimated_nodes,
        "recommendation": recommendation
    })

OUT.parent.mkdir(exist_ok=True)

with OUT.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"Wrote {OUT}")