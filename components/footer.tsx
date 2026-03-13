"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function Footer() {
  return (

<footer className="bg-[#445a8d] text-white mt-20">

<div className="max-w-7xl mx-auto px-6 py-12">

{/* TOP SECTION */}
<div className="grid md:grid-cols-5 gap-8">

{/* Logo Section */}
<div>

<div className="bg-white p-3 rounded-lg w-fit">
<Image
src="/logo.png"
alt="VidyaVriddhi"
width={160}
height={60}
/>
</div>

<p className="text-sm mt-4 text-gray-200 leading-relaxed">
Vidya Vriddhi helps students explore colleges,
courses and exams to build a successful career.
</p>

<p className="text-sm mt-4 text-gray-300">
© 2026 Vidya Vriddhi
</p>

</div>


{/* About */}
<div>
<h3 className="font-semibold mb-3">About</h3>

<ul className="space-y-2 text-sm text-gray-200">
<li><Link href="/about">About Vidya Vriddhi</Link></li>
<li><Link href="/team">Our Team</Link></li>
<li><Link href="/contact">Contact Us</Link></li>
<li><Link href="/career">Careers</Link></li>
</ul>

</div>


{/* Colleges */}
<div>
<h3 className="font-semibold mb-3">Colleges</h3>

<ul className="space-y-2 text-sm text-gray-200">
<li>Top Colleges</li>
<li>Engineering Colleges</li>
<li>MBA Colleges</li>
<li>Medical Colleges</li>
<li>Colleges by City</li>
</ul>

</div>


{/* Courses */}
<div>
<h3 className="font-semibold mb-3">Courses</h3>

<ul className="space-y-2 text-sm text-gray-200">
<li>MBA</li>
<li>B.Tech</li>
<li>BCA</li>
<li>MCA</li>
<li>M.Tech</li>
</ul>

</div>


{/* Exams */}
<div>
<h3 className="font-semibold mb-3">Exams</h3>

<ul className="space-y-2 text-sm text-gray-200">
<li>JEE Main</li>
<li>NEET</li>
<li>CAT</li>
<li>GATE</li>
<li>CLAT</li>
</ul>

</div>

</div>

{/* Divider */}
<div className="border-t border-white/20 my-8"></div>


{/* SECOND SECTION */}
<div className="grid md:grid-cols-4 gap-8">

{/* Resources */}
<div>

<h3 className="font-semibold mb-3">Resources</h3>

<ul className="space-y-2 text-sm text-gray-200">
<li>Blogs</li>
<li>Exam Updates</li>
<li>Top Rankings</li>
<li>College Predictor</li>
</ul>

</div>


{/* Study Abroad */}
<div>

<h3 className="font-semibold mb-3">Study Abroad</h3>

<ul className="space-y-2 text-sm text-gray-200">
<li>Canada</li>
<li>USA</li>
<li>UK</li>
<li>Australia</li>
<li>Germany</li>
</ul>

</div>


{/* Board Exams */}
<div>

<h3 className="font-semibold mb-3">Board Exams</h3>

<ul className="space-y-2 text-sm text-gray-200">
<li>CBSE Class 12</li>
<li>CBSE Class 10</li>
<li>Result Updates</li>
<li>Syllabus</li>
</ul>

</div>


{/* Social + CTA */}
<div>

<h3 className="font-semibold mb-3">Follow Us</h3>

<div className="flex gap-4 mb-4">

<Facebook className="hover:text-orange-400 cursor-pointer"/>
<Instagram className="hover:text-orange-400 cursor-pointer"/>
<Linkedin className="hover:text-orange-400 cursor-pointer"/>
<Youtube className="hover:text-orange-400 cursor-pointer"/>

</div>

<button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-medium">
Free Career Counseling
</button>

</div>

</div>

</div>


{/* Bottom Footer */}
<div className="bg-[#374a79] text-center py-4 text-sm text-gray-300">
Copyright © 2026 Vidya Vriddhi. All Rights Reserved.
</div>

</footer>

  )
}