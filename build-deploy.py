#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
يُجهّز مجلّد dist/ الجاهز للرفع على الاستضافة.

الاستعمال:
    python build-deploy.py                          # بلا نطاق بعد
    python build-deploy.py --domain almanassa.pages.dev   # بعد معرفة العنوان

يستبعد: videos/ و .claude/ و dist/ و README.md وهذا السكربت نفسه.
ينشئ: robots.txt، و sitemap.xml إن أُعطي النطاق.
ينبّه: إن بقيت فيديوهات بلا رابط يوتيوب في assets/js/data.js.
"""

import argparse, fnmatch, json, shutil, subprocess, sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIST = ROOT / 'dist'
PAGES = ['index.html', 'apps.html', 'videos.html', 'guide.html', 'download.html']
SKIP_DIRS = {'videos', '.claude', 'dist', '__pycache__', '.git'}
# ملف المنصّة نفسه لا يُنشر: يُوزَّع بالطلب عبر البريد
SKIP_FILES = {'README.md', 'build-deploy.py', 'unified-platform.html'}
# أنماط تُستبعد أيضًا: أرشيفات البناء وملفات الملاحظات المحلّية
SKIP_GLOBS = ('*.zip', '*.netl.txt', '*.swp', 'Thumbs.db', 'desktop.ini')


def human(n):
    for u in ('ب', 'كب', 'مب', 'جب'):
        if n < 1024:
            return f'{n:.1f} {u}'
        n /= 1024
    return f'{n:.1f} تب'


# يُقيَّم data.js فعليًّا بدل مطابقته بتعبير نمطي: التعبير النمطي ينكسر صامتًا
# عند أي تغيير في التنسيق (مسافة بعد النقطتين مثلًا) فيعطي «كل شيء سليم» كذبًا.
CHECK_JS = r"""
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync('assets/js/data.js', 'utf8') + `
;globalThis.__D={AXES,APPS,VIDEOS,LIBRARY,ytId};`;
const ctx = { console }; vm.createContext(ctx); vm.runInContext(src, ctx);
const { AXES, APPS, VIDEOS, LIBRARY, ytId } = ctx.__D;
const axIds = new Set(AXES.map(a => a.id));
const appIds = new Set(APPS.map(a => a.id));
const vidIds = new Set(VIDEOS.map(v => v.id));
const seen = new Set(), dupIds = [], seenYt = new Map(), dupYt = [];
for (const v of VIDEOS) {
  if (seen.has(v.id)) dupIds.push(v.id); else seen.add(v.id);
  const y = ytId(v);
  if (y) { if (seenYt.has(y)) dupYt.push(seenYt.get(y) + ' + ' + v.id); else seenYt.set(y, v.id); }
}
process.stdout.write(JSON.stringify({
  videos: VIDEOS.length, apps: APPS.length,
  pending: VIDEOS.filter(v => !ytId(v)).map(v => v.id),
  dupIds, dupYt,
  badApp: VIDEOS.filter(v => v.app !== null && !appIds.has(v.app)).map(v => v.id + " -> app:'" + v.app + "'"),
  badAx:  VIDEOS.filter(v => !axIds.has(v.ax)).map(v => v.id + " -> ax:'" + v.ax + "'"),
  badAppVideo: APPS.filter(a => a.video && !vidIds.has(a.video)).map(a => a.id + " -> video:'" + a.video + "'"),
  guides: [...new Set(APPS.filter(a => a.guide).map(a => a.guide).concat(LIBRARY.map(g => g.f)))],
  images: [...new Set(APPS.map(a => a.img).concat(VIDEOS.map(v => v.img)))]
}));
"""


def data_report():
    """يقيّم assets/js/data.js عبر node ويعيد تقرير تماسكه، أو None إن تعذّر."""
    try:
        out = subprocess.run(['node', '-e', CHECK_JS], cwd=ROOT,
                             capture_output=True, text=True, encoding='utf-8')
    except FileNotFoundError:
        print('node غير مثبّت — تُخطّى فحوص تماسك data.js')
        return None
    if out.returncode != 0:
        print('تعذّر قراءة data.js:')
        print((out.stderr or '').strip()[:600])
        return None
    return json.loads(out.stdout)


def missing_assets(rep):
    """يتحقّق أنّ كل دليل ولقطة مشار إليهما في data.js موجودان فعلًا في dist."""
    miss = []
    for g in rep['guides']:
        if not (DIST / 'downloads' / 'guides' / (g + '.pdf')).exists():
            miss.append('downloads/guides/' + g + '.pdf')
    for i in rep['images']:
        name = 'cover.jpeg' if i == 'cover' else i + '.png'
        if not (DIST / 'assets' / 'img' / name).exists():
            miss.append('assets/img/' + name)
    return miss


def dist_edits():
    """ملفات dist/ التي عُدِّلت بعد نسخها — أي تعديلات ستُمحى عند إعادة البناء.

    dist/ مجلّد مولَّد يُحذف كاملًا في كل تشغيل. من السهل جدًّا فتح نسخة منه
    بالخطأ وتعديلها ثم فقدانها بلا أثر (المجلّد مستبعد من git). هذا الحارس
    يوقف البناء بدل أن يمحو صامتًا.
    """
    if not DIST.exists():
        return []
    out = []
    for d in DIST.rglob('*'):
        if d.is_dir():
            continue
        rel = d.relative_to(DIST)
        src = ROOT / rel
        if not src.exists():
            continue                      # ملفات يولّدها السكربت (robots/sitemap)
        if d.stat().st_mtime > src.stat().st_mtime + 2:
            out.append(str(rel).replace('\\', '/'))
    return out


def copy_site():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    (DIST / '_مجلد-مولد-لا-تعدله.txt').write_text(
        chr(10).join([
            'هذا المجلّد يُنشئه build-deploy.py ويُحذف بالكامل في كل تشغيل.',
            'أي تعديل هنا سيضيع. عدّل الملفات الأصلية في جذر المشروع.',
            '',
        ]), encoding='utf-8')
    total = files = 0
    biggest = (0, '')
    for src in ROOT.rglob('*'):
        rel = src.relative_to(ROOT)
        if any(part in SKIP_DIRS for part in rel.parts) or rel.name in SKIP_FILES:
            continue
        if any(fnmatch.fnmatch(rel.name, g) for g in SKIP_GLOBS):
            continue
        if src.is_dir():
            continue
        dst = DIST / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        size = src.stat().st_size
        total += size
        files += 1
        if size > biggest[0]:
            biggest = (size, str(rel).replace('\\', '/'))
    return files, total, biggest


def write_seo(domain):
    if domain:
        base = 'https://' + domain.strip().removeprefix('https://').removeprefix('http://').rstrip('/')
        (DIST / 'robots.txt').write_text(
            f'User-agent: *\nAllow: /\n\nSitemap: {base}/sitemap.xml\n', encoding='utf-8')
        today = date.today().isoformat()
        urls = '\n'.join(
            f'  <url><loc>{base}/{p}</loc><lastmod>{today}</lastmod>'
            f'<priority>{"1.0" if p == "index.html" else "0.8"}</priority></url>'
            for p in PAGES)
        (DIST / 'sitemap.xml').write_text(
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f'{urls}\n</urlset>\n', encoding='utf-8')
        return True
    # بلا نطاق: robots.txt بلا سطر Sitemap، وخريطة موقع خاطئة أسوأ من غيابها
    (DIST / 'robots.txt').write_text('User-agent: *\nAllow: /\n', encoding='utf-8')
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--domain', default='', help='مثال: almanassa.pages.dev')
    ap.add_argument('--force', action='store_true',
                    help='أعد البناء ولو كانت في dist/ تعديلات ستُمحى')
    args = ap.parse_args()

    edits = dist_edits()
    if edits and not args.force:
        print('[توقّف] في dist/ ملفات عُدِّلت بعد بنائها:')
        for e in edits:
            print('   - dist/' + e)
        print()
        print('dist/ مجلّد مولَّد: يُحذف بالكامل ويُعاد بناؤه في كل تشغيل،')
        print('وهو مستبعد من git فلا يمكن استرجاع ما يضيع منه.')
        print('انقل تعديلاتك إلى الملف الأصلي في جذر المشروع (بلا dist/ في المسار)')
        print('ثم أعد التشغيل — أو مرّر --force لمحوها عمدًا.')
        return 2

    files, total, biggest = copy_site()
    had_sitemap = write_seo(args.domain)

    print(f'\n✅ جاهز: {DIST}')
    print(f'   {files} ملفًا · {human(total)}')
    print(f'   أكبر ملف: {biggest[1]} ({human(biggest[0])})')
    print(f'   خريطة الموقع: {"نعم" if had_sitemap else "لا — أعد التشغيل مع --domain بعد معرفة العنوان"}')

    if biggest[0] > 25 * 1024 * 1024:
        print(f'\n⛔ «{biggest[1]}» يتجاوز 25 مب — سترفضه Cloudflare Pages.')

    rep = data_report()
    if rep is None:
        return 1

    print()
    print('[data.js] {} تطبيقًا · {} فيديو'.format(rep['apps'], rep['videos']))
    problems = 0
    for label, items in (
        ('معرّفات فيديو مكرّرة',            rep['dupIds']),
        ('رابط يوتيوب مستعمل مرّتين',       rep['dupYt']),
        ('حقل app لا يطابق أي تطبيق',       rep['badApp']),
        ('حقل ax لا يطابق أي محور',         rep['badAx']),
        ('APPS.video يشير إلى فيديو مفقود', rep['badAppVideo']),
        ('ملفات مشار إليها وغير موجودة',    missing_assets(rep)),
    ):
        if items:
            problems += len(items)
            print()
            print('[خطأ] {} ({}):'.format(label, len(items)))
            for it in items:
                print('   - ' + it)

    if rep['pending']:
        problems += len(rep['pending'])
        print()
        print('[تنبيه] {} فيديو بلا رابط يوتيوب: {}'.format(
            len(rep['pending']), '، '.join(rep['pending'])))
        print('   مجلّد videos/ غير مرفوع، فلن تشتغل هذه الفيديوهات على الإنترنت.')
        print('   املأ الحقل yt لكلٍّ منها في assets/js/data.js ثم أعد تشغيل هذا السكربت.')

    if problems:
        return 1
    print()
    print('[سليم] data.js متماسك، وكل الفيديوهات مربوطة بيوتيوب.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
