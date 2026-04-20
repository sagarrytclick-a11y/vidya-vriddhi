'use client'

import React from 'react'
import { X, CheckCircle, AlertCircle, Info, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number // Auto-close duration in ms (optional)
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  duration 
}: SuccessModalProps) {
  React.useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200',
          buttonBg: 'bg-green-600 hover:bg-green-700'
        }
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          borderColor: 'border-red-200',
          buttonBg: 'bg-red-600 hover:bg-red-700'
        }
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          borderColor: 'border-yellow-200',
          buttonBg: 'bg-yellow-600 hover:bg-yellow-700'
        }
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-200',
          buttonBg: 'bg-blue-600 hover:bg-blue-700'
        }
      default:
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200',
          buttonBg: 'bg-green-600 hover:bg-green-700'
        }
    }
  }

  const { icon: Icon, bgColor, iconBg, iconColor, borderColor, buttonBg } = getIconAndColors()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
            className={`relative w-full max-w-md ${bgColor} border-2 ${borderColor} rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Icon with animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.1
                }}
                className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Icon className={`w-8 h-8 ${iconColor}`} />
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-800 text-center mb-2"
              >
                {title}
              </motion.h3>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-center mb-6"
              >
                {message}
              </motion.p>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className={`w-full py-3 px-6 ${buttonBg} text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95`}
              >
                Got it!
              </motion.button>
            </div>

            {/* Animated border effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                background: `linear-gradient(45deg, transparent, rgba(74, 144, 226, 0.3), transparent)`,
                WebkitMask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
                WebkitMaskComposite: "xor",
                maskComposite: "exclude"
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Special modal for college comparison limit
export function CompareLimitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
            className="relative w-full max-w-md bg-yellow-50 border-2 border-yellow-200 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Icon with animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.1
                }}
                className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Plus className="w-8 h-8 text-yellow-600" />
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-800 text-center mb-2"
              >
                Compare Limit Reached
              </motion.h3>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-center mb-6"
              >
                <p className="mb-3">You can compare up to <span className="font-bold text-yellow-600">4 colleges</span> at a time.</p>
                <p>Please remove one college from your comparison list to add a new one.</p>
              </motion.div>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className="w-full py-3 px-6 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95"
              >
                I Understand
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
