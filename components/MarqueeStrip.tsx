"use client";

import { useEffect, useRef } from "react";

const marqueeItems = [
  "Online MBA",
  "MBA",
  "BTech",
  "MBA PGDM",
  "BBA",
  "BCA",
  "MCA",
  "MTech",
  "Executive MBA",
  "Distance Learning",
  "Management",
  "Business Analytics",
];

export default function MarqueeStrip() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const content = container.querySelector(".marquee-content");
    if (content && !container.querySelector(".marquee-clone")) {
      const clone = content.cloneNode(true) as HTMLElement;
      clone.classList.add("marquee-clone");
      container.appendChild(clone);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-orange-500 py-2 sm:py-3 overflow-hidden">
      <div
        ref={containerRef}
        className="flex whitespace-nowrap animate-marquee"
        style={{
          animation: "marquee 25s linear infinite",
        }}
      >
        <div className="marquee-content flex items-center px-4">
          {marqueeItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center px-8"
            >
              <span className="w-2 h-2 bg-white rounded-full mr-4"></span>
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
