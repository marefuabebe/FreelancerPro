import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '../store/useNotificationStore.js'

// Helper function to format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return date.toLocaleDateString()
}

// Helper function to get priority badge color
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800 border-red-300'
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'low': return 'bg-gray-100 text-gray-800 border-gray-300'
    default: return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

export default function Notifications() {
  const navigate = useNavigate()
  const { items, unreadCount, fetch, markRead, remove, loading, error, socketConnected } = useNotificationStore()

  useEffect(() => { fetch() }, [fetch])

  const unreadIds = items.filter(n => !n.read).map(n => n.id || n._id)

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markRead([notification.id || notification._id])
    }

    // Navigate to the link if available
    if (notification.link) {
      navigate(notification.link)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            {socketConnected && <span className="ml-2 text-green-600">● Live</span>}
          </p>
        </div>
        <button
          onClick={() => markRead(unreadIds)}
          disabled={!unreadIds.length}
          className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Mark all read
        </button>
      </div>

      {loading && <p className="text-center py-8 text-gray-600">Loading notifications...</p>}
      {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No notifications yet</p>
        </div>
      )}

      <ul className="space-y-3">
        {items.map((n) => (
          <li
            key={n.id || n._id}
            className={`rounded-lg border bg-white p-4 transition-all hover:shadow-md cursor-pointer ${n.read ? 'border-gray-200' : 'border-indigo-300 bg-indigo-50/30 shadow-sm'
              }`}
            onClick={() => handleNotificationClick(n)}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              {n.sender?.avatar && (
                <img
                  src={n.sender.avatar}
                  alt={`${n.sender.firstName} ${n.sender.lastName}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              {!n.sender?.avatar && (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {n.sender?.firstName?.[0] || '?'}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{n.title || 'Notification'}</h3>
                      {n.priority && n.priority !== 'medium' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(n.priority)}`}>
                          {n.priority}
                        </span>
                      )}
                      {!n.read && (
                        <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{n.message || n.body}</p>

                    {/* Metadata for proposal notifications */}
                    {n.metadata?.jobTitle && (
                      <p className="text-xs text-gray-500 mt-2">
                        Job: <span className="font-medium">{n.metadata.jobTitle}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3">
                  {n.link && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNotificationClick(n)
                      }}
                      className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      View Details
                    </button>
                  )}
                  {!n.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        markRead([n.id || n._id])
                      }}
                      className="text-xs px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(n.id || n._id)
                    }}
                    className="text-xs px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}



