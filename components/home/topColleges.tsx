"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Star } from "lucide-react"

const colleges = {
Engineering: [
{
name:"IIT Delhi",
city:"Delhi",
rating:"4.8",
fees:"₹2.2L / year",
courses:"40+ Courses",
image:"https://images.unsplash.com/photo-1590362891991-f776e747a588"
},

{
name:"IIT Bombay",
city:"Mumbai",
rating:"4.9",
fees:"₹2.3L / year",
courses:"35+ Courses",
image:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
},

{
name:"NIT Trichy",
city:"Tamil Nadu",
rating:"4.7",
fees:"₹1.9L / year",
courses:"30+ Courses",
image:"https://images.unsplash.com/photo-1562774053-701939374585"
},

{
name:"BITS Pilani",
city:"Rajasthan",
rating:"4.6",
fees:"₹3.1L / year",
courses:"25+ Courses",
image:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f"
}
],

MBA: [
{
name:"IIM Ahmedabad",
city:"Ahmedabad",
rating:"4.9",
fees:"₹23L total",
courses:"MBA Programs",
image:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
},

{
name:"IIM Bangalore",
city:"Bangalore",
rating:"4.8",
fees:"₹24L total",
courses:"MBA Programs",
image:"https://images.unsplash.com/photo-1509062522246-3755977927d7"
},

{
name:"IIM Calcutta",
city:"Kolkata",
rating:"4.8",
fees:"₹23L total",
courses:"MBA Programs",
image:"https://images.unsplash.com/photo-1498243691581-b145c3f54a5a"
},

{
name:"FMS Delhi",
city:"Delhi",
rating:"4.7",
fees:"₹2L total",
courses:"MBA Programs",
image:"https://upload.wikimedia.org/wikipedia/commons/2/20/FMS-_The_Red_Building_of_Dreams.JPG"
}
]
}

export default function TopColleges(){

const [active,setActive] = useState("Engineering")

return(

<section className="py-20 bg-gray-50">

<div className="max-w-7xl mx-auto px-6">

{/* Header */}

<div className="flex justify-between items-center mb-10">

<div>
<h2 className="text-3xl font-bold text-black">
Top Colleges
</h2>

<p className="text-gray-600 mt-1">
Explore the best colleges in India with rankings, fees and courses
</p>
</div>

<button className="text-orange-500 font-medium">
View All →
</button>

</div>


{/* Tabs */}

<div className="flex gap-4 mb-10">

{Object.keys(colleges).map((tab)=>(
<button
key={tab}
onClick={()=>setActive(tab)}
className={`px-5 py-2 rounded-lg font-medium transition

${active===tab
? "bg-orange-500 text-white"
: "bg-white border text-black hover:bg-gray-100"
}

`}
>
{tab}
</button>
))}

</div>


{/* Cards */}

<div className="grid md:grid-cols-4 gap-8">

{colleges[active].map((college,index)=>(

<div
key={index}
className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
>

{/* Image */}

<div className="relative h-44">

<Image
src={college.image}
alt={college.name}
fill
className="object-cover"
/>

<div className="absolute top-3 right-3 bg-white px-2 py-1 rounded flex items-center text-sm shadow">

<Star size={14} className="text-yellow-500 mr-1"/>

{college.rating}

</div>

</div>


{/* Content */}

<div className="p-5">

<h3 className="font-semibold text-lg text-black">
{college.name}
</h3>

<p className="text-gray-600 flex items-center gap-1 text-sm mt-1">

<MapPin size={14}/>
{college.city}

</p>

<p className="text-gray-700 text-sm mt-2">
{college.courses}
</p>

<p className="text-gray-800 font-medium mt-1">
{college.fees}
</p>

<button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">

View Details

</button>

</div>

</div>

))}

</div>

</div>

</section>

)
}