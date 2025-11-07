const steps = [
  {
    number: "01",
    title: "Pilih Quiz Favoritmu",
    description: "Pilih quiz sesuai dengan minat dan level kemampuanmu",
  },
  {
    number: "02",
    title: "Mainkan dan Kumpulkan XP",
    description: "Jawab pertanyaan dengan benar untuk mendapatkan poin pengalaman",
  },
  {
    number: "03",
    title: "Naik Level dan Bersaing",
    description: "Tingkatkan level dan bersaing dengan pemain lain di leaderboard",
  },
];

export const WhyUs = () => {
  return (
    <section className="py-20 bg-background landing-font">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-16">
          <p className="text-lg font-medium text-foreground mb-4">
            Kenapa Pilih Kita?
          </p>
          <h2 className="text-5xl md:text-7xl font-extrabold block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-8">
            Perjalanan semakin mudah<br />
            Dengan Pilihan-mu
          </h2>
          <div className="inline-block">
            <div className="px-6 py-3 block bg-gradient-to-r from-primary to-primary/80  text-background rounded-full font-medium">
              #Kami Ada untuk setiap Kebutuhan-mu
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-12 mt-20">
          {steps.map((step, index) => (
            <div key={index} className="space-y-4">
              <div className="text-foreground/30 font-medium text-lg">
                {step.number}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};