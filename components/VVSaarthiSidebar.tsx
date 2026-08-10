'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Send, Trash2, Bot, User, Sparkles } from 'lucide-react'
import { useVVSaarthi } from '@/contexts/vv-saarthi-context'

const STORAGE_KEY = 'vv-saarthi-messages'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

function formatContent(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const normalized = text.replace(/(?<!\n)\* /g, '\n* ').replace(/(?<!\n)- /g, '\n- ')
  const lines = normalized.split('\n')
  let listItems: React.ReactNode[] = []

  const pushList = (key: string) => {
    if (listItems.length > 0) {
      nodes.push(<ul key={key} className="list-disc pl-5 space-y-1 my-1.5 [&_li]:text-sm [&_li]:leading-relaxed">{listItems}</ul>)
      listItems = []
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()

    if (!trimmed) {
      pushList(`ul-${i}`)
      nodes.push(<div key={`br-${i}`} className="h-1" />)
      return
    }

    const boldProcessed = trimmed
      .split(/(\*\*.*?\*\*)/)
      .map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
        }
        return part
      })

    const content = <span key={`c-${i}`}>{boldProcessed}</span>

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      listItems.push(<li key={`li-${i}`}>{content}</li>)
    } else {
      pushList(`ul-${i}`)
      nodes.push(<p key={`p-${i}`} className="text-sm leading-relaxed">{content}</p>)
    }
  })

  pushList('ul-end')
  return nodes
}

export function VVSaarthiSidebar() {
  const { isOpen, close } = useVVSaarthi()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<Message[]>([])
  const inputRef = useRef('')

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    inputRef.current = input
  }, [input])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed)
        messagesRef.current = parsed
      } catch { }
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const clearMessages = () => {
    setMessages([])
    messagesRef.current = []
    localStorage.removeItem(STORAGE_KEY)
  }

  const sendMessage = async () => {
    const currentInput = inputRef.current
    const currentMessages = messagesRef.current
    if (!currentInput.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: currentInput.trim(),
      id: Date.now().toString(),
    }

    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, userMessage, { role: 'assistant', content: '', id: assistantId }])
    setInput('')
    inputRef.current = ''
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...currentMessages, userMessage]
            .filter((m) => m.role === 'user')
            .slice(-10)
            .map((m) => ({
              role: 'user' as const,
              content: m.content,
            })),
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')
      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      let content = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              content += delta
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content } : m)
              )
            }
          } catch { }
        }
      }

      const contactFooter = '\n\n📞 9839865347\n📧 Abhishek@vidyavriddhi.com'
      if (!content.includes('9839865347')) {
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: m.content + contactFooter } : m)
        )
      }
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId && !m.content
            ? { ...m, content: 'Sorry, something went wrong. Please contact us:\n\n📞 9839865347\n📧 Abhishek@vidyavriddhi.com' }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[140] transition-opacity lg:bg-black/20"
          onClick={close}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-[150] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                VV Saarthi
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              </h2>
              <p className="text-xs text-gray-400">AI Career Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={close}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-2xl mb-6 shadow-lg">
                <Bot className="w-12 h-12 text-orange-400" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Hello! I'm VV Saarthi</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your AI career assistant for college admissions, exam guidance, and study abroad advice. Ask me anything!
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 w-full">
                {[
                  'Which colleges accept JEE Main scores?',
                  'What are the best engineering colleges in India?',
                  'How do I apply for study abroad programs?',
                  'What exams do I need for MBA?',
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q)
                    }}
                    className="text-left text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-orange-300 hover:text-orange-600 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-4">
              {messages.map((msg, i) => {
                const isStreaming = msg.role === 'assistant' && !msg.content && isLoading && i === messages.length - 1
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                          ? 'bg-slate-900'
                          : 'bg-orange-500'
                        }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                          ? 'bg-slate-900 text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm'
                        }`}
                    >
                      {isStreaming ? (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      ) : (
                        <div className="[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-1.5 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_p]:text-sm [&_p]:leading-relaxed whitespace-pre-wrap">
                          {formatContent(msg.content)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-orange-400/50 focus-within:bg-white transition-all">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask VV Saarthi anything..."
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none py-1.5"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
