'use client'

import React, { useState } from 'react'
import { X, User, Mail, Phone, MapPin, BookOpen, CheckCircle2 } from 'lucide-react'
import { useAdmissionModal } from '@/contexts/admission-modal-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SuccessModal } from '@/components/ui/success-modal'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'

const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
]

const courses = [
  'Bachelor of Computer Applications (BCA)',
  'Bachelor of Technology (B.Tech)',
  'Bachelor of Business Administration (BBA)',
  'Master of Business Administration (MBA)',
  'Bachelor of Science (B.Sc)',
  'Bachelor of Arts (BA)',
  'Bachelor of Commerce (B.Com)',
  'Bachelor of Education (B.Ed)',
]

// Zod validation schema
const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .length(10, 'Mobile number must be exactly 10 digits')
    .refine((val) => !/^0/.test(val), 'Mobile number should not start with 0'),
  city: z.string().min(1, 'Please select a city'),
  course: z.string().min(1, 'Please select a course'),
  agreedToTerms: z.boolean().refine((val) => val === true, 'Please accept terms and conditions')
})

export function AdmissionModal() {
  const { isOpen, selectedCourse, closeModal } = useAdmissionModal()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    course: selectedCourse || '',
    courseType: 'regular' as 'online' | 'regular',
    agreedToTerms: false,
  })
  const [otpSent, setOtpSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentFormData, setCurrentFormData] = useState<any>(null)

  if (!isOpen) return null

  const validateForm = () => {
    try {
      formSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = String(issue.path[0])
            newErrors[fieldName] = issue.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreedToTerms) {
      setModalState({
        isOpen: true,
        type: 'warning',
        title: 'Terms Required',
        message: 'Please accept the terms and conditions to continue with your application.'
      })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          category: formData.course,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setCurrentFormData({ ...formData })
        setShowCongratulations(true)
      } else {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Submission Failed',
          message: data.error || 'Failed to submit enquiry. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Something went wrong',
        message: 'Failed to submit enquiry. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGetOTP = () => {
    if (formData.phone.length >= 10) {
      setOtpSent(true)
      // Simulate OTP API call
      setTimeout(() => {
        setModalState({
          isOpen: true,
          type: 'info',
          title: 'OTP Sent',
          message: `OTP has been sent to ${formData.phone}`
        })
      }, 500)
    }
  }

  const handleCongratulationsClose = () => {
    setShowCongratulations(false)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      city: '',
      course: selectedCourse || '',
      courseType: 'regular',
      agreedToTerms: false,
    })
    setCurrentFormData(null)
    closeModal()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-linear-to-br from-orange-50 via-white to-orange-50 rounded-3xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 hover:bg-orange-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              
               <Image src="/favicon.ico" width={32} height={32} alt="VidyaVriddhi Logo" />
             
              <span className="text-xl font-bold text-gray-800">VidyaVriddhi</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🚀</span>
              <h2 className="text-2xl font-bold text-gray-800">
                Start Your Admission Journey
              </h2>
            </div>
            <p className="text-gray-600">
              {formData.course || selectedCourse || 'Select Your Course'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-orange-400" />
              </div>
              <Input
                type="text"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 h-14 bg-white border-2 rounded-xl text-base focus:ring-2 transition-colors ${
                  errors.fullName 
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400' 
                    : 'border-orange-100 focus:border-orange-400 focus:ring-orange-400'
                }`}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <Input
                type="email"
                placeholder="Email ID *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 h-14 bg-white border-2 rounded-xl text-base focus:ring-2 transition-colors ${
                  errors.email 
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400' 
                    : 'border-orange-100 focus:border-orange-400 focus:ring-orange-400'
                }`}
                required
              />
            </div>

            {/* Phone with OTP */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-lg">🇮🇳</span>
                  <span className="text-gray-600 font-medium">+91</span>
                </div>
                <Input
                  type="tel"
                  placeholder="Contact Number *"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setFormData({ ...formData, phone: value })
                  }}
                  className={`w-full pl-20 pr-4 py-4 h-14 bg-white border-2 rounded-xl text-base focus:ring-2 transition-colors ${
                    errors.phone 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400' 
                      : 'border-orange-100 focus:border-orange-400 focus:ring-orange-400'
                  }`}
                  maxLength={10}
                  required
                />
              </div>
              
              {/* Phone Error Message */}
              {errors.phone && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {errors.phone}
                </div>
              )}
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <MapPin className="w-5 h-5 text-orange-400" />
              </div>
              <Select
                value={formData.city}
                onValueChange={(value) => setFormData({ ...formData, city: value })}
              >
                <SelectTrigger className="h-14 w-full rounded-xl border-2 border-orange-100 bg-white py-4 pl-12 pr-4 text-base text-gray-800 shadow-sm transition-colors data-[placeholder]:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 [&>svg]:text-orange-500">
                  <SelectValue placeholder="City *" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={6}
                  className="max-h-64 rounded-xl border border-orange-100 bg-white p-1.5 text-gray-800 shadow-xl shadow-orange-950/10"
                >
                  {cities.map((city) => (
                    <SelectItem
                      key={city}
                      value={city}
                      className="rounded-lg py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:bg-orange-50 focus:text-orange-950 data-[state=checked]:bg-orange-100 data-[state=checked]:font-semibold"
                    >
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* City Error Message */}
              {errors.city && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {errors.city}
                </div>
              )}
            </div>

            {/* Course Dropdown */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <BookOpen className="w-5 h-5 text-orange-400" />
              </div>
              <Select
                value={formData.course}
                onValueChange={(value) => setFormData({ ...formData, course: value })}
              >
                <SelectTrigger className="h-14 w-full rounded-xl border-2 border-orange-100 bg-white py-4 pl-12 pr-4 text-base text-gray-800 shadow-sm transition-colors data-[placeholder]:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 [&>svg]:text-orange-500">
                  <SelectValue placeholder="Course *" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={6}
                  className="max-h-64 rounded-xl border border-orange-100 bg-white p-1.5 text-gray-800 shadow-xl shadow-orange-950/10"
                >
                  {courses.map((course) => (
                    <SelectItem
                      key={course}
                      value={course}
                      className="rounded-lg py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:bg-orange-50 focus:text-orange-950 data-[state=checked]:bg-orange-100 data-[state=checked]:font-semibold"
                    >
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Course Error Message */}
              {errors.course && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {errors.course}
                </div>
              )}
            </div>

       
            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 py-2">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, agreedToTerms: checked as boolean })
                }
                className="mt-1 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                By submitting this form, I accept and agree to the{' '}
                <a href="#" className="text-orange-500 hover:underline font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-orange-500 hover:underline font-medium">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!formData.agreedToTerms || isSubmitting}
              className="w-full h-14 bg-gray-300 hover:bg-orange-500 text-gray-600 hover:text-white rounded-xl font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </div>
      </div>
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
      />
      
      {/* Congratulations Modal */}
      {showCongratulations && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close confirmation"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={handleCongratulationsClose}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="admission-confirmation-title"
            className="relative w-full max-w-md rounded-2xl border border-orange-100 bg-white p-7 text-center shadow-2xl sm:p-8"
          >
            <button
              type="button"
              aria-label="Close confirmation"
              onClick={handleCongratulationsClose}
              className="absolute right-3 top-3 rounded-lg p-2 text-gray-500 transition-colors hover:bg-orange-50 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-600">Enquiry received</p>
            <h2 id="admission-confirmation-title" className="text-xl font-bold text-gray-900">
              Thank you, {currentFormData?.fullName || formData.fullName}!
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Your enquiry for{' '}
              <span className="font-semibold text-gray-800">
                {currentFormData?.course || formData.course || selectedCourse || 'your selected course'}
              </span>{' '}
              has been received. Our admissions team will get back to you soon.
            </p>
            <Button
              type="button"
              onClick={handleCongratulationsClose}
              className="mt-6 h-11 w-full rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600"
            >
              Done
            </Button>
          </section>
        </div>
      )}
    </div>
  )
}
