"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  GraduationCap,
  UserCheck,
  CheckCircle,
  TrendingUp,
  Info,
  Sliders,
  ChevronRight,
  Zap,
  Target,
  BookOpen,
} from "lucide-react";

interface RankEntry {
  minScore: number;
  maxScore: number;
  minRank: number;
  maxRank: number;
  label: string;
}

const rankData: RankEntry[] = [
  { minScore: 720, maxScore: 720, minRank: 1, maxRank: 1, label: "AIR 1 (Top of India)" },
  { minScore: 700, maxScore: 719, minRank: 2, maxRank: 800, label: "Top 800 — Premier colleges" },
  { minScore: 680, maxScore: 699, minRank: 801, maxRank: 5000, label: "Top 5K — AIIMS / top government" },
  { minScore: 650, maxScore: 679, minRank: 5001, maxRank: 20000, label: "Top 20K — Top government colleges" },
  { minScore: 630, maxScore: 649, minRank: 20001, maxRank: 45000, label: "Top 45K — Good government colleges" },
  { minScore: 600, maxScore: 629, minRank: 45001, maxRank: 80000, label: "Top 80K — Mid government / top private" },
  { minScore: 550, maxScore: 599, minRank: 80001, maxRank: 180000, label: "Top 1.8L — Private / deemed colleges" },
  { minScore: 500, maxScore: 549, minRank: 180001, maxRank: 350000, label: "Top 3.5L — Private colleges" },
  { minScore: 450, maxScore: 499, minRank: 350001, maxRank: 580000, label: "Top 5.8L — Private / state colleges" },
  { minScore: 400, maxScore: 449, minRank: 580001, maxRank: 900000, label: "Top 9L — Private colleges (higher fees)" },
  { minScore: 300, maxScore: 399, minRank: 900001, maxRank: 1600000, label: "Top 16L — Limited options" },
  { minScore: 0, maxScore: 299, minRank: 1600001, maxRank: 2400000, label: "May not qualify for MBBS admission" },
];

const collegeCategories = [
  {
    title: "Top Government Colleges",
    rankRange: "1 - 20,000",
    gradient: "from-emerald-500 to-green-600",
    icon: "🏛️",
    colleges: ["AIIMS Delhi", "Maulana Azad Medical College", "SMS Medical College Jaipur", "Gandhi Medical College Bhopal", "King George's Medical University"],
  },
  {
    title: "Good Government / Top Private",
    rankRange: "20,000 - 1,80,000",
    gradient: "from-blue-500 to-cyan-500",
    icon: "🏥",
    colleges: ["Hamdard Institute of Medical Sciences", "JSS Medical College Mysore", "Christian Medical College Vellore", "Kasturba Medical College Manipal"],
  },
  {
    title: "Private / Deemed Colleges",
    rankRange: "1,80,000+",
    gradient: "from-purple-500 to-pink-500",
    icon: "🎓",
    colleges: ["DY Patil Medical College", "SRM Medical College", "Sharda University", "Teerthanker Mahaveer Medical College"],
  },
];

function validateNeetScore(raw: string): string | null {
  const value = raw.trim()

  if (!value) return 'Please enter your NEET score.'
  if (!/^\d+$/.test(value)) return 'Score must be a whole number (no decimals or letters).'
  if (value.length > 1 && value.startsWith('0')) return 'Please enter a valid score without leading zeros.'

  const num = Number(value)
  if (num < 0 || num > 720) return 'NEET score must be between 0 and 720.'

  return null
}

const NeetRankPredictorPage: React.FC = () => {
  const [score, setScore] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [prediction, setPrediction] = useState<RankEntry | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);

  const applyScoreChange = (next: string) => {
    const sanitized = next.replace(/[^\d]/g, '').slice(0, 3)
    setScore(sanitized)
    setShowPrediction(false)
    setPrediction(null)
    if (touched) setError(validateNeetScore(sanitized))
  }

  const handlePredict = () => {
    setTouched(true)
    const validationError = validateNeetScore(score)
    if (validationError) {
      setError(validationError)
      setShowPrediction(false)
      setPrediction(null)
      return
    }

    const numScore = Number(score)
    const matched = rankData.find((r) => numScore >= r.minScore && numScore <= r.maxScore) || null
    setError(null)
    setPrediction(matched)
    setShowPrediction(true)
  };

  const formatRank = (rank: number) => {
    if (rank >= 10000000) return `${(rank / 10000000).toFixed(1)} Cr`;
    if (rank >= 100000) return `${(rank / 100000).toFixed(1)} L`;
    if (rank >= 1000) return `${(rank / 1000).toFixed(1)}K`;
    return rank.toString();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 py-16 lg:py-24">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-500/5 blur-3xl rounded-full -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-3xl rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="max-w-3xl">
              <nav className="flex items-center gap-2 text-sm text-orange-200/70 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={12} />
                <span className="text-white font-medium">NEET Rank Predictor</span>
              </nav>

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full mb-5">
                <Zap size={14} className="text-orange-400" />
                <span className="text-xs font-bold tracking-wider text-orange-200 uppercase">NEET 2026 Rank Predictor</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
                Predict Your
                <span className="block text-orange-400">NEET Rank</span>
              </h1>
              <p className="text-slate-300 text-base lg:text-lg leading-relaxed max-w-xl">
                Estimate your All India Rank based on your NEET UG score using previous year trends.
                This is an approximate prediction — actual rank may vary based on exam difficulty and number of candidates.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                  <Target size={16} className="text-orange-400" />
                  <span className="text-xs text-slate-300"><strong className="text-white">720</strong> Max Score</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                  <BookOpen size={16} className="text-orange-400" />
                  <span className="text-xs text-slate-300"><strong className="text-white">24L+</strong> Candidates</span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end w-full">
              <div className="relative w-full max-w-[450px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="https://i.pinimg.com/736x/bf/33/c2/bf33c2d4d038782daa119519703d8de0.jpg"
                  alt="NEET Rank Prediction Illustration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PREDICTOR */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">NEET Rank Predictor</h2>
              <p className="text-sm text-gray-500">Enter your score to estimate your rank</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Enter your NEET Score (out of 720)</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    value={score}
                    onChange={(e) => applyScoreChange(e.target.value)}
                    onBlur={() => {
                      setTouched(true)
                      setError(validateNeetScore(score))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handlePredict()
                      }
                    }}
                    placeholder="e.g. 650"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'neet-score-error' : 'neet-score-hint'}
                    className={`w-full h-14 pl-12 pr-5 rounded-xl border bg-gray-50 outline-none transition-all text-lg font-bold ${
                      error
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10'
                    }`}
                  />
                  <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={handlePredict}
                  className="w-full sm:w-auto h-14 px-8 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  Predict Rank
                  <ArrowRight size={16} />
                </button>
              </div>
              {error ? (
                <p id="neet-score-error" className="text-xs font-medium text-red-600 mt-2" role="alert">
                  {error}
                </p>
              ) : (
                <p id="neet-score-hint" className="text-xs text-gray-400 mt-2">
                  Enter a whole number between 0 and 720
                </p>
              )}
            </div>
          </div>

          {showPrediction && (
            <div className={`mt-8 p-6 rounded-xl border ${prediction ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
              {prediction ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-orange-500 uppercase mb-1">Estimated All India Rank</p>
                    <p className="text-4xl sm:text-5xl font-black text-gray-900">
                      {formatRank(prediction.minRank)} — {formatRank(prediction.maxRank)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{prediction.label}</p>
                  </div>
                  <div className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-5 py-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Score</p>
                    <p className="text-2xl font-black text-orange-500">{score}/720</p>
                  </div>
                </div>
              ) : (
                <p className="text-red-600 font-semibold">Invalid score. Please enter a score between 0 and 720.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* RANK TABLE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full mb-4">
            <Info size={12} className="text-orange-500" />
            <span className="text-xs font-bold tracking-wider text-orange-500 uppercase">Reference Table</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Score vs Rank Trends</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">Based on previous year NEET UG data</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="text-left px-5 py-3.5 font-semibold">Score Range</th>
                <th className="text-left px-5 py-3.5 font-semibold">Estimated Rank Range</th>
                <th className="text-left px-5 py-3.5 font-semibold hidden sm:table-cell">Description</th>
              </tr>
            </thead>
            <tbody>
              {rankData.map((row, i) => (
                <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100 hover:bg-orange-50/50 transition-colors`}>
                  <td className="px-5 py-3.5 font-bold text-gray-900">{row.minScore}{row.maxScore !== row.minScore ? ` — ${row.maxScore}` : ''}</td>
                  <td className="px-5 py-3.5 font-semibold text-orange-500">{formatRank(row.minRank)} — {formatRank(row.maxRank)}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs hidden sm:table-cell">{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          * These are approximate ranges based on previous year NEET UG data. Actual ranks depend on exam difficulty and total candidates.
        </p>
      </section>

      {/* COLLEGE CATEGORIES */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full mb-4">
              <GraduationCap size={14} className="text-orange-500" />
              <span className="text-xs font-bold tracking-wider text-orange-500 uppercase">College Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Colleges You Can Target</h2>
            <p className="text-gray-500 text-sm mt-2">Based on your predicted rank range</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {collegeCategories.map((cat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 text-white text-lg`}>
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.title}</h3>
                <p className="text-xs font-semibold text-orange-500 mb-4">Rank range: {cat.rankRange}</p>
                <ul className="space-y-2">
                  {cat.colleges.map((c, ci) => (
                    <li key={ci} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 rounded-2xl p-10 sm:p-14 text-center shadow-xl">
            <UserCheck size={40} className="text-orange-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Need Help With NEET Counseling?</h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Get personalized guidance from expert counselors for college selection, counseling registration, and admission process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                Get Free Counseling
                <ArrowRight size={16} />
              </Link>
              <Link href="/colleges/mbbs-india"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/5 transition-all">
                Browse MBBS Colleges
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NeetRankPredictorPage;