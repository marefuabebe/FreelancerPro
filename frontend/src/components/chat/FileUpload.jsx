import { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

export default function FileUpload({ onFileSelect, disabled }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            alert('Only images and documents (PDF, DOC, DOCX) are allowed');
            return false;
        }

        return true;
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            setSelectedFile(file);

            // Generate preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && validateFile(file)) {
            setSelectedFile(file);

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSend = () => {
        if (selectedFile && onFileSelect) {
            onFileSelect(selectedFile);
            setSelectedFile(null);
            setPreview(null);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (selectedFile) {
        return (
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
                <div className="flex items-start gap-3">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </div>

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={handleSend}
                                disabled={disabled}
                                className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                Send File
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
                }`}
        >
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
                disabled={disabled}
            />

            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
                Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
                Images, PDF, DOC (max 10MB)
            </p>
        </div>
    );
}
