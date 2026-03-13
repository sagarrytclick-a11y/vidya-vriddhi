"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Bell, User, Search } from "lucide-react"

export default function Navbar() {

  const [openMenu, setOpenMenu] = useState(null)

  return (
    <header className="shadow-md bg-white">

      {/* Top Navbar */}
      <div className="flex items-center justify-between px-8 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="VidyaVriddhi"
            width={160}
            height={50}
          />
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-[420px]">
          <Search className="text-gray-500 w-4 h-4 mr-2"/>
          <input
            type="text"
            placeholder="Search for Colleges, exams, courses and more"
            className="bg-transparent outline-none w-full text-black"
          />
        </div>

        {/* Right Icons */}
<div className="flex items-center gap-4">

  <button className="p-2 border rounded-lg text-blue-600">
    <Bell size={20}/>
  </button>

  <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-blue-600">
    <User size={18}/>
    User
  </button>

</div>

      </div>


      {/* Bottom Menu */}
      <nav className="border-t px-8 py-3">

        <ul className="flex items-center gap-8 font-medium text-gray-700">

          <li><Link href="/">Home</Link></li>

          <li><Link href="/colleges">Colleges</Link></li>

          <li><Link href="/courses">Courses</Link></li>

          <li><Link href="/exams">Exams</Link></li>

          <li><Link href="/admissions">Admissions</Link></li>

          <li><Link href="/rankings">Rankings</Link></li>

          <li><Link href="/blogs">Blogs</Link></li>

          <li><Link href="/resources">Resources</Link></li>

          <li><Link href="/dashboard">Dashboard</Link></li>

          <li className="ml-auto text-orange-600 font-semibold">
            Talk to Career Experts
          </li>

        </ul>

      </nav>

    </header>
  )
}