export default function Empty({ title = 'Nothing here yet', subtitle = 'Try adjusting your filters or create a new item.' }) {
  return (
    <div className="text-center py-10 text-slate-600">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs">{subtitle}</div>
    </div>
  )
}



