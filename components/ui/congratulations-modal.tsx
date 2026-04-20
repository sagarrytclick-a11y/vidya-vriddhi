'use client'

import React from 'react'
import { X, CheckCircle, Sparkles, Trophy, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './button'

interface CongratulationsModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  course: string
}

export function CongratulationsModal({ 
  isOpen, 
  onClose, 
  studentName, 
  course 
}: CongratulationsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              mass: 0.8
            }}
            className="relative w-full max-w-md bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-2 border-orange-200 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-20 h-20 bg-orange-200/20 rounded-full"
              />
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -left-8 w-16 h-16 bg-yellow-200/20 rounded-full"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative p-8 text-center">
              {/* Trophy with animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.2
                }}
                className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>

              {/* Congratulations Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2"
              >
                Congratulations!
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </motion.div>
              </motion.h2>

              {/* Student Name */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg font-semibold text-gray-700 mb-2"
              >
                {studentName}! 🎉
              </motion.p>

              {/* Success Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 mb-4"
              >
                Your admission enquiry for <span className="font-semibold text-orange-600">{course}</span> has been successfully submitted!
              </motion.p>

              {/* Checklist */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2 mb-6 text-left bg-white/50 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Application received</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Email confirmation sent</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Our team will contact you soon</span>
                </div>
              </motion.div>

              {/* Stars decoration */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.8 + (star * 0.1), 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 20
                    }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </div>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                onClick={onClose}
                className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Awesome! Let's Continue
              </motion.button>

              {/* Additional Info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-xs text-gray-500 mt-4"
              >
                Check your email for next steps and updates
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
