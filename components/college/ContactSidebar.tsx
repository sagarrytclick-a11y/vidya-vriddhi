'use client'

import { Phone, Mail, ExternalLink, MessageCircle, Link } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SITE_IDENTITY } from '@/app/(main)/site-identity'

export function ContactSidebar() {
  const { contact } = SITE_IDENTITY

  return (
    <div className="space-y-4">
      {/* Contact Info Card */}
      <Card className="border shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Phone */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Phone</p>
              <a
                href={`tel:${contact.phone.raw}`}
                className="text-sm text-blue-600 hover:text-blue-700 mt-1 block"
              >
                {contact.phone.display}
              </a>
              {contact.phone.additional && contact.phone.additional.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {contact.phone.additional.map((num, idx) => (
                    <a
                      key={idx}
                      href={`tel:${num}`}
                      className="text-xs text-gray-500 hover:text-blue-600"
                    >
                      {num}{idx < contact.phone.additional!.length - 1 ? ',' : ''}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Email</p>
              <a
                href={`mailto:${contact.email.support}`}
                className="text-sm text-blue-600 hover:text-blue-700 mt-1 block"
              >
                {contact.email.support}
              </a>
              <a
                href={`mailto:${contact.email.admissions}`}
                className="text-sm text-blue-600 hover:text-blue-700 block"
              >
                {contact.email.admissions}
              </a>
            </div>
          </div>

          {/* WhatsApp */}
       
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = `mailto:${contact.email.support}`}
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Us
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = `tel:${contact.phone.raw}`}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Now
        </Button>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={contact.socials.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 py-4 text-white">
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat on WhatsApp
        </Button>
      </a>
    </div>
  )
}
