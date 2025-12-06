import { useState } from 'react'
import Button from '../common/Button.jsx'
import { createJob } from '../../api/jobApi.js'

export default function JobPostForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', budget: '' })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await createJob(form)
      onCreated?.(data.data || data)
      setForm({ title: '', description: '', budget: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded border p-2" />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded border p-2" rows={4} />
      </div>
      <div>
        <label className="block text-sm">Budget</label>
        <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="mt-1 w-full rounded border p-2" />
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</Button>
    </form>
  )
}


