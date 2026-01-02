export default function Modal({ open, title, children, onClose, maxWidth = 'max-w-md' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative bg-white rounded shadow-lg w-full ${maxWidth} p-4`}>
        {title && <div className="text-sm font-medium mb-2">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  )
}



