import Image from "next/image";
import Hero from "@/components/home/hero";
import TopColleges from "@/components/home/topColleges";
import Courses from "@/components/home/courses";
export default function Home() {
  return (
    <div >
     <Hero />
     <TopColleges />
     <Courses />
    </div>
  );
}
