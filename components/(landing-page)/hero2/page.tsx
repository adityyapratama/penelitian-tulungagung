"use client";
import type { NextPage } from 'next';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";

const HeroSection: NextPage = () => {
	return (
		<>
		<section className="relative min-h-screen bg-background overflow-hidden">
			{/* Background Decoration */}
			<div className="absolute inset-0 bg-gradient-toNextPage-br from-primary/5 via-transparent to-secondary/5" />
      
			<div className="container mx-auto px-4 py-20 relative z-10">
				<div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-10rem)]">
          
					{/* Left Content */}
					<div className="space-y-8 text-center lg:text-left">
						{/* Title */}
						<div className="space-y-4">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
								<span className="block">Welcome to</span>
								<span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
									Pusaka Tulungagung
								</span>
							</h1>
              
							<p className="text-lg md:text-3xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
								Jelajahi kekayaan budaya, sejarah, dan keindahan Tulungagung melalui platform pembelajaran interaktif
								
							</p>
						</div>

						{/* Search Bar */}
						<div className="max-w-2xl mx-auto lg:mx-0">
							<div className="flex flex-col sm:flex-row gap-3">

								<Button 
									size="lg" 
									className="h-14 px-15 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
								>
									Explore
								</Button>
							</div>
						</div>

						
						
					</div>

					{/* Right Image Container */}
					<div className="relative">
						{/* Main Image Container */}
						<div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden ">
							{/* Placeholder for your image */}
							
								<div className="text-center space-y-4">
									<div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
										<Search className="w-12 h-12 text-primary" />
									</div>
									<div className="text-muted-foreground">
										<p className="font-medium">Image Container</p>
										<p className="text-sm">Tambahkan gambar hero di sini</p>
									</div>
								</div>
							</div>
              
							{/* Uncomment when you have image */}
							<Image
								src="/asset/head.jpg"
								alt="Pusaka Tulungagung"
								fill
								className="object-cover"
								priority
							/>
						</div>

						{/* Decorative Elements */}
						<div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
						
            
						{/* Small Floating Card (Optional) */}
						{/* <div className="absolute bottom-8 left-8 bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-primary/20 hidden lg:block">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
									<span className="text-xl">🏛️</span>
								</div>
								<div>
									<div className="font-semibold text-sm">Candi Penataran</div>
									<div className="text-xs text-muted-foreground">Situs Bersejarah</div>
								</div>
							</div>
						</div> */}
					</div>

				</div>
			
		</section>

		{/* Stats Bar below Hero */}
		<section className="relative -mt-10 md:-mt-40">
			<div className="container mx-auto px-4">
				<div className="bg-card rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* Item 1 */}
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
								<Image src="/asset/icon-kos.png" width={40} height={40} alt="" />
							</div>
							<div>
								<div className="text-2xl md:text-3xl font-bold">0</div>
								<div className="text-sm text-muted-foreground">Kos Available</div>
							</div>
						</div>

						{/* Item 2 */}
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
								<Image src="/asset/icon-happy.png" width={40} height={40} alt="" />
							</div>
							<div>
								<div className="text-2xl md:text-3xl font-bold">0/10</div>
								<div className="text-sm text-muted-foreground">People Happy</div>
							</div>
						</div>

						{/* Item 3 */}
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
								<Image src="/asset/icon-security.png" width={40} height={40} alt="" />
							</div>
							<div>
								<div className="text-2xl md:text-3xl font-bold">100%</div>
								<div className="text-sm text-muted-foreground">High Security</div>
							</div>
						</div>

						{/* Item 4 */}
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
								<Image src="/asset/icon-country.png" width={40} height={40} alt="" />
							</div>
							<div>
								<div className="text-2xl md:text-3xl font-bold">0</div>
								<div className="text-sm text-muted-foreground">Countries</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		</>
	);
};

export default HeroSection;
