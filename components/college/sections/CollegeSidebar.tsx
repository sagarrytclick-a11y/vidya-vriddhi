import { ContactSidebar } from '@/components/college/ContactSidebar'
import { NewsSidebar } from '@/components/college/NewsSidebar'
import { RecommendedColleges } from '@/components/college/RecommendedColleges'

interface CollegeSidebarProps {
  collegeName: string
  relatedColleges: any[]
}

export function CollegeSidebar({ collegeName, relatedColleges }: CollegeSidebarProps) {
  return (
    <div className="sticky top-[11rem] space-y-6 lg:top-[12.5rem]">
      <ContactSidebar />
      <NewsSidebar collegeName={collegeName} />
      <RecommendedColleges colleges={relatedColleges} />
    </div>
  )
}
