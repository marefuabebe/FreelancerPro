import { useState } from 'react'

export default function JobFilter({ onChange }) {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('recent')

  const emit = () => onChange?.({ q, category, sort })

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input placeholder="Search jobs" value={q} onChange={(e) => setQ(e.target.value)} className="border rounded px-2 py-1 text-sm" />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-2 py-1 text-sm">
        <option value="">All categories</option>
        <option value="design">Design</option>
        <option value="dev">Development</option>
        <option value="marketing">Marketing</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-2 py-1 text-sm">
        <option value="recent">Most recent</option>
        <option value="budget_high">Budget: High to Low</option>
        <option value="budget_low">Budget: Low to High</option>
      </select>
      <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm" onClick={emit}>Apply</button>
    </div>
  )
}


