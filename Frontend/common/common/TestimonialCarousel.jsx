import { useState } from 'react';

export const TESTIMONIALS = [
  {
    name: 'Ambika M.',
    role: 'Market Researcher',
    img: 'https://randomuser.me/api/portraits/women/43.jpg',
    online: true,
    badge: true,
    stars: 5.0,
    rate: '$100.00/hr',
    jobs: 5,
    review: 'I turned to FreelancerPro as a way to gain more control of my career. I love being able to choose everything from who I work with to how I spend my day.'
  },
  {
    name: 'Sasheen M.',
    role: 'Customer Experience Consultant',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop',
    online: true,
    badge: true,
    stars: 5.0,
    rate: '$65.00/hr',
    jobs: 14,
    review: 'FreelancerPro has enabled me to increase my rates. I know what I\'m bringing to the table and love the feeling of being able to help a variety of clients.'
  },
  {
    name: 'Tomas S.',
    role: 'Web Developer',
    img: 'https://randomuser.me/api/portraits/men/27.jpg',
    online: false,
    badge: false,
    stars: 4.9,
    rate: '$80.00/hr',
    jobs: 22,
    review: 'Remote freelancing let me travel and work around the world. The projects are challenging and rewarding!'
  },
];

export default function TestimonialCarousel({ testimonials = TESTIMONIALS }) {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];
  const handleLeft = () => setIndex(i => (i - 1 + testimonials.length) % testimonials.length);
  const handleRight = () => setIndex(i => (i + 1) % testimonials.length);

  return (
    <div className="relative hidden md:flex items-center justify-center select-none">
      {/* Left arrow */}
      <button
        onClick={handleLeft}
        aria-label="Previous"
        className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 shadow-md rounded-full w-14 h-14 flex items-center justify-center hover:bg-gray-50 transition-colors"
        style={{ marginLeft: '-36px' }}
      >
        <svg width={30} height={30} viewBox="0 0 24 24" stroke="#54a300" strokeWidth="2.2" fill="none"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {/* Right arrow */}
      <button
        onClick={handleRight}
        aria-label="Next"
        className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 shadow-md rounded-full w-14 h-14 flex items-center justify-center hover:bg-gray-50 transition-colors"
        style={{ marginRight: '-36px' }}
      >
        <svg width={30} height={30} viewBox="0 0 24 24" stroke="#54a300" strokeWidth="2.2" fill="none"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className="bg-white p-8 rounded-2xl shadow-lg border max-w-sm w-full text-center relative">
        <div className="relative w-36 mx-auto mb-2">
          <img
            src={t.img}
            alt={t.name}
            className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow"
          />
          {t.online && <span className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-400 border-4 border-white rounded-full"></span>}
          {t.badge && <span className="absolute bottom-2 right-3 w-8 h-8"><svg className="w-8 h-8" fill="#5865f2" stroke="#fff" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 13l2.5 2L16 10" stroke="#fff" strokeWidth={2.5} fill="none" /></svg></span>}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-1">{t.name}</h3>
        <p className="text-lg text-gray-500 mb-4" style={{ marginTop: '-2px' }}>{t.role}</p>
        <div className="flex justify-center items-center space-x-5 text-gray-600 text-lg mb-4">
          <span className="flex items-center gap-1"><svg className="w-6 h-6 text-blue-600 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" /><path d="M8 12l2 2 4-4" /></svg> {t.stars}</span>
          <span>{t.rate}</span>
          <span className="flex items-center gap-1"><svg className="w-6 h-6 inline-block" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg> {t.jobs} jobs</span>
        </div>
        <blockquote className="text-2xl text-gray-700 font-normal italic leading-tight mt-3">
          “{t.review}”
        </blockquote>
      </div>
    </div>
  );
}
