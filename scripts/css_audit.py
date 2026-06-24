from pathlib import Path
import re

css_file = Path("assets/css/styles.css")
html_files = list(Path(".").glob("*.html"))

css = css_file.read_text()
html = "\n".join(file.read_text() for file in html_files)

classes = sorted(set(re.findall(r"\.([a-zA-Z0-9_-]+)", css)))
ids = sorted(set(re.findall(r"#([a-zA-Z0-9_-]+)", css)))

print("\nCSS AUDIT")
print("=" * 40)
print(f"CSS file: {css_file}")
print(f"HTML files checked: {len(html_files)}")
print(f"CSS lines: {len(css.splitlines())}")
print(f"CSS class selectors found: {len(classes)}")
print(f"CSS id selectors found: {len(ids)}")

print("\nPossibly unused classes:")
print("-" * 40)
for cls in classes:
    if cls not in html:
        print(f".{cls}")

print("\nPossibly unused IDs:")
print("-" * 40)
for id_name in ids:
    if id_name not in html:
        print(f"#{id_name}")

print("\nReminder:")
print("Check JS-added classes, responsive state classes, pseudo selectors, and external/form classes before deleting.")