"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [bubbles, setBubbles] = useState<Array<{left: string, delay: string, duration: string, size: string, opacity: string}>>([]);
  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState("");


  const [recent, setRecent] = useState<Array<{ id: number; username?: string; rating: number; comment?: string; created_at?: string }>>([]);

  const ratingSchema = z.object({
    username: z.string().optional(),
    rating: z.number().min(0).max(10),
    comment: z.string().optional(),
  });
  

  useEffect(() => {
    const newBubbles = Array.from({ length: 30 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`, // Faster delays
      duration: `${3 + Math.random() * 4}s`, // Faster animation
      size: i < 20 ? 'w-5 h-5' : 'w-3 h-3', // Slightly bigger bubbles
      opacity: i < 20 ? 'bg-white/95' : 'bg-white/70', // More visible
    }));
    console.log('Bubbles generated:', newBubbles.length);
    setBubbles(newBubbles);
  }, []);

  // Fetch the 3 most recent ratings (for popover)
  async function fetchRecentRatings() {
    try {
      const { data, error } = await supabase
        .from("beer_ratings")
        .select("id, username, rating, comment, created_at")
        .order("created_at", { ascending: false })
        .limit(3);
  
      if (error) {
        console.error("fetchRecentRatings error:", error);
        return;
      }
  
      setRecent(data ?? []);
    } catch (err) {
      console.error(err);
    }
  }
  

  // Call once on mount (so popover has content)
  useEffect(() => {
    fetchRecentRatings();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
  
    // Validate first
    const result = ratingSchema.safeParse({ rating, comment });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      setSubmitting(false);
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("beer_ratings")
        .insert([{ username: username.trim() || "Anonymous", rating, comment }])
        .select(); // optional: return inserted rows
  
      if (error) throw error;
  
      toast.success("Submitted successfully! 🍻");
  
      // Reset form
      setRating(5);
      setComment("");
  
      // Refresh recent ratings
      await fetchRecentRatings();
    } catch (err: any) {
      console.error("Submission failed:", err);
      toast.error(err?.message || "Failed to submit rating 😭");
    } finally {
      setSubmitting(false);
    }
  };
  
  
  

  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background that scrolls with content */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-16 bg-white/90 rounded-b-[50%] shadow-md z-10"></div>
      
      {/* Bubbles - positioned relative to container */}
      {bubbles.map((bubble, i) => (
        <div
          key={i}
          className={`absolute ${bubble.size} ${bubble.opacity} rounded-full animate-bubble z-10`}
          style={{
            left: bubble.left,
            bottom: '0px',
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
          }}
        />
      ))}
      
      {/* Content container */}
      <div className="relative z-20 font-satoshi grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start relative z-20">
      
        

        <header className="w-full px-4 sm:px-0">
          <h1
            className="text-4xl sm:text-5xl font-cabinet font-extrabold text-center sm:text-left leading-tight transition-colors duration-200"
          >
            <span
              className={`
                text-black transition-all duration-300
                group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:via-orange-500 group-hover:to-orange-700
                group-hover:bg-clip-text group-hover:text-transparent
                group-hover:drop-shadow-[0_2px_8px_rgba(245,158,11,0.33)]
              `}
            >
              Cheers
            </span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:-rotate-12 ml-1"
              style={{ willChange: 'transform' }}
            >
              🍺
            </span>
          </h1>
          <p className="mt-2 text-md text-black text-center sm:text-left font-satoshi">
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
          const [isAnimating, setIsAnimating] = useState(false);
          const [displayCurrent, setDisplayCurrent] = useState(0);

          // Optional: Autoplay or arrow keys, but minimal for simplicity

          const handlePrev = () => {
            if (isAnimating) return;
            setIsAnimating(true);
            // Fade out first
            setTimeout(() => {
              setCurrent(current === 0 ? cards.length - 1 : current - 1);
              setDisplayCurrent(current === 0 ? cards.length - 1 : current - 1);
            }, 250); // Wait for most of fade-out to complete
            setTimeout(() => setIsAnimating(false), 300);
          };

          const handleNext = () => {
            if (isAnimating) return;
            setIsAnimating(true);
            // Fade out first
            setTimeout(() => {
              setCurrent((current + 1) % cards.length);
              setDisplayCurrent((current + 1) % cards.length);
            }, 250); // Wait for most of fade-out to complete
            setTimeout(() => setIsAnimating(false), 300);
          };

          const handleDotClick = (index: number) => {
            if (isAnimating || index === current) return;
            setIsAnimating(true);
            // Fade out first
            setTimeout(() => {
              setCurrent(index);
              setDisplayCurrent(index);
            }, 250); // Wait for most of fade-out to complete
            setTimeout(() => setIsAnimating(false), 300);
          };

          return (
            <div className="w-full flex flex-col items-center gap-6 max-w-2xl">
              <div className="relative w-full overflow-hidden">
                {/* Card */}
                <div className={`transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  <Card className="flex flex-col items-stretch w-full max-w-2xl">
                  <CardHeader className="border-b pb-6">
                    <h2 className="text-xl sm:text-2xl font-cabinet font-bold">{cards[displayCurrent].header}</h2>
                  </CardHeader>
                   <div className="flex flex-row items-center px-6 py-6 gap-6">
                     <Image
                       src={cards[displayCurrent].img}
                       alt={cards[displayCurrent].header}
                       width={128}
                       height={128}
                       className="rounded-lg object-cover aspect-square bg-muted flex-shrink-0"
                     />
                     <div className="flex-1 min-w-0">
                       <div className="text-muted-foreground text-base mb-4 font-satoshi">
                         {cards[displayCurrent].text}
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
                      onClick={handlePrev}
                      disabled={cards.length <= 1 || isAnimating}
                      aria-label="Previous Card"
                    >
                      &larr; Prev
                    </button>
                    <div className="flex items-center gap-2">
                      {cards.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleDotClick(i)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            i === current ? "bg-primary scale-125" : "bg-muted hover:bg-muted/80"
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                          disabled={isAnimating}
                        />
                      ))}
                    </div>
                    <button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all h-9 px-4 py-2 disabled:opacity-50"
                      onClick={handleNext}
                      disabled={cards.length <= 1 || isAnimating}
                      aria-label="Next Card"
                    >
                      Next &rarr;
                    </button>
                  </div>
                  </Card>
                </div>
              </div>
            </div>
          );
        })()}

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      <Popover>
  <PopoverTrigger asChild>
    <button className="flex items-center gap-2 hover:underline hover:underline-offset-4 transition-all duration-200 hover:scale-105 active:scale-95 active:opacity-70 font-satoshi">
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
  <PopoverContent className="w-72 p-4 animate-in fade-in-0 zoom-in-95 duration-500 ease-out data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300">
    <h3 className="font-cabinet font-semibold mb-3 text-center">
      How much does AK love beer?
    </h3>

    {/* Slider */}
    <Slider
      value={[rating]}
      max={10}
      step={1}
      onValueChange={(val) => setRating(val[0])}
      className="h-2 w-full mt-2 relative touch-none select-none"
    >
      <div className="absolute h-2 bg-gray-200 rounded-full w-full transition-all duration-150" />
      <div
        className="absolute h-2 bg-amber-400 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${(rating / 10) * 100}%` }}
      />
      <div
        className="absolute h-6 w-6 bg-white border border-gray-400 rounded-full -translate-y-1/2 cursor-pointer shadow transition-all duration-200 hover:scale-110 hover:shadow-lg"
        style={{ left: `${(rating / 10) * 100}%` }}
      />
    </Slider>

    {/* Rating number */}
    <p className="mt-2 text-center text-sm text-muted-foreground font-cabinet font-medium">
      <span className="font-semibold text-lg">{rating}</span> / 10
    </p>

    {/* Dynamic message */}
    <div
      className={`mt-2 p-2 rounded text-center font-medium text-black text-sm font-satoshi ${
        rating <= 3
          ? "bg-yellow-100 border border-yellow-200"
          : rating <= 7
          ? "bg-orange-100 border border-orange-200"
          : "bg-red-100 border border-red-200"
      }`}
    >
      {rating <= 3
        ? "👑 A sober king indeed (this is a total lie)"
        : rating <= 7
        ? "⚠️ Someone stop him before he's in too deep"
        : "❗ Okay alcoholic alert"}
    </div>
    {/* Username input */}
    <input
      type="text"
      placeholder="Your name (optional)"
      className="mt-3 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-300 focus:outline-none"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />


    {/* Comment input */}
    <textarea
      placeholder="Any comments on his addiction?"
      className="mt-3 w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-amber-300 focus:outline-none"
      rows={2}
      onChange={(e) => setComment(e.target.value)}
      value={comment}
      disabled={submitting}
    />

    {/* Submit button */}
    <button
      onClick={handleSubmit}
      disabled={submitting}
      className={`w-full mt-3 text-black font-medium font-cabinet rounded-md py-2 transition-all duration-200 ${
        submitting ? "bg-amber-300 cursor-not-allowed" : "bg-amber-400 hover:bg-amber-500"
      }`}
    >
      {submitting ? "Submitting..." : "Submit Rating"}
    </button>

    {/* Recent Ratings */}
<div className="mt-3 border-t pt-3">
  <h4 className="text-medium font-cabinet font-semibold mb-2 text-center">
    Recent ratings
  </h4>

  <div className="max-h-20 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
    {recent.length === 0 ? (
      <p className="text-xs text-muted-foreground text-center font-cabinet">
        No recent ratings
      </p>
    ) : (
      recent.map((r) => (
        <div
          key={r.id}
          className="text-sm bg-white/60 p-2 rounded mb-2 font-cabinet"
        >
          <div className="flex justify-between items-start">
            <div className="font-semibold font-satoshi">{r.username ?? "Anon"}</div>
            <div className="font-semibold font-satoshi text-amber-700">{r.rating}/10</div>
          </div>
          <div className="text-muted-foreground mt-1 truncate font-medium">
            {r.comment}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
          </div>
        </div>
      ))
    )}
  </div>
</div>

  </PopoverContent>
</Popover>

        
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 transition-all duration-200 hover:scale-105 font-satoshi"
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
            className="transition-transform duration-200 hover:scale-110"
          />
          Who Is Akshat Parikh?
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 transition-all duration-200 hover:scale-105 font-satoshi"
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
            className="transition-transform duration-200 hover:scale-110"
          />
          Buy A Lemon Bintang →
        </a>
      </footer>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
