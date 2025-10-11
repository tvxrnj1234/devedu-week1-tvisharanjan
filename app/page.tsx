"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [bubbles, setBubbles] = useState<Array<{left: string, delay: string, duration: string}>>([]);
  const [rating, setRating] = useState(5);
  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
    }));
    console.log('Bubbles generated:', newBubbles.length);
    setBubbles(newBubbles);
  }, []);
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background that scrolls with content */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-16 bg-white/90 rounded-b-[50%] shadow-md z-10"></div>
      
      {/* Bubbles - positioned relative to container */}
      {bubbles.map((bubble, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-white/90 rounded-full animate-bubble z-10"
          style={{
            left: bubble.left,
            bottom: '0px',
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
          }}
        />
      ))}
      
      {/* Content container */}
      <div className="relative z-20 font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start relative z-20">
      
        

        <header className="w-full px-4 sm:px-0">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left leading-tight">
            Cheers <span aria-hidden>🍺</span>
          </h1>
          <p className="mt-2 text-md text-black text-center sm:text-left">
            A page dedicated to AK's undying love for beer.
          </p>
        </header>
        
        {/* Slideshow with 4 Cards */}
        {/*
          We'll define Slideshow inline here for clarity in this context.
        */}
        {(() => {
          const cards = [
            {
              header: "Frat Flick",
              img: "/beer1.png",
              text: "In his past life, AK was the pledgemaster at Cal Fiji. Also, if you look to the right, his friends are really concerned for him.",
            },
            {
              header: "A New York Minute",
              img: "/beer2.png",
              text: "AK was on a beer diet for 2 months while interning in NYC and put his friends on it too. Now everyone's a beer addict.",
            },
            {
              header: "When His Love For Bintangs Began",
              img: "/beer3.png",
              text: "As soon as AK touched Bali dirt and got a hold of his first Bintang bottle, he was bound to falling in love.",
            },
            {
              header: "Always Rizzing When Holding A Beer Can",
              img: "/beer4.png",
              text: "Don't give AK a Coors bottle at a dayger or he'll end up stealing your girl.",
            }
          ];

          const [current, setCurrent] = useState(0);

          // Optional: Autoplay or arrow keys, but minimal for simplicity

          return (
            <div className="w-full flex flex-col items-center gap-6 max-w-2xl">
              <div className="relative w-full">
                {/* Card */}
                <Card className="flex flex-col items-stretch w-full max-w-2xl animate-fade-in">
                  <CardHeader className="border-b pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold">{cards[current].header}</h2>
                  </CardHeader>
                   <div className="flex flex-row items-center px-6 py-6 gap-6">
                     <Image
                       src={cards[current].img}
                       alt={cards[current].header}
                       width={128}
                       height={128}
                       className="rounded-lg object-cover aspect-square bg-muted flex-shrink-0"
                     />
                     <div className="flex-1 min-w-0">
                       <div className="text-muted-foreground text-base mb-4">
                         {cards[current].text}
                       </div>
                       <div className="flex gap-2 items-center flex-col sm:flex-row">
                         <a
                           onClick={() =>
                            toast.success("Cheers sent!", {
                              icon: "🍺",
                              style: {
                                background: "#FFF8C6", // match button bg
                                color: "#000",         // match button text
                                fontWeight: "500",     // match font-medium
                                border: "1px solid #FFD600", // match button border
                              },
                            })
                          }
                           className="rounded-full border border-solid border-[#FFD600] transition-colors flex items-center justify-center bg-[#FFF8C6] text-black gap-2 hover:bg-[#ffe26f] font-medium text-sm sm:text-base h-9 sm:h-10 px-4 sm:px-5 sm:w-auto"
                           //href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                           target="_blank"
                           rel="noopener noreferrer"
                         >
                           <Image
                             className="dark:invert"
                             src="/beercheers.png"
                             alt="Vercel logomark"
                             width={16}
                             height={16}
                           />
                            Give a cheers!
                         </a>
                         <a
                          onClick={() =>
                            toast.success("Like sent!", {
                              icon: "💖",
                              style: {
                                background: "#FFF0F6", // match like button bg
                                color: "#000",         // match button text
                                fontWeight: "500",     // match font-medium
                                border: "1px solid #FBCFE8", // match like button border
                              },
                            })
                          }
                          className="rounded-full border border-solid border-pink-200 transition-colors flex items-center justify-center bg-pink-100 text-black gap-2 hover:bg-pink-200 font-medium text-sm sm:text-base h-9 sm:h-10 px-4 sm:px-5 sm:w-auto"
                           //href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                           target="_blank"
                           rel="noopener noreferrer"
                         >
                          <Image
                             className="dark:invert"
                             src="/heart.png"
                             alt="Vercel logomark"
                             width={16}
                             height={16}
                           />
                           Send a like!
                         </a>
                       </div>
                     </div>
                   </div>
                  <div className="flex justify-between px-6">
                    <button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all h-9 px-4 py-2 disabled:opacity-50"
                      onClick={() => setCurrent(current === 0 ? cards.length - 1 : current - 1)}
                      disabled={cards.length <= 1}
                      aria-label="Previous Card"
                    >
                      &larr; Prev
                    </button>
                    <div className="flex items-center gap-2">
                      {cards.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrent(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === current ? "bg-primary" : "bg-muted"
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all h-9 px-4 py-2 disabled:opacity-50"
                      onClick={() => setCurrent((current + 1) % cards.length)}
                      disabled={cards.length <= 1}
                      aria-label="Next Card"
                    >
                      Next &rarr;
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          );
        })()}

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 hover:underline hover:underline-offset-4">
              <Image
                aria-hidden
                src="/slider.svg"
                alt="File icon"
                width={16}
                height={16}
              />
              Rate His Addiction
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
              <h3 className="font-semibold mb-2 text-center">
                How much does AK love beer?
              </h3>

              {/* Slider */}
              <Slider
                value={[rating]}
                max={10}
                step={1}
                onValueChange={(val) => setRating(val[0])}
                className="h-2 w-full mt-4 relative touch-none select-none"
              >
                {/* Track */}
                <div className="absolute h-2 bg-gray-200 rounded-full w-full" />
                {/* Filled track */}
                <div
                  className="absolute h-2 bg-amber-400 rounded-full"
                  style={{ width: `${(rating / 10) * 100}%` }}
                />
                {/* Thumb */}
                <div
                  className="absolute h-6 w-6 bg-white border border-gray-400 rounded-full -translate-y-1/2 cursor-pointer shadow"
                  style={{ left: `${(rating / 10) * 100}%` }}
                />
              </Slider>

              {/* Rating number */}
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {rating} / 10
              </p>

              {/* Dynamic message with colored background */}
              <div
                className={`mt-2 p-2 rounded text-center font-medium text-black text-sm ${
                  rating <= 3
                    ? "bg-yellow-100"
                    : rating <= 7
                    ? "bg-orange-100"
                    : "bg-red-100"
                }`}
              >
                {rating <= 3
                  ? "👑 A sober king indeed (this is a total lie)"
                  : rating <= 7
                  ? "⚠️ Someone stop him before he's in too deep"
                  : "❗ Okay alcoholic alert"}
              </div>
            </PopoverContent>


        </Popover>
        
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/akshat-parikh-158286234/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/akshat.jpeg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Who Is Akshat Parikh?
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.theboogaloobali.com/product/bintang-radler-330ml/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/lemonbintang.png"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Buy A Lemon Bintang →
        </a>
      </footer>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
