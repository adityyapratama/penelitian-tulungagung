"use client"
import type React from "react"
import { useRef } from "react"
import { useScroll, useTransform, motion, type MotionValue } from "motion/react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export const ContainerScroll = ({
  titleComponent,
  children,
  className,
}: {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
  className?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const isMobile = useIsMobile()

  const scaleDimensions = () => {
    return isMobile ? [0.6, 0.95] : [1.1, 1]
  }

  const rotate = useTransform(scrollYProgress, [0, 0.6], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 0.6], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 0.6], [0, -100])

  return (
    <div
      className={cn(
        "h-[70rem] sm:h-[80rem] lg:h-[90rem] flex items-center justify-center relative p-4 sm:p-8 md:p-12 lg:p-20",
        className,
      )}
      ref={containerRef}
    >
      <div
        className="relative w-full py-10 sm:py-20 md:py-32 lg:py-40"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  )
}

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>
  titleComponent: string | React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="max-w-2xl sm:max-w-4xl lg:max-w-6xl mx-auto text-center px-4 sm:px-6"
    >
      {titleComponent}
    </motion.div>
  )
}

export const Card = ({
  rotate,
  scale,
  translate,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  translate: MotionValue<number>
  children: React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "max-w-2xl sm:max-w-4xl lg:max-w-6xl -mt-8 sm:-mt-12 mx-auto",
        "h-[25rem] sm:h-[35rem] md:h-[40rem] lg:h-[45rem] w-full",
        "border-2 sm:border-4 border-[#2957A4]/20",
        "p-2 sm:p-4 md:p-6",
        "bg-card/80 backdrop-blur-sm",
        "rounded-2xl sm:rounded-3xl",
        "shadow-2xl",
        "transition-all duration-150",
      )}
    >
      <div
        className={cn(
          "w-full h-full overflow-hidden",
          "bg-background/50 dark:bg-background/80",
          "rounded-xl sm:rounded-2xl",
          "p-2 sm:p-4 md:p-6",
          "border border-border/10",
          "backdrop-blur-sm",
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}
