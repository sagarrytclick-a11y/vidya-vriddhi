"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, BookOpen } from "lucide-react";

interface PreviewRankResult {
  score: number;
  rank: string;
  best: number;
  likely: number;
  buffer: number;
}

const NeetRankPredictorSection: React.FC = () => {
  const samplePreview: PreviewRankResult = {
    score: 420,
    rank: "80,372",
    best: 72000,
    likely: 80000,
    buffer: 89000,
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 px-3.5 py-1.5 rounded-full mb-6">
              <span className="flex h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-orange-600 uppercase">
                Live - NEET Rank Predictor
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Know your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                NEET rank before results
              </span>
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Trusted AR Group tool, enter your score, see expected AIR, percentile, and MBBS India / Abroad colleges matched to you. Takes under a minute.
            </p>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-orange-600">✓</span>
                </div>
                <span className="text-sm text-gray-700">MBBS India, Abroad, or both, one smart form</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-orange-600">✓</span>
                </div>
                <span className="text-sm text-gray-700">Live rank preview as you enter your score</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-orange-600">✓</span>
                </div>
                <span className="text-sm text-gray-700">College shortlists you can explore instantly</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/neet-rank-predictor"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 group"
            >
              <span>Check my NEET rank</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-xs text-gray-500 mt-4">
              Instant results · Trusted by AR Group
            </p>
          </div>

          {/* Right Preview Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-500/20 blur-3xl rounded-3xl" />
            <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sample Preview</p>
                  <p className="text-sm text-gray-600 mt-1">Score {samplePreview.score} / 720 - General</p>
                </div>
                <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
                  Tap to start
                </button>
              </div>

              {/* Main Rank Display */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-xs font-bold tracking-wider text-orange-500 uppercase mb-2">
                  Estimated All India Rank
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-gray-900">
                    AIR ~
                  </span>
                  <span className="text-5xl sm:text-6xl font-black text-orange-500">
                    {samplePreview.rank}
                  </span>
                </div>
              </div>

              {/* Rank Categories */}
              <div className="space-y-4 mb-6">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">
                  Your Range
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Best</p>
                    <p className="text-xl font-black text-emerald-600">
                      {samplePreview.best.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Likely</p>
                    <p className="text-xl font-black text-blue-600">
                      {samplePreview.likely.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Buffer</p>
                    <p className="text-xl font-black text-orange-600">
                      {samplePreview.buffer.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* College Options */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    🇮🇳
                  </div>
                  <span className="text-sm font-medium text-gray-700">MBBS India colleges matched</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    ✈️
                  </div>
                  <span className="text-sm font-medium text-gray-700">MBBS Abroad options matched</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeetRankPredictorSection;
