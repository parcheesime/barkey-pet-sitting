from pathlib import Path
import re
from collections import Counter, defaultdict

html_files = sorted(Path(".").glob("*.html"))
css_files = sorted(Path("assets/css").glob("*.css"))
js_files = sorted(Path("assets/js").glob("*.js"))

html_text = "\n".join(p.read_text(errors="ignore") for p in html_files)
css_text = "\n".join(p.read_text(errors="ignore") for p in css_files)

def find_classes(text):
    return re.findall(r'class="([^"]+)"', text)

html_classes = Counter()
for class_attr in find_classes(html_text):
    for cls in class_attr.split():
        html_classes[cls] += 1

css_classes = sorted(set(re.findall(r"\.([a-zA-Z0-9_-]+)", css_text)))
html_ids = Counter(re.findall(r'id="([^"]+)"', html_text))
css_ids = sorted(set(re.findall(r"#([a-zA-Z0-9_-]+)", css_text)))

print("SITE AUDIT")
print("=" * 50)
print(f"HTML files: {len(html_files)}")
print(f"CSS files: {len(css_files)}")
print(f"JS files: {len(js_files)}")
print(f"CSS lines: {sum(len(p.read_text(errors='ignore').splitlines()) for p in css_files)}")
print()

print("HTML VALIDATION CHECKS TO RUN")
print("-" * 50)
print('npx html-validate@9 "*.html"')
print('npx stylelint "assets/css/**/*.css"')
print()

print("POSSIBLY UNUSED CSS CLASSES")
print("-" * 50)
for cls in css_classes:
    if cls not in html_text:
        print(f".{cls}")

print()

print("POSSIBLY UNUSED CSS IDS")
print("-" * 50)
for id_name in css_ids:
    if id_name not in html_text:
        print(f"#{id_name}")

print()

print("HTML CLASSES USED ONLY ONCE")
print("-" * 50)
for cls, count in sorted(html_classes.items()):
    if count == 1:
        print(f".{cls}")

print()

print("DUPLICATE HTML IDS")
print("-" * 50)
for id_name, count in sorted(html_ids.items()):
    if count > 1:
        print(f"#{id_name} used {count} times")

print()

print("SELF-CLOSING VOID TAGS TO CHECK")
print("-" * 50)
void_tags = ["meta", "link", "img", "input", "br", "hr"]
for path in html_files:
    for i, line in enumerate(path.read_text(errors="ignore").splitlines(), start=1):
        if any(re.search(rf"<{tag}\b[^>]*\/>", line) for tag in void_tags):
            print(f"{path}:{i}: {line.strip()}")

print()

print("BUTTONS WITHOUT TYPE")
print("-" * 50)
button_re = re.compile(r"<button(?![^>]*\btype=)[^>]*>", re.IGNORECASE)
for path in html_files:
    for i, line in enumerate(path.read_text(errors="ignore").splitlines(), start=1):
        if button_re.search(line):
            print(f"{path}:{i}: {line.strip()}")

print()

print("INLINE STYLES")
print("-" * 50)
for path in html_files:
    for i, line in enumerate(path.read_text(errors="ignore").splitlines(), start=1):
        if "style=" in line:
            print(f"{path}:{i}: {line.strip()}")

print()

print("MAINTENANCE MARKERS IN COMMENTS")
print("-" * 50)
maintenance_terms = ["TO" + "DO", "FIX" + "ME", "TE" + "MP", "OLD", "remove later", "unused"]
maintenance_re = re.compile("|".join(re.escape(term) for term in maintenance_terms), re.IGNORECASE)
for path in html_files + css_files + js_files:
    for i, line in enumerate(path.read_text(errors="ignore").splitlines(), start=1):
        if maintenance_re.search(line):
            print(f"{path}:{i}: {line.strip()}")
