import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, FileText, Shield, Users, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'VidyaVriddhi Terms and Conditions — governs use of our educational platform, services, and user responsibilities.',
  alternates: { canonical: '/terms' },
}

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <FileText className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
              <p className="text-gray-600">Last updated: March 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Vidya Vridhi. These Terms and Conditions govern your use of our educational platform and services. By accessing or using Vidya Vridhi, you agree to be bound by these terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Vidya Vridhi is an educational platform that provides information about colleges, courses, exams, and career opportunities to help students make informed decisions about their academic journey.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using Vidya Vridhi, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* User Account */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. User Account</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Registration</h3>
                  <p className="text-gray-700">You must provide accurate and complete information when creating an account.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Account Security</h3>
                  <p className="text-gray-700">You are responsible for maintaining the confidentiality of your account credentials.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Account Termination</h3>
                  <p className="text-gray-700">We reserve the right to terminate accounts that violate these terms.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Our Services</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Educational Information</h3>
                <p className="text-gray-700">We provide comprehensive information about colleges, courses, exams, and career opportunities.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Counseling Services</h3>
                <p className="text-gray-700">Professional guidance for college selection, career planning, and admission processes.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Predictor Tools</h3>
                <p className="text-gray-700">College and career prediction tools based on your academic profile and preferences.</p>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Provide accurate and truthful information</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Use the platform for legitimate educational purposes</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Respect intellectual property rights</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Not engage in any fraudulent or misleading activities</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Not share inappropriate or offensive content</span>
              </li>
            </ul>
          </section>

          {/* Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our service, to understand our practices.
            </p>
            <Link 
              href="/privacy"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              View Privacy Policy →
            </Link>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Vidya Vridhi shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. The information provided is for general guidance purposes only.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content, trademarks, and data on this platform, including but not limited to, software, databases, text, graphics, icons, hyperlinks, private information, designs, and agreements, are the property of Vidya Vridhi and are protected by intellectual property laws.
            </p>
          </section>

          {/* Modifications */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Modifications to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> Abhishek@vidyavriddhi.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91-98398 65347</p>
              <p className="text-gray-700"><strong>Address:</strong> S0-2, Geniefolks Building (2nd Floor), Block A, Plot No. A-28, Sector 4, Noida, Uttar Pradesh - 201301</p>
            </div>
          </section>

          {/* Agreement */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              By using Vidya Vridhi, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
