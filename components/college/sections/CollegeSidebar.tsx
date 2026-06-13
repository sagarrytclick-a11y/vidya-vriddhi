import { ContactSidebar } from '@/components/college/ContactSidebar'
import { NewsSidebar } from '@/components/college/NewsSidebar'
import { RecommendedColleges } from '@/components/college/RecommendedColleges'

interface CollegeSidebarProps {
  collegeName: string
  relatedColleges: any[]
}

export function CollegeSidebar({ collegeName, relatedColleges }: CollegeSidebarProps) {
  return (
    <div className="sticky top-[140px] space-y-6">
      <ContactSidebar />
      <NewsSidebar collegeName={collegeName} />
      <RecommendedColleges colleges={relatedColleges} />
    </div>
  )
}
