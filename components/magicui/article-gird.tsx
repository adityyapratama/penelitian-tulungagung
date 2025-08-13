import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  categories: string;
  href: string;
  cta: string;
  imageUrl?: string;
  imageAlt?: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-6 w-full", // ✅ Changed to vertical stack
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const ArticleCard = ({
  name,
  className,
  background,
  Icon,
  categories,
  description,
  href,
  cta,
  imageUrl,
  imageAlt,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative flex flex-row overflow-hidden rounded-xl h-48", // ✅ Horizontal flex layout
      // light styles
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
    {...props}
  >
    {/* Image Section - Left side */}
    <div className="relative w-80 flex-shrink-0 overflow-hidden">
      {background}
      
      {/* Optional: Direct image support */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt || name}
          fill
          className="object-cover"
        />
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
      
      {/* Category Badge - On image */}
      {categories && (
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
            {categories}
          </span>
        </div>
      )}
    </div>

    {/* Content Section - Right side */}
    <div className="flex-1 p-6 flex flex-col justify-between">
      <div>
        {/* Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          <Icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          asChild
          size="sm"
          className="group-hover:bg-primary group-hover:text-white transition-all duration-300"
        >
          <a href={href} className="flex items-center gap-2">
            {cta}
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </div>
    </div>

    {/* Hover Overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-primary/5" />
  </div>
);

export { ArticleCard, BentoGrid };