'use client'

import { useState } from 'react'

interface FAQItem {
  q: string
  a: string
}

interface FAQCategory {
  name: string
  questions: FAQItem[]
}

interface FAQAccordionProps {
  categories: FAQCategory[]
}

export function FAQAccordion({ categories }: FAQAccordionProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].name)
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set())

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const currentCategory = categories.find((c) => c.name === activeCategory)

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
      {/* Category Navigation */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <h3 className="text-[0.625rem] uppercase tracking-[0.2em] text-[#a69b8a] mb-4">
          Categories
        </h3>
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`text-left px-4 py-2 whitespace-nowrap transition-colors ${
                activeCategory === category.name
                  ? 'text-[#c9a227] bg-[#c9a227]/10'
                  : 'text-[#a69b8a] hover:text-[#f5f3ef]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-[#f5f3ef] mb-6">
          {activeCategory}
        </h2>
        
        {currentCategory?.questions.map((item, index) => {
          const id = `${activeCategory}-${index}`
          const isOpen = openQuestions.has(id)
          
          return (
            <div
              key={id}
              className="border border-[#262228] bg-[#141218]/50"
            >
              <button
                onClick={() => toggleQuestion(id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#1c181f] transition-colors"
              >
                <span className="text-[#f5f3ef] pr-4">{item.q}</span>
                <span
                  className={`text-[#c9a227] flex-shrink-0 transform transition-transform ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              
              {isOpen && (
                <div className="px-6 pb-6">
                  <p className="text-[#a69b8a] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
