"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
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
    image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=6366f1&color=fff",
    content: "Vidya Vridhi helped me choose the right engineering college and prepare for JEE Advanced. Their college predictor was spot-on and the counseling sessions were invaluable. I'm now studying my dream course at IIT Delhi!",
    rating: 5,
    category: "Success Stories",
    achievement: "JEE Advanced AIR 342"
  },
  {
    name: "Rahul Kumar",
    role: "MBA Student",
    college: "IIM Ahmedabad",
    image: "https://ui-avatars.com/api/?name=Rahul+Kumar&background=8b5cf6&color=fff",
    content: "The MBA admission guidance I received was exceptional. From CAT preparation to GD/PI sessions, every aspect was covered. Thanks to Vidya Vridhi, I secured admission to my dream B-school.",
    rating: 5,
    category: "College Admissions",
    achievement: "CAT 99.2 Percentile"
  },
  {
    name: "Ananya Patel",
    role: "Medical Student",
    college: "AIIMS Delhi",
    image: "https://ui-avatars.com/api/?name=Ananya+Patel&background=ec4899&color=fff",
    content: "The NEET preparation resources and mock tests were comprehensive. The detailed analysis of my performance helped me identify weak areas and improve. Grateful for the support that led to AIIMS admission.",
    rating: 5,
    category: "Success Stories",
    achievement: "NEET AIR 156"
  },
  {
    name: "Arjun Mehta",
    role: "MS in CS",
    college: "MIT, USA",
    image: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=f59e0b&color=fff",
    content: "Study abroad guidance was exceptional. From university selection to visa application, everything was handled professionally. The scholarship assistance helped me secure funding for my master's degree.",
    rating: 5,
    category: "Study Abroad",
    achievement: "Full Scholarship"
  },
  {
    name: "Kavya Reddy",
    role: "B.Com Honors",
    college: "SRCC, Delhi University",
    image: "https://ui-avatars.com/api/?name=Kavya+Reddy&background=10b981&color=fff",
    content: "Career counseling helped me discover my interest in commerce and finance. The college recommendations based on my profile were perfect. I'm now pursuing my dream course at SRCC.",
    rating: 5,
    category: "Career Guidance",
    achievement: "12th Grade: 95%"
  },
  {
    name: "Vikram Singh",
    role: "LLB Student",
    college: "NLSIU Bangalore",
    image: "https://ui-avatars.com/api/?name=Vikram+Singh&background=3b82f6&color=fff",
    content: "The law entrance preparation was comprehensive. CLAT mock tests and legal reasoning sessions were extremely helpful. I secured admission to the top law college in India.",
    rating: 5,
    category: "College Admissions",
    achievement: "CLAT AIR 89"
  },
  {
    name: "Neha Gupta",
    role: "MBBS Student",
    college: "CMC Vellore",
    image: "https://ui-avatars.com/api/?name=Neha+Gupta&background=ef4444&color=fff",
    content: "Medical college counseling was personalized and detailed. The information about different medical colleges and their specializations helped me make an informed choice.",
    rating: 5,
    category: "Success Stories",
    achievement: "NEET AIR 278"
  },
  {
    name: "Rohit Sharma",
    role: "B.Des Student",
    college: "NID Ahmedabad",
    image: "https://ui-avatars.com/api/?name=Rohit+Sharma&background=f97316&color=fff",
    content: "Design career guidance opened new horizons for me. The portfolio preparation and NID DAT coaching were exceptional. I'm now pursuing my passion for design at NID.",
    rating: 5,
    category: "Career Guidance",
    achievement: "NID DAT Rank 12"
  },
  {
    name: "Divya Nair",
    role: "M.Sc Data Science",
    college: "University of Toronto",
    image: "https://ui-avatars.com/api/?name=Divya+Nair&background=06b6d4&color=fff",
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
