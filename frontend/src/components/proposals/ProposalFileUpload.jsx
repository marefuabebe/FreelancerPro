import { useState } from 'react'
import { Upload, X, File } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProposalFileUpload({ onFilesChange, maxFiles = 5 }) {
    const [files, setFiles] = useState([])

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)

        if (files.length + selectedFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files`)
            return
        }

        const newFiles = [...files, ...selectedFiles]
        setFiles(newFiles)
        onFilesChange?.(newFiles)
    }

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onFilesChange?.(newFiles)
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, TXT, PNG, JPG (max {maxFiles} files)
                    </p>
                </label>
            </div>

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                            <div className="flex items-center space-x-3">
                                <File className="text-gray-400" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
