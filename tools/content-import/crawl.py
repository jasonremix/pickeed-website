import sys, re, urllib.request, json, os, time
from html.parser import HTMLParser
out = sys.argv[1]
APP_PATHS = re.compile(r"^/(anmelden|melden|status|@|e/|p/|plan|einladung|join|i/|api)")
class Links(HTMLParser):
    def __init__(s): super().__init__(); s.links=[]; s.inmain=False
    def handle_starttag(s,t,a):
        if t=="a":
            h=dict(a).get("href","")
            if h.startswith("/") and not h.startswith("//"): s.links.append(h.split("#")[0].split("?")[0])
def fetch(path):
    req=urllib.request.Request("https://pickeed.com"+path, headers={"User-Agent":"Mozilla/5.0 (preview-builder)","Accept-Language":"de-CH"})
    with urllib.request.urlopen(req, timeout=30) as r: return r.status, r.read().decode("utf-8")
seen=set(); queue=["/"]; found=[]
while queue:
    p=queue.pop(0)
    if p in seen: continue
    seen.add(p)
    try: st,html=fetch(p)
    except Exception as e: print("ERR",p,e); continue
    has_seo = 'id="seo-pre"' in html
    found.append({"path":p,"status":st,"seo":has_seo,"len":len(html)})
    l=Links(); l.feed(html)
    for h in l.links:
        if re.match(r"^/(en|fr|it|es|pt)(/|$)", h): continue
        if APP_PATHS.match(h) or h in seen or re.search(r"\.\w{2,4}$", h): continue
        queue.append(h)
    time.sleep(0.2)
json.dump(found, open(out,"w"), indent=1)
for f in found: print(f["status"], "seo" if f["seo"] else "---", f["len"], f["path"])
