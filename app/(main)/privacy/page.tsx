import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Shield, Eye, Database, UserCheck, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | VidyaVriddhi',
  description: 'VidyaVriddhi Privacy Policy — how we collect, use, and protect your personal information when using our educational platform.',
}

const PrivacyPage = () => {
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
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
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
              At Vidya Vridhi, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This policy applies to all users of Vidya Vridhi, including students, parents, educational institutions, and any other visitors to our website or users of our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <UserCheck className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-gray-700">Name, email address, phone number, date of birth, educational qualifications, and career preferences.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Academic Information</h3>
                  <p className="text-gray-700">Exam scores, academic records, preferred courses, colleges of interest, and career goals.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Usage Data</h3>
                  <p className="text-gray-700">Pages visited, time spent, search queries, clicks, and other interaction data with our platform.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Technical Information</h3>
                  <p className="text-gray-700">IP address, browser type, device information, and cookies for improving user experience.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Service Provision</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Personalized college recommendations</li>
                  <li>• Career guidance and counseling</li>
                  <li>• Exam preparation resources</li>
                  <li>• Admission assistance</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Platform Improvement</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• User experience enhancement</li>
                  <li>• Content personalization</li>
                  <li>• Service optimization</li>
                  <li>• New feature development</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Important updates and notifications</li>
                  <li>• Educational newsletters</li>
                  <li>• Service announcements</li>
                  <li>• Response to inquiries</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Analytics & Research</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Educational trend analysis</li>
                  <li>• Platform usage statistics</li>
                  <li>• Service effectiveness</li>
                  <li>• Academic research purposes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Educational Partners:</strong> With colleges and universities for admission processing</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Service Providers:</strong> Third-party services essential for platform operations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Legal Requirements:</strong> When required by law or to protect our rights</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</span>
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Security Measures Include:</h3>
              <ul className="text-orange-700 space-y-1 text-sm">
                <li>• SSL encryption for data transmission</li>
                <li>• Secure servers and databases</li>
                <li>• Regular security audits</li>
                <li>• Access control and authentication</li>
                <li>• Employee training on data protection</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie settings through your browser preferences.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-orange-500" readOnly checked />
                <span className="text-gray-700">Essential cookies for platform functionality</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-orange-500" readOnly checked />
                <span className="text-gray-700">Analytics cookies for service improvement</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-orange-500" readOnly />
                <span className="text-gray-700">Personalization cookies (optional)</span>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Access:</strong> Request access to your personal information</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Correction:</strong> Update or correct inaccurate information</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Deletion:</strong> Request deletion of your personal data</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Portability:</strong> Transfer your data to another service</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Opt-out:</strong> Unsubscribe from marketing communications</span>
              </li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
            </p>
          </section>

          {/* International Data Transfer */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. International Data Transfer</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers in accordance with applicable laws.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or want to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> privacy@vidyavridhi.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91 80123 45678</p>
              <p className="text-gray-700"><strong>Address:</strong> Bangalore, Karnataka, India</p>
            </div>
          </section>

          {/* Terms Reference */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-700 leading-relaxed mb-4">
              This Privacy Policy should be read together with our Terms & Conditions. By using Vidya Vridhi, you acknowledge that you have read and understood this Privacy Policy.
            </p>
            <Link 
              href="/terms"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              View Terms & Conditions →
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
