#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
يحدّث القيم الاحتياطية للإصدار في assets/js/data.js من آخر إصدار على GitHub.

الموقع يقرأ الإصدار حيًّا من واجهة GitHub عند كل زيارة، فهذه القيم لا تظهر
إلا لمن تعذّر عليه الاتصال أو عُطِّل عنده جافاسكريبت. تشغيل هذا السكربت
اختياري إذن — لكنه يبقيها دقيقة.

    python bump.py            # اعرض واكتب
    python bump.py --check    # اعرض الفرق فقط بلا كتابة
"""

import argparse, io, json, re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / 'assets' / 'js' / 'data.js'
API = ('https://api.github.com/repos/profamine/'
       'minsassatatadibiralmadrassi/releases/latest')
STABLE = 'MansatTadbir-setup.exe'


def latest():
    req = urllib.request.Request(API, headers={
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'mansat-site-bump'
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        d = json.load(r)
    asset = next((a for a in d.get('assets', []) if a['name'] == STABLE), None)
    if asset is None:
        print(f'[خطأ] الإصدار {d.get("tag_name")} لا يحوي أصلًا باسم {STABLE}.')
        print('      زرّ التنزيل في الموقع سيعطي 404. أضفه في tools/release.mjs')
        print('      بمستودع التطبيق، أو غيّر APP_SETUP في data.js.')
        return None
    return {
        'v': str(d.get('tag_name', '')).lstrip('vV'),
        'size': asset['size'],
        'sha': str(asset.get('digest', '')).removeprefix('sha256:'),
    }


def human_mb(n):
    s = f'{n / 1048576:.1f}'.rstrip('0').rstrip('.')
    return f'{s} ميغابايت'


def current(src):
    def grab(name):
        m = re.search(rf"const {name}\s*=\s*'([^']*)'", src)
        return m.group(1) if m else ''
    return {'v': grab('APP_VERSION'), 'size': grab('APP_SIZE'), 'sha': grab('APP_SHA256')}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true', help='اعرض الفرق بلا كتابة')
    args = ap.parse_args()

    try:
        rel = latest()
    except Exception as e:
        print(f'[خطأ] تعذّر الاتصال بـ GitHub: {e}')
        return 1
    if rel is None:
        return 1

    src = io.open(DATA, encoding='utf-8').read()
    cur = current(src)
    new = {'v': rel['v'], 'size': human_mb(rel['size']), 'sha': rel['sha']}

    rows = [('APP_VERSION', cur['v'], new['v']),
            ('APP_SIZE', cur['size'], new['size']),
            ('APP_SHA256', cur['sha'][:16] + '…', new['sha'][:16] + '…')]
    changed = [r for r in rows if r[1] != r[2]]

    print(f'آخر إصدار على GitHub: v{rel["v"]}  ({human_mb(rel["size"])})')
    print()
    for name, old, nw in rows:
        mark = '←' if (name, old, nw) in changed else '='
        print(f'  {name:<12} {old:<22} {mark} {nw}')
    print()

    if not changed:
        print('[سليم] القيم الاحتياطية مطابقة لآخر إصدار — لا شيء ليُحدَّث.')
        return 0
    if args.check:
        print(f'[فرق] {len(changed)} قيمة تحتاج تحديثًا. شغّله بلا --check للكتابة.')
        return 1

    for name, val in (('APP_VERSION', new['v']),
                      ('APP_SIZE', new['size']),
                      ('APP_SHA256', new['sha'])):
        src = re.sub(rf"(const {name}\s*=\s*')[^']*(')", rf"\g<1>{val}\g<2>", src, count=1)
    src = re.sub(r'\(آخر تحديث يدوي: v[^)]*\)', f'(آخر تحديث يدوي: v{new["v"]})', src, count=1)
    io.open(DATA, 'w', encoding='utf-8').write(src)

    print(f'[تمّ] حُدِّثت {len(changed)} قيمة في assets/js/data.js')
    print('      شغّل build-deploy.py ثم ادفع.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
