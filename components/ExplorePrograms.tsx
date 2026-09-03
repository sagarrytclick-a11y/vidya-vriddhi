"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileText,
  Building,
  Globe,
  FileText as FileIcon,
  ChevronRight,
  GraduationCap,
  MapPin,
  Star,
} from "lucide-react";
import { useCollegesByCourse } from "@/hooks/useCollegesByCourse";
import Link from "next/link";

interface College {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  establishment_year: number | null;
  Countryranking: string | null;
  Internationalranking: string | null;
  logoURL: string | null;
  imageURL: string | null;
  categories?: { id: string; name: string }[];
  city: {
    name: string;
    slug: string;
  };
  country: {
    name: string;
    slug: string;
    flagEmoji: string | null;
  };
  courses: {
    name: string;
  }[];
  _count: {
    courses: number;
  };
}

interface CollegeCardProps {
  college: College;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college }) => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* College Banner Image */}
      {college.imageURL ? (
        <div className="h-40 w-full bg-gradient-to-br from-orange-100 to-blue-100 relative overflow-hidden">
          <Image
            src={college.imageURL}
            alt={college.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 384px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      ) : (
        <div className="h-40 w-full bg-gradient-to-br from-orange-100 via-orange-50 to-blue-100" />
      )}

      <div className="p-5 flex-1 flex flex-col relative">
        {/* College Logo - Positioned to overlap banner */}
        <div className="absolute -top-10 left-5">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border-2 border-white flex items-center justify-center overflow-hidden">
            {college.logoURL ? (
              <Image
                src={college.logoURL}
                alt={`${college.name} logo`}
                fill
                className="object-contain p-2"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Building size={32} className="text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Content with top padding for logo */}
        <div className="mt-12">
          {/* College Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
            {college.name}
          </h3>

          {/* Location with Flag */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <MapPin size={14} className="text-orange-500" />
            <span className="font-medium">
              {college.city.name}, {college.country.name}
            </span>
            {college.country.flagEmoji && (
              <span className="text-base">{college.country.flagEmoji}</span>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <GraduationCap size={14} className="text-blue-500" />
              <span className="text-xs font-semibold text-gray-700">
                {college._count.courses} Courses
              </span>
            </div>
            {college.establishment_year && (
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-yellow-500" />
                <span className="text-xs font-semibold text-gray-700">
                  {college.establishment_year}
                </span>
              </div>
            )}
          </div>

          {/* Streams */}
          {college.categories && college.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {college.categories.slice(0, 3).map((cat: { id: string; name: string }) => (
                <span key={cat.id} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide rounded-lg border border-emerald-100">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Courses Offered Tags */}
          {college.courses.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {college.courses.slice(0, 4).map((course, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-semibold uppercase tracking-wide rounded-lg border border-blue-100"
                >
                  {course.name}
                </span>
              ))}
              {college.courses.length > 4 && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[10px] font-semibold uppercase tracking-wide rounded-lg border border-gray-200">
                  +{college.courses.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Description - Optional */}
          {college.description && (
            <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
              {college.description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/colleges/${college.slug}`}>
          <button className="mt-auto w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
            <span>View Details</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};

const ExplorePrograms: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [visibleCount, setVisibleCount] = useState(3);
  const programs = [
    "All",
    "MBA Colleges",
    "MBBS Colleges",
    "B.Com Colleges",
    "B.Tech Colleges",
    "BA Colleges",
    "B.Sc Colleges",
    "BCA Colleges",
    "Law Colleges",
  ];

  // Fetch colleges by selected course using React Query
  // Strip "Colleges" from program name for API (e.g., "B.Tech Colleges" → "B.Tech")
  const courseName = selectedProgram === "All" ? "All" : selectedProgram.replace(" Colleges", "");
  const { data: colleges, isLoading, error } = useCollegesByCourse(courseName);

  // Reset visible count when tab changes
  const handleProgramChange = (program: string) => {
    setSelectedProgram(program);
    setVisibleCount(3);
  };

  const visibleColleges = colleges?.slice(0, visibleCount) || [];
  const hasMore = colleges ? visibleCount < colleges.length : false;

  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Explore <span className="text-orange-500">Programs</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need for your academic journey—from finding the right
            college to predicting your admission chances.
          </p>
        </div>

        {/* Tabs - Centered & Scrollable on Mobile */}
        <div className="flex justify-start md:justify-center mb-8 sm:mb-12 overflow-x-auto no-scrollbar pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200">
            {programs.map((program) => (
              <button
                key={program}
                onClick={() => handleProgramChange(program)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-[11px] sm:text-sm whitespace-nowrap transition-all duration-200 ${selectedProgram === program
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
              >
                {program}
              </button>
            ))}
          </div>
        </div>

        {/* The Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedProgram === "All" ? (
            <>
              <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <Building size={28} />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    All Colleges
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">
                    Explore top colleges across all streams by location, eligibility, infrastructure, and rankings
                  </p>
                  <Link href="/colleges">
                    <button className="mt-auto flex items-center justify-between w-full px-5 py-3.5 bg-orange-500 text-white text-sm font-bold rounded-xl transition-all duration-300">
                      <span>Browse All Colleges</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <FileText size={28} />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    College Exams
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">
                    Get details on entrance exams, dates, preparation tips, eligibility, and more.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md">JEE</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md">NEET</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md">CUET</span>

                  </div>
                  <Link href="/exams">
                    <button className="mt-auto flex items-center justify-between w-full px-5 py-3.5 bg-orange-500 text-white text-sm font-bold rounded-xl transition-all duration-300">
                      <span>Explore Exams</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <Globe size={28} />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    College Compare
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">
                    Compare colleges based on fees, courses, placement, and other factors
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md">JEE Predictor</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md">NEET Predictor</span>
                  </div>
                  <Link href="/compare-colleges">
                    <button className="mt-auto flex items-center justify-between w-full px-5 py-3.5 bg-orange-500 text-white text-sm font-bold rounded-xl transition-all duration-300">
                      <span>Compare College</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>

                </div>
              </div>
            </>
          ) : isLoading ? (
            // Loading skeletons
            [1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-5 mt-12">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded mb-3 w-1/2" />
                  <div className="h-3 bg-gray-200 rounded mb-4 w-full" />
                  <div className="h-8 bg-gray-200 rounded mt-auto" />
                </div>
              </div>
            ))
          ) : error ? (
            // Error state - show friendly message with option to go back to All
            <div className="col-span-full text-center py-12">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building size={32} className="text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to Load Colleges</h3>
                <p className="text-sm text-gray-600 mb-4">
                  We couldn't fetch the {selectedProgram} data right now. Please try selecting a different program or check back later.
                </p>
                <button
                  onClick={() => setSelectedProgram("All")}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all duration-300"
                >
                  Browse All Programs
                </button>
              </div>
            </div>
          ) : colleges && colleges.length > 0 ? (
            <>
              {visibleColleges.map((college) => <CollegeCard key={college.id} college={college} />)}
              {hasMore && (
                <div className="col-span-full flex justify-center mt-4">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 3)}
                    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Colleges Found</h3>
                <p className="text-sm text-gray-600">
                  We couldn't find any colleges offering {selectedProgram}. Try selecting a different program.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExplorePrograms;
