/* ═══════════════════════════════════════════════════════════
   سجلّ المنصّة — المحاور والتطبيقات والفيديوهات والأدلة
   يُحمَّل عبر <script src> ليعمل حتى عند فتح الموقع محليًّا (file://)
   ═══════════════════════════════════════════════════════════ */

/* ── أيقونات SVG (مسارات فقط) ── */
const ICONS = {
  grad:'<path d="M12 3 2.8 7.6 12 12.2l9.2-4.6z"/><path d="M6.4 9.9v5.2c0 1.7 2.5 3 5.6 3s5.6-1.3 5.6-3V9.9"/><path d="M21.2 7.6v6"/>',
  gauge:'<path d="M4 17a8.4 8.4 0 1 1 16 0"/><path d="m12 17 4-5.4"/><circle cx="12" cy="17" r="1.4"/>',
  brief:'<rect x="3" y="7.2" width="18" height="12.6" rx="2.4"/><path d="M8.6 7.2V5.6a1.8 1.8 0 0 1 1.8-1.8h3.2a1.8 1.8 0 0 1 1.8 1.8v1.6"/><path d="M3 12.6h18"/>',
  mail:'<rect x="2.8" y="5" width="18.4" height="14" rx="2.4"/><path d="m3.6 6.4 8.4 6 8.4-6"/>',
  wallet:'<path d="M3.4 8.2A2.2 2.2 0 0 1 5.6 6h11.8a2.2 2.2 0 0 1 2.2 2.2v9.6a2.2 2.2 0 0 1-2.2 2.2H5.6a2.2 2.2 0 0 1-2.2-2.2z"/><path d="M3.4 9.6h13.4a2 2 0 0 1 0 4H3.4"/><circle cx="8" cy="11.6" r=".9"/>',
  compass:'<circle cx="12" cy="12" r="8.6"/><path d="m15.4 8.6-2 4.6-4.6 2 2-4.6z"/>',
  cal:'<rect x="3.2" y="5" width="17.6" height="15.4" rx="2.4"/><path d="M3.2 9.6h17.6M8 3.4v3.2M16 3.4v3.2"/><path d="M7.4 13h3M13.6 13h3M7.4 16.6h3M13.6 16.6h3"/>',
  users:'<circle cx="9" cy="8" r="3.4"/><path d="M2.8 19.4c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/><path d="M16.4 5.2a3.2 3.2 0 0 1 0 6"/><path d="M18 14.2c2 .7 3.4 2.4 3.4 5.2"/>',
  key:'<circle cx="8.2" cy="12" r="3.8"/><path d="M12 12h9.2"/><path d="M17.6 12v3.2M20.4 12v2.4"/>',
  family:'<circle cx="7.6" cy="6.4" r="2.7"/><path d="M3.4 19.4v-4.2a4.2 4.2 0 0 1 8.4 0v4.2"/><circle cx="16.9" cy="10.8" r="2.1"/><path d="M13.8 19.4v-2.8a3.1 3.1 0 0 1 6.2 0v2.8"/>',
  chart:'<path d="M4 4v16h16"/><path d="m7.5 15 3.2-4 3 2.4 4.2-6"/><circle cx="10.7" cy="11" r="1.1"/><circle cx="13.7" cy="13.4" r="1.1"/>',
  life:'<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="3.6"/><path d="m6.1 6.1 3.4 3.4M18 6.1l-3.4 3.4M6.1 18l3.4-3.4M18 18l-3.4-3.4"/>',
  rank:'<path d="M4 20.4h4.4V13H4zM9.8 20.4h4.4V4.6H9.8zM15.6 20.4H20v-11h-4.4z"/>',
  cert:'<rect x="3.4" y="4" width="17.2" height="12" rx="2.4"/><path d="M7 8.2h10M7 11.6h6"/><path d="M9 16v5.2l3-1.9 3 1.9V16"/>',
  usercheck:'<circle cx="10" cy="8" r="3.8"/><path d="M3 20c0-3.6 3.1-6 7-6 1 0 2 .2 2.8.5"/><path d="m15 17.4 2 2 4-4.2"/>',
  handover:'<rect x="5" y="4.4" width="14" height="16.2" rx="2.4"/><path d="M9.2 4.4V3.2h5.6v1.2"/><path d="M8.4 12.6h7.2"/><path d="m13 10.2 2.6 2.4-2.6 2.4"/>',
  book:'<path d="M4 5.6A2.6 2.6 0 0 1 6.6 3H20v15H6.6A2.6 2.6 0 0 0 4 20.6z"/><path d="M4 18.6A2.6 2.6 0 0 1 6.6 16H20"/><path d="M8 7.6h7"/>',
  send:'<path d="M21 3 10.4 13.6"/><path d="M21 3 14.4 21l-4-7.4L3 9.6z"/>',
  coins:'<ellipse cx="9" cy="6.4" rx="6" ry="2.8"/><path d="M3 6.4v5c0 1.6 2.7 2.9 6 2.9s6-1.3 6-2.9v-5"/><path d="M15 11.4c3 .3 6 1.5 6 3v3c0 1.6-2.7 2.9-6 2.9s-6-1.3-6-2.9v-3"/>',
  shield:'<path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  box:'<path d="m12 3 8.4 4.2v9.6L12 21l-8.4-4.2V7.2z"/><path d="M3.6 7.2 12 11.4l8.4-4.2M12 11.4V21"/>',
  target:'<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.2"/>',
  map:'<path d="M9 4.4 3.6 6.6v13L9 17.4l6 2.2 5.4-2.2v-13L15 6.6z"/><path d="M9 4.4v13M15 6.6v13"/>',
  dl:'<path d="M12 3.4v11.6"/><path d="m7.4 10.6 4.6 4.6 4.6-4.6"/><path d="M4 16.8v2.2A2.2 2.2 0 0 0 6.2 21h11.6a2.2 2.2 0 0 0 2.2-2.2v-2.2"/>',
  play:'<path d="M7.4 4.6 19 12 7.4 19.4z" fill="currentColor" stroke="none"/>',
  pdf:'<path d="M14 3H7.2A2.2 2.2 0 0 0 5 5.2v13.6A2.2 2.2 0 0 0 7.2 21h9.6a2.2 2.2 0 0 0 2.2-2.2V8z"/><path d="M14 3v5h5"/><path d="M8.6 13.4h6.8M8.6 16.6h4.4"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.6"/><path d="m15.8 15.8 4.4 4.4"/>',
  arrow:'<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  arrowl:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.4M12 19.2v2.4M4.2 4.2 5.9 5.9M18.1 18.1l1.7 1.7M2.4 12h2.4M19.2 12h2.4M4.2 19.8 5.9 18.1M18.1 5.9l1.7-1.7"/>',
  moon:'<path d="M20 14.5A8.4 8.4 0 0 1 9.5 4a8.4 8.4 0 1 0 10.5 10.5z"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  x:'<path d="M6 6 18 18M18 6 6 18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="m4.6 12.4 4.8 4.8L19.4 7.2"/>',
  bolt:'<path d="M13.4 2.6 4 13.4h6.2L10.6 21.4 20 10.6h-6.2z"/>',
  lock:'<rect x="4.4" y="10.4" width="15.2" height="10.2" rx="2.4"/><path d="M8 10.4V7.6a4 4 0 0 1 8 0v2.8"/>',
  wifi:'<path d="M2.6 9.2a14 14 0 0 1 18.8 0"/><path d="M6 12.8a9 9 0 0 1 12 0"/><path d="M9.4 16.3a4.2 4.2 0 0 1 5.2 0"/><circle cx="12" cy="19.6" r="1.1"/>',
  file:'<path d="M14 3H7.2A2.2 2.2 0 0 0 5 5.2v13.6A2.2 2.2 0 0 0 7.2 21h9.6a2.2 2.2 0 0 0 2.2-2.2V8z"/><path d="M14 3v5h5"/>',
  clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 2"/>',
  star:'<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.7l5.8-.8z"/>',
  layers:'<path d="m12 3 9 4.6-9 4.6-9-4.6z"/><path d="m3 12.4 9 4.6 9-4.6"/><path d="m3 16.9 9 4.6 9-4.6"/>',
  print:'<path d="M6.4 9V3.6h11.2V9"/><rect x="3.4" y="9" width="17.2" height="7.6" rx="2"/><path d="M6.4 14h11.2v6.4H6.4z"/>',
  mailat:'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a2.6 2.6 0 0 0 5.2 0V12a9.2 9.2 0 1 0-3.6 7.3"/>'
};

const icon = (n, s = 21, w = 1.75) =>
  `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="${w}"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ── المحاور الستة ── */
const AXES = [
  { id:'schooling', n:'التمدرس والتلاميذ',      d:'الحصص، الأفواج، التلاميذ والأولياء',   ic:'grad',    c:'var(--a1)', c2:'var(--a1b)', hex:'#0ea472' },
  { id:'assess',    n:'التقويم والدعم',          d:'الروائز، التحليل والدعم الممتد',       ic:'gauge',   c:'var(--a2)', c2:'var(--a2b)', hex:'#0e93b5' },
  { id:'staff',     n:'الأطر والتدبير الإداري',  d:'الترتيب، الشواهد وتتبّع التغيبات',      ic:'brief',   c:'var(--a3)', c2:'var(--a3b)', hex:'#4f6ef7' },
  { id:'mail',      n:'المراسلات والوثائق',      d:'الصادر والوارد وطلبات الوثائق',        ic:'mail',    c:'var(--a4)', c2:'var(--a4b)', hex:'#9333ea' },
  { id:'finance',   n:'التدبير المالي والمادي',  d:'المداخيل، التأمين وجرد الممتلكات',     ic:'wallet',  c:'var(--a5)', c2:'var(--a5b)', hex:'#e0484d' },
  { id:'lead',      n:'القيادة والتخطيط',        d:'المشروع، المعطيات المرجعية والأدلة',    ic:'compass', c:'var(--a6)', c2:'var(--a6b)', hex:'#d97706' }
];

/* ── التطبيقات التسعة عشر ──
   img: لقطة الشاشة | guide: ملف الدليل | video: الفيديو التوضيحي        */
const APPS = [
  { id:'hisas',    ax:'schooling', ic:'cal',       t:'مُوزِّع الحصص',              d:'توزيع الحصص الأسبوعية على الأساتذة والأقسام في مؤسسات الريادة، مع احترام الغلاف الزمني الرسمي وتفادي التعارضات.', img:'app01', guide:'hisas',   video:'hisas' },
  { id:'afwaj',    ax:'schooling', ic:'users',     t:'توزيع الأفواج',              d:'تكوين أفواج متوازنة عدديًّا وبيداغوجيًّا مع مراعاة لمّ شمل العائلات وتوزيع الجنسين.', img:'app02', guide:'afwaj' },
  { id:'codes',    ax:'schooling', ic:'key',       t:'الأرقام السرية للتلاميذ',    d:'إنشاء رموز دخول التلاميذ إلى منظومة مسار وطبعها في بطاقات جاهزة للتوزيع.', img:'app03', guide:'codes' },
  { id:'awlia',    ax:'schooling', ic:'family',    t:'تدبير التلاميذ والأولياء',   d:'بطاقات التلاميذ وأوليائهم، وتتبّع الزيارات والملاحظات والاتصالات في سجلّ واحد.', img:'app04' },

  { id:'taqwim',   ax:'assess',    ic:'gauge',     t:'مِرصاد التقويم',             d:'تفريغ نتائج التقويمات بالكفايات وتتبّع تحصيل التلاميذ عبر لوحة قيادة تفاعلية.', img:'app05', guide:'taqwim',  video:'taqwim' },
  { id:'tarl',     ax:'assess',    ic:'chart',     t:'تحليل روائز TaRL',           d:'تحويل ملفات روائز دعم التعلّمات الأساس إلى مؤشرات وقرارات عملية للدعم.', img:'app06', video:'tarl' },
  { id:'daam',     ax:'assess',    ic:'life',      t:'مِرصاد الدعم الممتد',        d:'صورة المؤسسة بعد الرائز البعدي، وحجم الدعم المطلوب لكل تلميذ ومادة ومستوى.', img:'app07', guide:'daam',    video:'daam' },

  { id:'tartib',   ax:'staff',     ic:'rank',      t:'ترتيب الأساتذة',             d:'ترتيب الأطر وفق المعايير الرسمية وتحديد الفائض بشفافية ومحاضر جاهزة للطبع.', img:'app08', guide:'tartib',  video:'tartib' },
  { id:'shawahid', ax:'staff',     ic:'cert',      t:'مُحرِّر شواهد العمل',        d:'تحرير وطبع شواهد العمل بالعربية والفرنسية بنماذج رسمية قابلة للتخصيص.', img:'app09', guide:'shawahid',video:'shawahid' },
  { id:'mirsad',   ax:'staff',     ic:'usercheck', t:'مِرصاد — تغيبات الأطر',      d:'جرد وتتبّع تغيبات الأطر التربوية والإدارية وإصدار الجذاذات الشهرية.', img:'app10', guide:'mirsad',  video:'ghiyabat' },
  { id:'taslim',   ax:'staff',     ic:'handover',  t:'محضر تسليم المهام',          d:'تحرير وطبع محاضر تسليم وتسلّم المهام في التعليم الابتدائي وفق المسطرة الجاري بها العمل.', img:'app11', guide:'taslim',  video:'mahdir' },

  { id:'sijil',    ax:'mail',      ic:'book',      t:'سجل المراسلات',              d:'تسجيل الصادر والوارد، وطبع أوراق الإرسال والإحصائيات السنوية للمراسلات.', img:'app12', guide:'sijil',   video:'morasalat' },
  { id:'wathaiq',  ax:'mail',      ic:'send',      t:'مراسلات الوثائق المدرسية',   d:'تتبّع طلبات ومراسلات الوثائق المدرسية من الطلب إلى التسليم دون ضياع.', img:'app13', guide:'wathaiq', video:'moughadara' },

  { id:'mali',     ax:'finance',   ic:'coins',     t:'التدبير المالي للجمعية',     d:'مداخيل ومصاريف جمعية دعم مدرسة النجاح، مع الموازنة والتقارير المالية.', img:'app14', guide:'mali',    video:'finance' },
  { id:'tamin',    ax:'finance',   ic:'shield',    t:'التأمين المدرسي',            d:'إعداد لوائح التأمين المدرسي وتتبّع الأداءات والمبالغ المحصّلة قسمًا قسمًا.', img:'app15', guide:'tamin',   video:'assurance' },
  { id:'jard',     ax:'finance',   ic:'box',       t:'جرد ممتلكات المؤسسة',        d:'منظومة جرد ممتلكات المؤسسة التعليمية وتتبّع حالتها وحركتها بين القاعات.', img:'app16', video:'inventaire' },

  { id:'mashrou',  ax:'lead',      ic:'target',    t:'مِرآة — مشروع المؤسسة',      d:'إعداد وتقديم مشروع المؤسسة المندمج ومؤشراته وبطاقات أنشطته.', img:'app17', guide:'mashrou', video:'projet' },
  { id:'sabora',   ax:'lead',      ic:'gauge',     t:'السبورة المرجعية',           d:'تدبير المعطيات المرجعية للمؤسسة ولوحات قيادتها في واجهة واحدة.', img:'app18', guide:'sabora',  video:'tableau-reference' },
  { id:'dalil',    ax:'lead',      ic:'map',       t:'دليل المؤسسات التعليمية',    d:'بحث في المؤسسات العمومية بالمغرب: العناوين والهواتف والأكواد والنيابات.', img:'app19', video:'guide' }
];

/* ═══════════════════════════════════════════════════════════════════════
   ★★★  روابط يوتيوب — ضع الروابط هنا  ★★★

   ارفع كل فيديو إلى قناتك على يوتيوب، ثم انسخ رابطه والصقه بين
   علامتَي التنصيص في الحقل yt المقابل له في الجدول أسفله.

   يُقبل أي شكل من هذه الأشكال، انسخه كما هو من شريط العنوان:
     yt:'https://youtu.be/dQw4w9WgXcQ'
     yt:'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
     yt:'dQw4w9WgXcQ'                      ← المعرّف وحده

   • ما دام الحقل فارغًا ('') يُشغَّل الفيديو من مجلّد videos/ كما هو الآن،
     فالموقع يظلّ يعمل قبل الرفع وبعده دون أي تعديل آخر.
   • بعد ملء الروابط السبعة يمكنك حذف مجلّد videos/ كاملًا،
     فينزل حجم الموقع من 367 مب إلى نحو 30 مب.
   • على يوتيوب اختر «غير مُدرَج / Unlisted» إن أردت ألا يظهر الفيديو
     في البحث ويبقى مشاهَدًا عبر الموقع فقط.
   ═══════════════════════════════════════════════════════════════════════ */

const VIDEOS = [
  {
    id: 'platform-full',
    yt: '',
    app: null,
    t: 'الجولة الكاملة في المنصّة الموحّدة',
    d: 'عرض شامل للمنصّة من التثبيت إلى الاستعمال اليومي، تطبيقًا تطبيقًا.',
    dur: '71:18',
    len: 4278,
    img: 'cover',
    ax: 'lead',
    featured: true
  },

  {
    id: 'hisas',
    yt: 'https://www.youtube.com/watch?v=9R6LEKzypAk',
    app: 'hisas',
    t: 'توزيع الحصص بمؤسسات الريادة',
    d: 'بناء جدول الحصص الأسبوعي ومعالجة التعارضات آليًّا.',
    dur: '1:25',
    len: 85,
    img: 'app01',
    ax: 'schooling'
  },


  {
    id: 'taqwim',
    yt: 'https://www.youtube.com/watch?v=IpUwWLhKVbw',
    app: 'taqwim',
    t: 'مِرصاد التقويم — تتبّع الكفايات',
    d: 'من رفع ملفات الشبكات إلى لوحة القيادة وخطة الدعم الجاهزة للطبع.',
    dur: '2:55',
    len: 175,
    img: 'app05',
    ax: 'assess'
  },

  {
    id: 'tarl',
    yt: 'https://www.youtube.com/watch?v=9hTnLf1itrw',
    app: 'tarl',
    t: 'تحليل نتائج روائز دعم التعلّمات الأساس',
    d: 'تحويل ملف الروائز الخام إلى مؤشرات ومجموعات دعم قابلة للتنفيذ.',
    dur: '1:43',
    len: 103,
    img: 'app06',
    ax: 'assess'
  },

  {
    id: 'daam',
    yt: 'https://www.youtube.com/watch?v=iDf6_68sTE4',
    app: 'daam',
    t: 'استثمار نتائج الروائز — الدعم الممتد',
    d: 'قراءة الرائز البعدي وتحديد الفئات المستهدفة وحجم الدعم المطلوب.',
    dur: '2:00',
    len: 120,
    img: 'app07',
    ax: 'assess'
  },

  {
    id: 'tartib',
    yt: 'https://www.youtube.com/watch?v=rVTv_rp9Bz8',
    app: 'tartib',
    t: 'ترتيب الأساتذة وتحديد الفائض',
    d: 'تطبيق المعايير الرسمية للترتيب واستخراج المحضر النهائي.',
    dur: '1:37',
    len: 97,
    img: 'app08',
    ax: 'staff'
  },

  {
    id: 'shawahid',
    yt: 'https://www.youtube.com/watch?v=3RLx3dXQwpg',
    app: 'shawahid',
    t: 'مُحرِّر شواهد العمل',
    d: 'تحرير شهادة عمل بالعربية أو الفرنسية وطبعها في أقل من دقيقة.',
    dur: '1:55',
    len: 115,
    img: 'app09',
    ax: 'staff'
  },

  {
    id: 'ghiyabat',
    yt: 'https://www.youtube.com/watch?v=6KeB-mjllJo',
    app: 'mirsad',
    t: 'تدبير وجرد تغيبات الأطر التربوية',
    d: 'تدبير تغيبات الأطر التربوية وجردها وتتبع وضعيتها داخل المؤسسة.',
    dur: '0:57',
    len: 57,
    img: 'app10',
    ax: 'staff'
  },

  {
    id: 'mahdir',
    yt: 'https://www.youtube.com/watch?v=cHgbcaXci-Y',
    app: 'taslim',
    t: 'محضر تسليم المهام',
    d: 'إعداد محضر تسليم المهام وتوثيق المعطيات الأساسية للمؤسسة.',
    dur: '2:38',
    len: 158,
    img: 'app11',
    ax: 'staff'
  },

  {
    id: 'morasalat',
    yt: 'https://www.youtube.com/watch?v=qrebdjvz8ZE',
    app: 'sijil',
    t: 'سجل المراسلات',
    d: 'تدبير وتوثيق مراسلات المؤسسة وتنظيم سجل المراسلات بسهولة.',
    dur: '1:34',
    len: 94,
    img: 'app12',
    ax: 'mail'
  },

  {
    id: 'moughadara',
    yt: 'https://www.youtube.com/watch?v=oerWFunpIqs',
    app: 'wathaiq',
    t: 'مراسلات الوثائق — تدبير مغادرة ووفود التلاميذ',
    d: 'إعداد وتدبير الوثائق والمراسلات المتعلقة بمغادرة ووفود التلاميذ.',
    dur: '4:20',
    len: 260,
    img: 'app13',
    ax: 'mail'
  },

  {
    id: 'finance',
    yt: 'https://www.youtube.com/watch?v=l_E2znga8hk',
    app: 'mali',
    t: 'التدبير المالي لجمعية مدرسة النجاح',
    d: 'تسهيل تدبير العمليات المالية لجمعية مدرسة النجاح وتتبعها.',
    dur: '5:06',
    len: 306,
    img: 'app14',
    ax: 'finance'
  },

  {
    id: 'assurance',
    yt: 'https://www.youtube.com/watch?v=AzCtCZToAk0',
    app: 'tamin',
    t: 'التأمين المدرسي',
    d: 'تدبير معطيات التأمين المدرسي وتتبع المستفيدين والوثائق المرتبطة به.',
    dur: '0:32',
    len: 32,
    img: 'app15',
    ax: 'finance'
  },

  {
    id: 'inventaire',
    yt: 'https://www.youtube.com/watch?v=iqlBWiss2Cw',
    app: 'jard',
    t: 'جرد ممتلكات المؤسسة',
    d: 'جرد ممتلكات المؤسسة وتنظيم المعطيات الخاصة بالتجهيزات والمعدات.',
    dur: '2:23',
    len: 143,
    img: 'app16',
    ax: 'finance'
  },

  {
    id: 'projet',
    yt: '',
    app: 'mashrou',
    t: 'مِرآة — مشروع المؤسسة المندمج',
    d: 'إعداد مشروع المؤسسة المندمج ومؤشراته وبطاقات الأنشطة وتتبع إنجازها.',
    dur: '8:12',
    len: 492,
    img: 'app17',
    ax: 'lead'
  },

  {
    id: 'tableau-reference',
    yt: 'https://www.youtube.com/watch?v=32iumNclrJI',
    app: 'sabora',
    t: 'السبورة المرجعية',
    d: 'تدبير السبورة المرجعية وتنظيم المعطيات الأساسية للمؤسسة.',
    dur: '5:28',
    len: 328,
    img: 'app18',
    ax: 'lead'
  },

  {
    id: 'guide',
    yt: 'https://www.youtube.com/watch?v=XAU-n70bE_k',
    app: 'dalil',
    t: 'دليل المؤسسات التعليمية',
    d: 'الوصول السريع إلى دليل المؤسسات التعليمية وتنظيم معلوماتها.',
    dur: '3:01',
    len: 181,
    img: 'app19',
    ax: 'lead'
  },

];

/* يستخرج معرّف يوتيوب من أي صيغة رابط، ويعيد '' إن كان الحقل فارغًا أو غير صالح */
function ytId(v) {
  const raw = String((v && v.yt) || '').trim();
  if (!raw) return '';
  const m = raw.match(/(?:youtu\.be\/|\/embed\/|\/live\/|\/shorts\/|[?&]v=)([\w-]{11})/)
         || raw.match(/^([\w-]{11})$/);
  return m ? m[1] : '';
}

/* ── الأدلة العامة (مكتبة PDF) ── */
const LIBRARY = [
  { f:'handbook-full',    t:'الكتاب المرجعي الشامل',          s:'8.5 مب',  d:'المرجع الكامل للمنصّة وتطبيقاتها',    name:'المنصّة الموحّدة للتدبير المدرسي — الكتاب المرجعي.pdf' },
  { f:'apps-illustrated', t:'دليل التطبيقات المصوَّر',        s:'5.0 مب',  d:'19 تطبيقًا بلقطات شاشة حقيقية',        name:'دليل التطبيقات المصوَّر — المنصّة الموحّدة.pdf' },
  { f:'platform-guide',   t:'دليل استعمال المنصّة',           s:'1.8 مب',  d:'الواجهة، الألسنة، والتنقّل بين التطبيقات', name:'دليل استعمال المنصّة الموحّدة.pdf' },
  { f:'intro-card',       t:'البطاقة التعريفية',              s:'170 كب',  d:'صفحة واحدة للتعريف والمشاركة',         name:'بطاقة تعريفية — المنصّة الموحّدة.pdf' },
  { f:'sabora-cards',     t:'بطاقات السبورة المرجعية',        s:'535 كب',  d:'بطاقات المعطيات المرجعية للمؤسسة',     name:'بطاقات السبورة المرجعية.pdf' }
];

/* ── مسارات الأصول ── */
const P = {
  img:   id => `assets/img/${id}.png`,
  cover: 'assets/img/cover.jpeg',
  video: id => `videos/${id}.mp4`,
  guide: id => `downloads/guides/${id}.pdf`
};
const imgOf = id => id === 'cover' ? P.cover : P.img(id);

const AX  = id => AXES.find(a => a.id === id) || AXES[0];
const APP = id => APPS.find(a => a.id === id);
const VID = id => VIDEOS.find(v => v.id === id);

/* ═══════════════════════════════════════════════════════════
   استمارة الطلب — استمارة جوجل مضمَّنة
   ───────────────────────────────────────────────────────────
   الاستمارة تُدار من جوجل: النصّ والحقول والردود كلّها هناك،
   والنتائج تتراكم في جدول Sheets. الموقع يضمّنها فقط.

   لتبديل الاستمارة: افتحها ← «إرسال» ← تبويب <> ← انسخ الرابط
   من كود التضمين (ينتهي بـ /viewform?embedded=true) وضعه أدناه.

   GFORM_SHORT هو الرابط القصير للمشاركة خارج الموقع (واتساب مثلًا).
   ═══════════════════════════════════════════════════════════ */
const GFORM_ID    = '1FAIpQLSd7g99IHO5tY2zsFmni97HBRrrU10bmX45da8aqimafWY-aeA';
const GFORM_EMBED = `https://docs.google.com/forms/d/e/${GFORM_ID}/viewform?embedded=true`;
const GFORM_OPEN  = `https://docs.google.com/forms/d/e/${GFORM_ID}/viewform`;
const GFORM_SHORT = 'https://forms.gle/QfMZfJUTAKqEHwdq7';
