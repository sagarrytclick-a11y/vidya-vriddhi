'use client'

import React, { useState } from 'react'
import { X, User, Mail, Phone, MapPin, BookOpen, ChevronDown, Check, Send } from 'lucide-react'
import { useAdmissionModal } from '@/contexts/admission-modal-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    closeModal()
  }

  const handleGetOTP = () => {
    if (formData.phone.length >= 10) {
      setOtpSent(true)
      // Simulate OTP API call
      setTimeout(() => {
        alert('OTP sent to ' + formData.phone)
      }, 500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-linear-to-br from-orange-50 via-white to-orange-50 rounded-3xl shadow-2xl">
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
                className="w-full pl-12 pr-4 py-4 h-14 bg-white border-2 border-orange-100 rounded-xl text-base focus:border-orange-400 focus:ring-orange-400"
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
                className="w-full pl-12 pr-4 py-4 h-14 bg-white border-2 border-orange-100 rounded-xl text-base focus:border-orange-400 focus:ring-orange-400"
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-20 pr-4 py-4 h-14 bg-white border-2 border-orange-100 rounded-xl text-base focus:border-orange-400 focus:ring-orange-400"
                  maxLength={10}
                  required
                />
              </div>
              <Button
                type="button"
                onClick={handleGetOTP}
                disabled={formData.phone.length < 10 || otpSent}
                className="h-14 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Get OTP
              </Button>
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
                <SelectTrigger className="w-full pl-12 pr-4 py-4 h-14 bg-white border-2 border-orange-100 rounded-xl text-base focus:border-orange-400 focus:ring-orange-400">
                  <SelectValue placeholder="City *" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <SelectTrigger className="w-full pl-12 pr-4 py-4 h-14 bg-white border-2 border-orange-100 rounded-xl text-base focus:border-orange-400 focus:ring-orange-400">
                  <SelectValue placeholder="Course *" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Type */}
            <div>
              <p className="text-gray-700 font-medium mb-3">
                Course Interested <span className="text-orange-500">*</span>
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, courseType: 'online' })}
                  className={`flex-1 py-3 px-4 rounded-full font-medium transition-all ${
                    formData.courseType === 'online'
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, courseType: 'regular' })}
                  className={`flex-1 py-3 px-4 rounded-full font-medium transition-all ${
                    formData.courseType === 'regular'
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Regular
                </button>
              </div>
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
              disabled={!formData.agreedToTerms}
              className="w-full h-14 bg-gray-300 hover:bg-orange-500 text-gray-600 hover:text-white rounded-xl font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Phone to Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
