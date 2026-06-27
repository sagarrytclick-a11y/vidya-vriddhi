'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import NextImage from 'next/image'
import { Calendar, Clock, Users, FileText, Award, BookOpen, Globe, CheckCircle } from 'lucide-react'

interface ViewExamModalProps {
  isOpen: boolean
  onClose: () => void
  exam: any
}

export function ViewExamModal({ isOpen, onClose, exam }: ViewExamModalProps) {
  if (!exam) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            {exam.name}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            View complete exam details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Exam Name</label>
                  <p className="text-white font-medium">{exam.name}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Short Name</label>
                  <p className="text-white font-medium">{exam.shortName}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Slug</label>
                  <p className="text-white font-medium">{exam.slug}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Conducting Body</label>
                  <p className="text-white font-medium">{exam.conductingBody}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Type</label>
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    {exam.type}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Mode</label>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    {exam.mode}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Frequency</label>
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    {exam.frequency}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Status</label>
                  <Badge variant={exam.status === 'Active' ? 'default' : 'secondary'}>
                    {exam.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Description</label>
                <p className="text-white mt-1">{exam.description || 'No description available'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Overview Section */}
          {exam.overview && (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  {exam.overview.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-white">{exam.overview.content}</p>
                </div>
                {exam.overview.keyHighlights && exam.overview.keyHighlights.length > 0 && (
                  <div>
                    <label className="text-sm text-slate-400">Key Highlights</label>
                    <ul className="mt-2 space-y-1">
                      {exam.overview.keyHighlights.map((highlight: string, index: number) => (
                        <li key={index} className="text-white flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Registration Section */}
          {exam.registration && (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  {exam.registration.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-white">{exam.registration.description}</p>
                </div>
                {exam.registration.bulletPoints && exam.registration.bulletPoints.length > 0 && (
                  <div>
                    <label className="text-sm text-slate-400">Important Points</label>
                    <ul className="mt-2 space-y-1">
                      {exam.registration.bulletPoints.map((point: string, index: number) => (
                        <li key={index} className="text-white flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Exam Pattern Section */}
          {exam.examPattern && (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  {exam.examPattern.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-white">{exam.examPattern.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Total Duration</label>
                    <p className="text-white flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {exam.examPattern.totalDurationMins} minutes
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Score Range</label>
                    <p className="text-white flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      {exam.examPattern.scoreRange}
                    </p>
                  </div>
                </div>
                {exam.examPattern.tableData && exam.examPattern.tableData.length > 0 && (
                  <div>
                    <label className="text-sm text-slate-400">Section Details</label>
                    <div className="mt-2 space-y-2">
                      {exam.examPattern.tableData.map((section: any, index: number) => (
                        <div key={index} className="bg-slate-600 p-3 rounded">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Section:</span>
                              <span className="text-white ml-2">{section.section}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Questions:</span>
                              <span className="text-white ml-2">{section.questions}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Duration:</span>
                              <span className="text-white ml-2">{section.durationMins} mins</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Important Dates Section */}
          {exam.examDates && (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  {exam.examDates.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exam.examDates.importantDates && exam.examDates.importantDates.length > 0 && (
                  <div className="space-y-2">
                    {exam.examDates.importantDates.map((date: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-slate-600 p-3 rounded">
                        <span className="text-white">{date.event}</span>
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                          {date.date}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Result Statistics Section */}
          {exam.resultStatistics && (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-400" />
                  {exam.resultStatistics.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-white">{exam.resultStatistics.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Total Marks</label>
                    <p className="text-white font-medium">{exam.resultStatistics.totalMarks}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Passing Criteria</label>
                    <p className="text-white font-medium">{exam.resultStatistics.passingCriteria}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exam Image */}
          {exam.examImageurl && (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white">Exam Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <NextImage 
                    src={exam.examImageurl} 
                    alt={exam.name}
                    width={300}
                    height={200}
                    className="rounded-lg border border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
