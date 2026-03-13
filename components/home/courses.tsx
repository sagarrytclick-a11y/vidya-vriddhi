"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"

const courses = [
{
title:"Engineering",
students:"1.2M Students",
image:"https://thumbs.dreamstime.com/b/manager-engineer-check-control-automation-robot-arms-machine-intelligent-factory-industrial-real-time-monitoring-system-124448906.jpg"
},

{
title:"MBA",
students:"850K Students",
image:"https://images.unsplash.com/photo-1551836022-d5d88e9218df"
},

{
title:"Medical",
students:"600K Students",
image:"https://img.freepik.com/free-photo/medical-banner-with-doctor-wearing-goggles_23-2149611193.jpg"
},

{
title:"Law",
students:"400K Students",
image:"https://images.unsplash.com/photo-1589829545856-d10d557cf95f"
},

{
title:"Computer Science",
students:"900K Students",
image:"https://images.unsplash.com/photo-1518779578993-ec3579fee39f"
},

{
title:"Commerce",
students:"750K Students",
image:"https://images.unsplash.com/photo-1554224155-6726b3ff858f"
}

]

export default function CoursesSection(){

return(

<section className="py-20 bg-white">

<div className="max-w-7xl mx-auto px-6">

{/* Heading */}

<div className="flex justify-between items-center mb-12">

<div>

<h2 className="text-3xl font-bold text-black">
Popular Courses
</h2>

<p className="text-gray-600 mt-2">
Explore the most popular courses chosen by students
</p>

</div>

<button className="text-orange-500 flex items-center gap-1 font-medium">

View All

<ArrowRight size={16}/>

</button>

</div>


{/* Courses Grid */}

<div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">

{courses.map((course,index)=>(

<div
key={index}
className="group relative rounded-xl overflow-hidden shadow hover:shadow-xl transition"
>

{/* Image */}

<div className="relative h-56">

<Image
src={course.image}
alt={course.title}
fill
className="object-cover group-hover:scale-105 transition duration-300"
/>

{/* Overlay */}

<div className="absolute inset-0 bg-black/40"></div>

</div>


{/* Content */}

<div className="absolute bottom-0 p-6 text-white">

<h3 className="text-xl font-semibold">
{course.title}
</h3>

<p className="text-sm opacity-90">
{course.students}
</p>

<button className="mt-3 bg-orange-500 px-4 py-2 rounded-md text-sm flex items-center gap-1">

Explore Courses

<ArrowRight size={14}/>

</button>

</div>

</div>

))}

</div>

</div>

</section>

)
}