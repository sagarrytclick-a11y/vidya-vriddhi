"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[20rem] sm:h-[25rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    name: "Priya Sharma",
    role: "B.Tech CSE Student",
    college: "IIT Delhi",
    image: "https://i.pinimg.com/736x/7c/f1/cd/7cf1cd277fcca1702c45f15fa50c22a3.jpg",
    content: "Vidya Vridhi helped me choose the right engineering college and prepare for JEE Advanced. Their college predictor was spot-on and the counseling sessions were invaluable. I'm now studying my dream course at IIT Delhi!",
    rating: 5,
    category: "Success Stories",
    achievement: "JEE Advanced AIR 342"
  },
  {
    name: "Rahul Kumar",
    role: "MBA Student",
    college: "IIM Ahmedabad",
    image: "https://i.pinimg.com/736x/46/88/12/468812df30ab33d9c66397e40be563af.jpg",
    content: "The MBA admission guidance I received was exceptional. From CAT preparation to GD/PI sessions, every aspect was covered. Thanks to Vidya Vridhi, I secured admission to my dream B-school.",
    rating: 5,
    category: "College Admissions",
    achievement: "CAT 99.2 Percentile"
  },
  {
    name: "Ananya Patel",
    role: "Medical Student",
    college: "AIIMS Delhi",
    image: "https://i.pinimg.com/1200x/9e/59/fc/9e59fcaf829d5e01db2ca872733a5338.jpg",
    content: "The NEET preparation resources and mock tests were comprehensive. The detailed analysis of my performance helped me identify weak areas and improve. Grateful for the support that led to AIIMS admission.",
    rating: 5,
    category: "Success Stories",
    achievement: "NEET AIR 156"
  },
  {
    name: "Arjun Mehta",
    role: "MS in CS",
    college: "MIT, USA",
    image: "https://i.pinimg.com/736x/a2/16/6f/a2166fc3a93c8f550e58e7b88a47012b.jpg",
    content: "Study abroad guidance was exceptional. From university selection to visa application, everything was handled professionally. The scholarship assistance helped me secure funding for my master's degree.",
    rating: 5,
    category: "Study Abroad",
    achievement: "Full Scholarship"
  },
  {
    name: "Kavya Reddy",
    role: "B.Com Honors",
    college: "SRCC, Delhi University",
    image: "https://i.pinimg.com/736x/72/6f/0e/726f0eafd4441e68e1acf8ca057ef0ba.jpg",
    content: "Career counseling helped me discover my interest in commerce and finance. The college recommendations based on my profile were perfect. I'm now pursuing my dream course at SRCC.",
    rating: 5,
    category: "Career Guidance",
    achievement: "12th Grade: 95%"
  },
  {
    name: "Vikram Singh",
    role: "LLB Student",
    college: "NLSIU Bangalore",
    image: "https://i.pinimg.com/736x/93/7a/a9/937aa927e651a6b068cdd22cbfe40d5f.jpg",
    content: "The law entrance preparation was comprehensive. CLAT mock tests and legal reasoning sessions were extremely helpful. I secured admission to the top law college in India.",
    rating: 5,
    category: "College Admissions",
    achievement: "CLAT AIR 89"
  },
  {
    name: "Neha Gupta",
    role: "MBBS Student",
    college: "CMC Vellore",
    image: "https://i.pinimg.com/736x/46/84/d5/4684d5566127b11c69519e980d403bac.jpg",
    content: "Medical college counseling was personalized and detailed. The information about different medical colleges and their specializations helped me make an informed choice.",
    rating: 5,
    category: "Success Stories",
    achievement: "NEET AIR 278"
  },
  {
    name: "Rohit Sharma",
    role: "B.Des Student",
    college: "NID Ahmedabad",
    image: "https://i.pinimg.com/1200x/f3/5d/73/f35d735fd020ce6cdaf628b90bb59694.jpg",
    content: "Design career guidance opened new horizons for me. The portfolio preparation and NID DAT coaching were exceptional. I'm now pursuing my passion for design at NID.",
    rating: 5,
    category: "Career Guidance",
    achievement: "NID DAT Rank 12"
  },
  {
    name: "Divya Nair",
    role: "M.Sc Data Science",
    college: "University of Toronto",
    image: "https://i.pinimg.com/736x/6e/31/b1/6e31b15137e876c5a1651e64c2398dec.jpg",
    content: "The study abroad team made my application process seamless. From SOP writing to university shortlisting, every step was guided. I'm now studying data science at a top Canadian university.",
    rating: 5,
    category: "Study Abroad",
    achievement: "75% Scholarship"
  }
].map(t => ({
  quote: t.content,
  name: t.name,
  title: `${t.role} | ${t.college}`,
  image: t.image
}));
