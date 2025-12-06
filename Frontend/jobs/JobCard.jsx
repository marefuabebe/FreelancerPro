export default function JobCard({ job }) {
  if (!job) return null
  return (
    <div className="rounded border p-4 bg-white">
      <h3 className="font-medium">{job.title}</h3>
      <p className="text-sm text-slate-600">{job.description}</p>
    </div>
  )
}


