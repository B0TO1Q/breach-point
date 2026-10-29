# After editing the inline <script> in index.html, run this to update its sha256 in the Content-Security-Policy.
# Without it, the browser blocks the game script. Usage: python3 tools/update-csp.py
import hashlib, base64, re, pathlib
p = pathlib.Path(__file__).resolve().parent.parent / 'index.html'
s = p.read_text()
inline = s.split('referrerpolicy="no-referrer"></script>\n<script>', 1)[1].split('</script>', 1)[0]
h = base64.b64encode(hashlib.sha256(inline.encode()).digest()).decode()
new, n = re.subn(r"'sha256-[A-Za-z0-9+/=]+'", f"'sha256-{h}'", s, count=1)
if n != 1: raise SystemExit('No sha256 entry found in the CSP meta tag.')
p.write_text(new); print('CSP script hash:', h)
