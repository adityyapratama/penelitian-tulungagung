import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, GamepadIcon, Share2Icon } from "lucide-react";

import { PixelImage } from "@/components/magicui/pixel-image";

import { cn } from "@/lib/utils";
// import AnimatedBeamMultipleOutputDemo from "@/registry/example/animated-beam-multiple-outputs";
import {AnimatedListDemo} from "@/components/our-feature/animates-list";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";



const features = [
    {
    Icon: GamepadIcon,
    name: "Fitur Kami",
    description: "Jelajahi fitur-fitur kami yang menarik dan inovatif.",
    href: "#",
    cta: "Details",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
    ),
  },
  
  
];

export function BentoDemo() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
