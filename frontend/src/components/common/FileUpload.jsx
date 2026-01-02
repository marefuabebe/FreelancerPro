import { useState } from 'react'
import { uploadFile } from '../../api/uploadApi.js'

export default function FileUpload({ onUpload, accept = "*", maxSize = 5 * 1024 * 1024 }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > maxSize) {
        setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await uploadFile(formData)
      const uploadedFile = data.data || data

      if (onUpload) {
        onUpload(uploadedFile)
      }

      setFile(null)
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          className="w-full p-2 border rounded"
        />
        {file && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      )}
    </div>
  )
}
