"use client";
import React from "react";
import { motion } from "motion/react";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        className="cursor-pointer text-[#2563eb] hover:text-[#1d4ed8] dark:text-[#3b82f6] dark:hover:text-[#60a5fa] font-medium"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div
                  layout
                  className="h-full p-4 w-max"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full 
                 border-2 border-gray-300 dark:border-white/[0.3] 
                 dark:bg-black bg-white shadow-input 
                 flex justify-center space-x-4 px-8 py-6
                 ring-2 ring-[#2563eb]/20 hover:ring-[#2563eb]/40 transition-all"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="rounded-md shadow-2xl shrink-0"
      />
      <div>
        <h4 className="mb-1 text-xl font-bold text-[#2563eb] dark:text-[#3b82f6]">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-[#2563eb] dark:text-[#3b82f6] hover:text-[#1d4ed8] dark:hover:text-[#60a5fa] transition-colors"
    >
      {children}
    </a>
  );
};

export const HoveredLinkDanger = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-[#ff1e00] dark:text-[#ff1e00] hover:text-[#d44431] dark:hover:text-[#be3421] transition-colors"
    >
      {children}
    </a>
  );
};