import Link from "next/link";

const FEATURES = [
  {
    icon: "🎬",
    title: "إنتاج تلقائي",
    description: "اختر الآيات والقارئ والخلفية — والأداة تنتج الفيديو جاهز للنشر",
  },
  {
    icon: "📱",
    title: "كل المنصات",
    description: "Reels, TikTok, Shorts, YouTube, Twitter, Facebook, WhatsApp — بضغطة واحدة",
  },
  {
    icon: "🎙️",
    title: "+100 قارئ",
    description: "العفاسي، السديس، المعيقلي، الدوسري وغيرهم من أشهر القراء",
  },
  {
    icon: "🎨",
    title: "قوالب احترافية",
    description: "تصاميم إسلامية أنيقة مع خلفيات متنوعة وتأثيرات بصرية",
  },
  {
    icon: "🌍",
    title: "ترجمات متعددة",
    description: "أضف ترجمة الآيات بالإنجليزية وغيرها من اللغات",
  },
  {
    icon: "💰",
    title: "مجاني بالكامل",
    description: "ابدأ مجاناً بدون أي تكلفة أو بطاقة ائتمان",
  },
];

const PLATFORMS = [
  { name: "Instagram Reels", size: "1080x1920", ratio: "9:16" },
  { name: "TikTok", size: "1080x1920", ratio: "9:16" },
  { name: "YouTube Shorts", size: "1080x1920", ratio: "9:16" },
  { name: "YouTube", size: "1920x1080", ratio: "16:9" },
  { name: "Twitter / X", size: "1080x1080", ratio: "1:1" },
  { name: "Facebook", size: "1080x1920", ratio: "9:16" },
  { name: "WhatsApp", size: "1080x1920", ratio: "9:16" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">☪</span>
              <span className="text-xl font-bold text-gradient-gold">
                QuranReels
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted hover:text-foreground transition-colors text-sm">
                المميزات
              </a>
              <a href="#platforms" className="text-muted hover:text-foreground transition-colors text-sm">
                المنصات
              </a>
              <a href="#pricing" className="text-muted hover:text-foreground transition-colors text-sm">
                الأسعار
              </a>
            </nav>
            <Link
              href="/create"
              className="bg-primary hover:bg-primary-dark text-black font-semibold px-5 py-2 rounded-lg transition-all text-sm"
            >
              ابدأ الآن
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full glass-card text-primary text-sm">
            مجاني بالكامل — ابدأ الآن بدون تسجيل
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-noto-arabic)" }}
          >
            أنشئ فيديوهات{" "}
            <span className="text-gradient-gold">قرآنية</span>
            <br />
            احترافية في ثوانٍ
          </h1>
          <p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            اختر الآيات، القارئ، والخلفية — وحمّل فيديو جاهز للنشر على
            Instagram Reels, TikTok, YouTube Shorts وكل المنصات
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-primary hover:bg-primary-dark text-black font-bold px-8 py-4 rounded-xl transition-all text-lg animate-pulse-glow"
            >
              ابدأ إنشاء فيديو مجاناً
            </Link>
          </div>

          {/* Preview mockup */}
          <div className="mt-16 relative">
            <div className="mx-auto w-64 sm:w-72 aspect-[9/16] rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10">
              <div
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                style={{
                  background: "linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #0c0c1d 100%)",
                }}
              >
                <div className="mb-2 text-primary/60 text-xs">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
                <p
                  className="text-white text-xl sm:text-2xl leading-loose mb-4"
                  style={{ fontFamily: "var(--font-noto-arabic)" }}
                >
                  ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ
                </p>
                <p className="text-white/60 text-xs mb-6">
                  All praise is due to Allah, Lord of the worlds
                </p>
                <div className="text-primary/40 text-xs">
                  سورة الفاتحة | آية ٢
                </div>
                <div className="mt-4 text-white/30 text-xs">
                  مشاري العفاسي ♫
                </div>
              </div>
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: "var(--font-noto-arabic)" }}
          >
            كل ما تحتاجه لإنتاج محتوى{" "}
            <span className="text-gradient-gold">قرآني</span>
          </h2>
          <p className="text-muted text-center mb-12 text-lg">
            أدوات قوية وسهلة الاستخدام لصناع المحتوى الإسلامي
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: "var(--font-noto-arabic)" }}
          >
            فيديو واحد —{" "}
            <span className="text-gradient-gold">كل المنصات</span>
          </h2>
          <p className="text-muted text-center mb-12 text-lg">
            صدّر الفيديو بالحجم المناسب لأي منصة تلقائياً
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORMS.map((platform, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {platform.ratio}
                </div>
                <div>
                  <div className="font-medium">{platform.name}</div>
                  <div className="text-muted text-sm">{platform.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: "var(--font-noto-arabic)" }}
          >
            خطط <span className="text-gradient-gold">بسيطة</span> تناسب الجميع
          </h2>
          <p className="text-muted text-center mb-12 text-lg">
            ابدأ مجاناً وطوّر حسب احتياجك
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="glass-card rounded-2xl p-8">
              <div className="text-muted text-sm mb-2">مجاني</div>
              <div className="text-3xl font-bold mb-1">$0</div>
              <div className="text-muted text-sm mb-6">للأبد</div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> 3 فيديوهات/شهر
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> حجم واحد (Reels)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> 6 قراء
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> 8 خلفيات
                </li>
              </ul>
              <Link
                href="/create"
                className="block text-center bg-white/10 hover:bg-white/20 text-foreground font-semibold px-6 py-3 rounded-xl transition-all"
              >
                ابدأ مجاناً
              </Link>
            </div>

            {/* Pro */}
            <div className="glass-card rounded-2xl p-8 border-primary/50 relative">
              <div className="absolute -top-3 right-6 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                الأكثر شعبية
              </div>
              <div className="text-primary text-sm mb-2">احترافي</div>
              <div className="text-3xl font-bold mb-1">$7</div>
              <div className="text-muted text-sm mb-6">/ شهر</div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> 50 فيديو/شهر
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> كل الأحجام والمنصات
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> 100+ قارئ
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> بدون علامة مائية
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> ترجمات متعددة
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> جودة Full HD
                </li>
              </ul>
              <Link
                href="/create"
                className="block text-center bg-primary hover:bg-primary-dark text-black font-bold px-6 py-3 rounded-xl transition-all"
              >
                اشترك الآن
              </Link>
            </div>

            {/* Business */}
            <div className="glass-card rounded-2xl p-8">
              <div className="text-muted text-sm mb-2">أعمال</div>
              <div className="text-3xl font-bold mb-1">$19</div>
              <div className="text-muted text-sm mb-6">/ شهر</div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> فيديوهات غير محدودة
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> كل ميزات الاحترافي
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> جودة 4K
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> API Access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> أولوية في الدعم
                </li>
              </ul>
              <Link
                href="/create"
                className="block text-center bg-white/10 hover:bg-white/20 text-foreground font-semibold px-6 py-3 rounded-xl transition-all"
              >
                اشترك الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-6"
            style={{ fontFamily: "var(--font-noto-arabic)" }}
          >
            ابدأ إنشاء فيديوهاتك القرآنية{" "}
            <span className="text-gradient-gold">الآن</span>
          </h2>
          <p className="text-muted text-lg mb-8">
            لا حاجة للتسجيل — اختر الآيات وحمّل فيديوك فوراً
          </p>
          <Link
            href="/create"
            className="inline-block bg-primary hover:bg-primary-dark text-black font-bold px-10 py-4 rounded-xl transition-all text-lg animate-pulse-glow"
          >
            ابدأ الآن مجاناً
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">☪</span>
            <span className="font-bold text-gradient-gold">QuranReels</span>
          </div>
          <p className="text-muted text-sm">
            صنع بحب لخدمة القرآن الكريم
          </p>
        </div>
      </footer>
    </div>
  );
}
