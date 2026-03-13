"use client"

import { useEffect, useState } from "react"
import { Search, GraduationCap, BookOpen, FileText } from "lucide-react"

export default function Hero() {

const texts = [
"Find the Best Colleges",
"Explore Top Courses",
"Discover Competitive Exams"
]

const [textIndex,setTextIndex] = useState(0)

useEffect(()=>{
const interval = setInterval(()=>{
setTextIndex((prev)=>(prev+1)%texts.length)
},3000)

return ()=>clearInterval(interval)

},[])

return (

<section
className="relative min-h-screen flex items-center text-white bg-cover bg-center"
style={{
backgroundImage: "url('/hero.avif')"
}}
>

{/* overlay */}
<div className="absolute inset-0 bg-black/50"></div>

<div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center w-full">


{/* LEFT */}

<div>

<h1 className="text-4xl md:text-5xl font-bold leading-tight transition-all duration-500">
{texts[textIndex]}
</h1>

<p className="mt-4 text-gray-200">
Explore thousands of colleges, courses and exams to build a successful career with Vidya Vriddhi.
</p>


{/* SEARCH */}

<div className="mt-8 bg-white rounded-xl flex items-center p-2 shadow-lg">

<input
type="text"
placeholder="Search Colleges, Courses or Exams..."
className="flex-1 px-4 py-3 text-black outline-none"
/>

<button className="bg-orange-500 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-600">

<Search size={18}/>
Search

</button>

</div>


{/* QUICK LINKS */}

<div className="flex flex-wrap gap-3 mt-6">

<button className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
Engineering
</button>

<button className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
MBA
</button>

<button className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
Medical
</button>

<button className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
Study Abroad
</button>

</div>


{/* STATS */}

<div className="flex gap-10 mt-10">

<div>
<h3 className="text-2xl font-bold">5000+</h3>
<p className="text-gray-200 text-sm">Colleges</p>
</div>

<div>
<h3 className="text-2xl font-bold">200+</h3>
<p className="text-gray-200 text-sm">Exams</p>
</div>

<div>
<h3 className="text-2xl font-bold">1000+</h3>
<p className="text-gray-200 text-sm">Courses</p>
</div>

</div>

</div>


{/* RIGHT CARDS */}

<div className="grid grid-cols-2 gap-6">

<div className="bg-white text-black p-6 rounded-xl shadow-lg">

<GraduationCap className="text-blue-600 mb-2"/>

<h3 className="font-semibold">
Explore Colleges
</h3>

<p className="text-sm text-gray-500">
Find top colleges across India
</p>

</div>


<div className="bg-white text-black p-6 rounded-xl shadow-lg">

<BookOpen className="text-orange-500 mb-2"/>

<h3 className="font-semibold">
Popular Courses
</h3>

<p className="text-sm text-gray-500">
Explore trending courses
</p>

</div>


<div className="bg-white text-black p-6 rounded-xl shadow-lg">

<FileText className="text-blue-600 mb-2"/>

<h3 className="font-semibold">
Top Exams
</h3>

<p className="text-sm text-gray-500">
Check exam details
</p>

</div>


<div className="bg-white text-black p-6 rounded-xl shadow-lg">

<GraduationCap className="text-orange-500 mb-2"/>

<h3 className="font-semibold">
Study Abroad
</h3>

<p className="text-sm text-gray-500">
Explore global universities
</p>

</div>

</div>


</div>

</section>

)
}