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

import argparse, fnmatch, re, shutil, sys
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


def pending_videos():
    """يعيد معرّفات الفيديوهات التي لم يُملأ حقل yt الخاص بها بعد."""
    src = (ROOT / 'assets' / 'js' / 'data.js').read_text(encoding='utf-8')
    body = src[src.index('const VIDEOS'):src.index('function ytId')]
    return [vid for vid, yt in re.findall(r"id:'([\w-]+)',\s*yt:'([^']*)'", body) if not yt.strip()]


def copy_site():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
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
    args = ap.parse_args()

    files, total, biggest = copy_site()
    had_sitemap = write_seo(args.domain)

    print(f'\n✅ جاهز: {DIST}')
    print(f'   {files} ملفًا · {human(total)}')
    print(f'   أكبر ملف: {biggest[1]} ({human(biggest[0])})')
    print(f'   خريطة الموقع: {"نعم" if had_sitemap else "لا — أعد التشغيل مع --domain بعد معرفة العنوان"}')

    if biggest[0] > 25 * 1024 * 1024:
        print(f'\n⛔ «{biggest[1]}» يتجاوز 25 مب — سترفضه Cloudflare Pages.')

    left = pending_videos()
    if left:
        print(f'\n⚠️  {len(left)} فيديو بلا رابط يوتيوب: {"، ".join(left)}')
        print('   مجلّد videos/ غير مرفوع، فلن تشتغل هذه الفيديوهات على الإنترنت.')
        print('   املأ الحقل yt لكلٍّ منها في assets/js/data.js ثم أعد تشغيل هذا السكربت.')
        return 1
    print('\n✔ كل الفيديوهات مربوطة بيوتيوب.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
