import Image from "next/image";

// Inline SVG icon components so we don't rely on lucide-react bundle here.
const SmartphoneIcon = ({ className }: { className?: string; strokeWidth?: number }) => (
  // Use the SVG file stored in public/asset/hero/logo.svg. next/image will
  // serve it with proper caching. Width/height chosen to match w-32 h-32 (128px).
  <Image
    src="/asset/hero/logo.svg"
    alt="Pusaka Tulungagung"
    width={160}
    height={160}
    className={className}
  />
);

const BookOpenIcon = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
   <Image
    src="/asset/hero/logo.svg"
    alt="Pusaka Tulungagung"
    width={160}
    height={160}
    className={className}
  />
);

const TrophyIcon = ({ className, strokeWidth = 2. }: { className?: string; strokeWidth?: number }) => (
 <Image
    src="/asset/hero/logo.svg"
    alt="Pusaka Tulungagung"
    width={160}
    height={160}
    className={className}
  />
);

const UsersIcon = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
  <Image
    src="/asset/hero/logo.svg"
    alt="Pusaka Tulungagung"
    width={160}
    height={160}
    className={className}
  />
);

const features = [
  {
  icon: SmartphoneIcon,
    title: "Gratis. Seru. Efektif.",
    description: "Belajar sejarah Duolingo for users atau terbukti efektif! Satu pelajaran pendek di Duolingo sama efektif dengan satu semester kursus universitas. Gratis, seru, dan terbukti efektif!",
    position: "right",
    color: "text-green-500"
  },
  {
  icon: BookOpenIcon,
    title: "Didukung Ilmu Pengetahuan",
    description: "Kami mengulangi metode pengajaran yang terbukti jadi, memberi senjata kepada orang yang untuk menguasai materi baru dengan teknik seperti penguatan interval, pembelajaran kontekstual, dan personalisasi secara massal.",
    position: "left",
    color: "text-purple-500"
  },
  {
  icon: TrophyIcon,
    title: "Tetap Termotivasi",
    description: "Kami mempermudah pembentukan kebiasaan belajar bahasa dengan fitur seperti streak seru, penghargaan serta, dan penghargaan kami, karakter lucu bernama Duo si burung hantu.",
    position: "right",
    color: "text-orange-500"
  },
  {
  icon: UsersIcon,
    title: "Pembelajaran Yang Dipersonalisasi",
    description: "Dengan kombinasi yang tepat dari AI dan ilmu sains bahasa, [Adaptasi] disesuaikan untuk membantu belajar di level dan kecepatan kamu yang tepat.",
    position: "left",
    color: "text-blue-500"
  }
];

export const WhyLearn = () => {
  return (
    <section className="py-20 bg-background landing-font">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                feature.position === 'left' ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Illustration */}
              <div className={`${feature.position === 'left' ? 'md:order-2' : 'md:order-1'}`}>
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0  blur-3xl animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full ">
                    <feature.icon className={`w-40 h-40 ${feature.color}`} strokeWidth={4.} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${feature.position === 'left' ? 'md:order-1' : 'md:order-2'}`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {feature.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};