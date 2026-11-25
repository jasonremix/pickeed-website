# Liest Navigations-/Fusszeilen-Beschriftungen, Titel und Beschreibung der Startseite je Sprache.
import sys, re, json, html, urllib.request
out=sys.argv[1]
LANGS={"de-CH":"/","en-CH":"/en","fr-CH":"/fr","it-CH":"/it","es-419":"/es","pt-BR":"/pt"}
res={}
for loc,path in LANGS.items():
    h=urllib.request.urlopen(urllib.request.Request("https://pickeed.com"+path,headers={"User-Agent":"Mozilla/5.0"}),timeout=40).read().decode()
    foot=re.search(r'<footer class="seo-foot">(.*?)</footer>',h,re.S).group(1)
    links=[(re.sub(r"^/(en|fr|it|es|pt)(?=/|$)","",a) or "/", html.unescape(t)) for a,t in re.findall(r'<a href="([^"]+)"[^>]*>([^<]+)</a>',foot)]
    head=re.search(r'<header class="seo-head">(.*?)</header>',h,re.S).group(1)
    nav=[(re.sub(r"^/(en|fr|it|es|pt)(?=/|$)","",a) or "/", html.unescape(t)) for a,t in re.findall(r'<a href="([^"]+)"[^>]*>([^<]+)</a>',head)]
    copy=re.search(r'<p>(©[^<]+)</p>',foot)
    title=html.unescape(re.search(r"<title>(.*?)</title>",h,re.S).group(1))
    desc=html.unescape(re.search(r'<meta name="description" content="([^"]*)"',h).group(1))
    res[loc]={"footer":links,"header":nav,"copy":html.unescape(copy.group(1)) if copy else "","title":title,"description":desc}
json.dump(res,open(out,"w"),ensure_ascii=False,indent=1)
for l,v in res.items(): print(l, v["title"], "|", [t for _,t in v["footer"]][:14])
