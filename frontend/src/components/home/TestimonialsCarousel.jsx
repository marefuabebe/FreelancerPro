import { useState } from 'react'

export default function TestimonialsCarousel() {
  const testimonials = [
    {
      text: "Had a clear understanding, met deadline, and communication was exceptional.",
      author: "Alex P.",
      role: "CEO, SaaSCo",
      category: "Development & IT",
      rating: 5
    },
    {
      text: "Outstanding work quality and professional approach throughout the project.",
      author: "Sarah M.",
      role: "Marketing Director, TechCorp",
      category: "Design & Creative",
      rating: 5
    },
    {
      text: "Delivered exactly what we needed, on time and within budget.",
      author: "Mike R.",
      role: "Founder, StartupXYZ",
      category: "AI Services",
      rating: 5
    },
    {
      text: "Excellent communication and exceeded our expectations.",
      author: "Lisa K.",
      role: "Product Manager, InnovateCo",
      category: "Sales & Marketing",
      rating: 5
    },
    {
      text: "Professional, reliable, and delivered high-quality results.",
      author: "David L.",
      role: "CTO, Enterprise Inc",
      category: "Writing & Translation",
      rating: 5
    },
    {
      text: "Great attention to detail and very responsive to feedback.",
      author: "Emma W.",
      role: "Operations Manager, ScaleUp",
      category: "Admin & Support",
      rating: 5
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / itemsPerPage))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => prev === 0 ? Math.ceil(testimonials.length / itemsPerPage) - 1 : prev - 1)
  }

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <div className="flex items-center justify-center mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-900">Real results from clients</h2>
        <div className="flex space-x-2 absolute right-0">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentTestimonials.map((testimonial, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">{testimonial.category}</span>
            </div>
            <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium text-sm">
                  {testimonial.author.charAt(0)}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{testimonial.author}</div>
                <div className="text-xs text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
