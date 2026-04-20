'use client'

import React from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'delete' | 'warning' | 'danger'
  isLoading?: boolean
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'delete',
  isLoading = false
}: ConfirmModalProps) {
  const getIconAndColors = () => {
    switch (type) {
      case 'delete':
        return {
          icon: Trash2,
          bgColor: 'bg-red-50',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          borderColor: 'border-red-200',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          confirmText: 'Delete'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          borderColor: 'border-yellow-200',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          confirmText: 'Proceed'
        }
      case 'danger':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-50',
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          borderColor: 'border-orange-200',
          confirmBg: 'bg-orange-600 hover:bg-orange-700',
          confirmText: 'Continue'
        }
      default:
        return {
          icon: Trash2,
          bgColor: 'bg-red-50',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          borderColor: 'border-red-200',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          confirmText: 'Delete'
        }
    }
  }

  const { icon: Icon, bgColor, iconBg, iconColor, borderColor, confirmBg } = getIconAndColors()

  const handleConfirm = () => {
    onConfirm()
    if (!isLoading) {
      onClose()
    }
  }

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
              disabled={isLoading}
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

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3"
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`flex-1 ${confirmBg} text-white transition-all transform hover:scale-105 active:scale-95`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    confirmText
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
