export default function JobList({ jobs = [] }) {
  if (!jobs.length) return <p className="text-sm text-slate-500">No jobs found.</p>
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((j) => (
        <div key={j.id} className="rounded border p-4 bg-white">
          <h3 className="font-medium">{j.title}</h3>
          <p className="text-sm text-slate-600 line-clamp-3">{j.description}</p>
        </div>
      ))}
    </div>
  )
}


