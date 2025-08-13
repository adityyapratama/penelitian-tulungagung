"use client"
import Link from 'next/link'
import { useState } from 'react'
 

 
export default function HeroSection() {
return (
    <>
        
        <section className="bg-white min-h-max dark:bg-gray-950">
            <div className="absolute inset-x-0 top-0 flex items-start h-64">
                <div className="w-2/3 h-24 bg-gradient-to-br from-blue-300 opacity-20 blur-2xl dark:from-blue-400 dark:invisible dark:opacity-40">
                </div>
                <div className="w-3/5 h-20 bg-gradient-to-r from-blue-400 opacity-40 blur-2xl dark:from-blue-700 dark:opacity-40">
                </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-2/5 aspect-[2/0.5] bg-gradient-to-br from-blue-400 to-blue-200 rounded-full opacity-50 blur-2xl">
            </div>
            <div className="relative w-full px-5 pt-32 pb-24 mx-auto space-y-10 text-center lg:max-w-7xl sm:px-10 md:px-12 lg:px-5">
                <h1 className="max-w-5xl mx-auto font-bold text-gray-900 dark:text-white text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight xl:text-7xl/tight">
                    Welcome to Pusaka  <br />
                    Tulung-Agung 
                </h1>
                <p className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt saepe atque enim quasi a ipsum
                    asperiores necessitatibus deleniti, sint quo vel corporis dignissimos
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mx-auto">
                    <Link href="#" className="flex items-center h-12 px-6 text-white bg-blue-600 border border-blue-600 rounded-full">
                        Start here
                    </Link>
                    <Link href="#" className="flex items-center h-12 px-6 text-blue-700 bg-gray-100 border border-gray-200 rounded-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800">
                        Learn more
                    </Link>
                </div>
                <div className="grid max-w-2xl p-6 mx-auto text-left border border-gray-100 divide-y divide-gray-300 lg:grid-cols-3 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 dark:border-gray-800 lg:max-w-5xl lg:divide-x lg:divide-y-0 dark:divide-gray-800">
                    <div className="flex items-start gap-6 pb-6 lg:pr-6 lg:pb-0">
                        <div className="w-10">
                            <span className="flex p-3 text-gray-800 bg-gray-200 rounded-xl dark:bg-gray-800 w-max dark:text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
                                </svg>
                            </span>
                        </div>
                        <div className="flex-1 space-y-1">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                High Quality
                            </h2>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6 py-6 lg:px-6 lg:py-0">
                        <div className="w-10">
                            <span className="flex p-3 text-gray-800 bg-gray-200 rounded-xl dark:bg-gray-800 w-max dark:text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </span>
                        </div>
                        <div className="flex-1 space-y-1">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                High Quality
                            </h2>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6 pt-6 lg:pt-0 lg:pl-6">
                        <div className="w-10">
                            <span className="flex p-3 text-gray-800 bg-gray-200 rounded-xl dark:bg-gray-800 w-max dark:text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
                                </svg>
                            </span>
                        </div>
                        <div className="flex-1 space-y-1">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                High Quality
                            </h2>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
)
}