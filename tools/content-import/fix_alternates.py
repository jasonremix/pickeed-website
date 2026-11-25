# Zweiter Durchgang: liest für jede deutsche Seite die hreflang-Alternativen (übersetzte Adressen),
# lädt Sprachversionen mit eigener Adresse nach und schreibt routes.json.
# Ergebnis: <content_dir>/<locale>.json enthält Seiten unter ihrer jeweiligen (übersetzten) Adresse.
import sys, os, json, re, urllib.request
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_content import fetch_url  # noqa: E402

HREF = {"de": "de-CH", "en": "en-CH", "fr": "fr-CH", "it": "it-CH", "es-419": "es-419", "pt-BR": "pt-BR"}
PREFIX = {"de-CH": "", "en-CH": "/en", "fr-CH": "/fr", "it-CH": "/it", "es-419": "/es", "pt-BR": "/pt"}

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (preview-builder)"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8")

def strip_prefix(locale, path):
    pre = PREFIX[locale]
    if pre and (path == pre or path.startswith(pre + "/")):
        path = path[len(pre):]
    return path or "/"

def alternates(path):
    for attempt in range(3):
        try:
            h = get("https://pickeed.com" + path); break
        except Exception:
            if attempt == 2: return path, {"de-CH": path}
    alts = {"de-CH": path}
    for lang, href in re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', h):
        if lang in HREF and lang != "de":
            loc = HREF[lang]
            alts[loc] = strip_prefix(loc, re.sub(r"^https://pickeed\.com", "", href) or "/")
    return path, alts

def main(index_file, content_dir):
    paths = [p["path"] for p in json.load(open(index_file)) if p.get("seo")]
    with ThreadPoolExecutor(max_workers=int(os.environ.get("WORKERS", "6"))) as ex:
        routes = dict(ex.map(alternates, paths))
    store = {loc: json.load(open(f"{content_dir}/{loc}.json", encoding="utf-8")) for loc in PREFIX}
    jobs = []
    for key, alts in routes.items():
        for loc, lpath in alts.items():
            if loc == "de-CH": continue
            have = store[loc].get(lpath)
            if lpath != key or not have or "error" in have:
                jobs.append((loc, key, lpath))
    def run(job):
        loc, key, lpath = job
        return loc, key, lpath, fetch_url("https://pickeed.com" + PREFIX[loc] + ("" if lpath == "/" else lpath))
    with ThreadPoolExecutor(max_workers=int(os.environ.get("WORKERS", "6"))) as ex:
        for loc, key, lpath, data in ex.map(run, jobs):
            if lpath != key: store[loc].pop(key, None)  # 404-Eintrag unter der deutschen Adresse entfernen
            store[loc][lpath] = data
    errors = []
    for loc in PREFIX:
        for p, d in store[loc].items():
            if "error" in d: errors.append((loc, p, d["error"]))
        json.dump(store[loc], open(f"{content_dir}/{loc}.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    json.dump(routes, open(f"{content_dir}/routes.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print("Nachgeladen:", len(jobs), "Fehler:", len(errors), errors[:10])

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
