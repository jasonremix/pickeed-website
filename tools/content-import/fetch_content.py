# Holt alle öffentlichen Seiten (vorgerenderter SEO-Inhalt) in 6 Sprachen und wandelt sie in einen
# kompakten, bereinigten Baum um (nur erlaubte Tags, nur sichere Links). Keine Ausführung fremden Codes.
import os, sys, json, re, time, urllib.request, urllib.error, html
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor

LANGS = {"de-CH": "", "en-CH": "/en", "fr-CH": "/fr", "it-CH": "/it", "es-419": "/es", "pt-BR": "/pt"}
ALLOWED = {"section","article","h1","h2","h3","h4","p","ul","ol","li","dl","dt","dd","blockquote","strong","em","b","i","small","a","br","table","thead","tbody","tr","th","td","details","summary","figure","figcaption","nav","header","footer","aside","time","mark","code","hr"}
VOID = {"br","hr"}
DROP_WITH_CONTENT = {"script","style","noscript","svg","template","form","button","input","select","textarea","img","picture","video","audio","iframe"}
unknown = {}

class Tree(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True)
        s.root=["root"]; s.stack=[s.root]; s.skip=0; s.in_main=False; s.depth_main=0
    def handle_starttag(s, tag, attrs):
        a=dict(attrs)
        if not s.in_main:
            if tag=="main" and "seo-main" in (a.get("class") or ""): s.in_main=True; s.depth_main=0
            return
        if tag=="main": s.depth_main+=1
        if s.skip or tag in DROP_WITH_CONTENT:
            if tag not in VOID: s.skip+=1
            return
        if tag not in ALLOWED:
            unknown[tag]=unknown.get(tag,0)+1
            return  # Tag entfernen, Inhalt behalten
        node=[tag]
        if tag=="a":
            href=(a.get("href") or "").strip()
            if not re.match(r"^(/(?!/)|https://|mailto:|tel:)", href): href=""
            node.append(href)
        if tag in VOID:
            s.stack[-1].append(node); return
        s.stack[-1].append(node); s.stack.append(node)
    def handle_endtag(s, tag):
        if not s.in_main: return
        if tag=="main":
            if s.depth_main==0: s.in_main=False
            else: s.depth_main-=1
            return
        if s.skip:
            if tag in DROP_WITH_CONTENT or True: s.skip-=1 if tag not in VOID else 0
            return
        if tag not in ALLOWED or tag in VOID: return
        for i in range(len(s.stack)-1,0,-1):
            if s.stack[i][0]==tag:
                del s.stack[i:]; break
    def handle_data(s, data):
        if not s.in_main or s.skip: return
        if not data.strip() and not data.startswith(" "): return
        cur=s.stack[-1]
        base=2 if cur[0]=="a" else 1  # bei Links steht an Stelle 1 die Zieladresse
        if len(cur)>base and isinstance(cur[-1], str): cur[-1]+=data
        else: cur.append(data)

def norm(node):
    if isinstance(node,str): return re.sub(r"\s+"," ",node)
    tag=node[0]; start=2 if tag=="a" else 1
    kids=[norm(k) for k in node[start:]]
    kids=[k for k in kids if not (isinstance(k,str) and k=="")]
    if kids and isinstance(kids[0],str): kids[0]=kids[0].lstrip() if tag not in ("a","strong","em","b","i","small","mark","code","time") else kids[0]
    if kids and isinstance(kids[-1],str): kids[-1]=kids[-1].rstrip() if tag not in ("a","strong","em","b","i","small","mark","code","time") else kids[-1]
    kids=[k for k in kids if k!=""]
    return node[:start]+kids

def meta(h, name):
    m=re.search(r'<meta (?:name|property)="%s" content="([^"]*)"'%re.escape(name), h)
    return html.unescape(m.group(1)) if m else ""

def fetch_url(url):
    """Lädt eine Seite und liefert {title, description, body} oder {error}."""
    err=""
    for attempt in range(3):
        try:
            req=urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0 (preview-builder)"})
            with urllib.request.urlopen(req, timeout=40) as r:
                h=r.read().decode("utf-8")
            t=Tree(); t.feed(h)
            title=re.search(r"<title>(.*?)</title>",h,re.S)
            body=[norm(n) for n in t.root[1:]]
            body=[n for n in body if n!=" " and n!=""]
            return {"title":html.unescape(title.group(1)) if title else "", "description":meta(h,"description"), "body":body}
        except urllib.error.HTTPError as e:
            if e.code==404: return {"error":"404"}
            err=str(e); time.sleep(1+attempt*2)
        except Exception as e:
            err=str(e); time.sleep(1+attempt*2)
    return {"error":err}

def fetch(job):
    locale, prefix, path = job
    url="https://pickeed.com"+prefix+(path if path!="/" or not prefix else "")
    return locale, path, fetch_url(url)

def main(index_file, out_dir):
    paths=[p["path"] for p in json.load(open(index_file)) if p.get("seo")]
    jobs=[(l,pre,p) for l,pre in LANGS.items() for p in paths]
    result={l:{} for l in LANGS}
    done=0
    with ThreadPoolExecutor(max_workers=int(os.environ.get("WORKERS", "6"))) as ex:
        for locale,path,data in ex.map(fetch, jobs):
            result[locale][path]=data; done+=1
            if done%200==0: print("…",done,"/",len(jobs), flush=True)
    errors=[(l,p,d["error"]) for l in result for p,d in result[l].items() if "error" in d]
    for l in result:
        json.dump(result[l], open(f"{out_dir}/{l}.json","w",encoding="utf-8"), ensure_ascii=False, separators=(",",":"))
    print("Seiten:",len(jobs),"Fehler:",len(errors), errors[:5])
    print("Entfernte unbekannte Tags:", unknown)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
