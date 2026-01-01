import { format } from 'date-fns';
import { Download, FileText, Image as ImageIcon } from 'lucide-react';

export default function ChatMessage({ message, isOwn }) {
    const handleDownload = async (attachment) => {
        try {
            const response = await fetch(attachment.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = attachment.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to opening in new tab
            window.open(attachment.url, '_blank');
        }
    };

    const renderAttachment = (attachment) => {
        const isImage = attachment.type?.startsWith('image/');

        if (isImage) {
            return (
                <div className="mt-2">
                    <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="max-w-xs rounded-lg cursor-pointer hover:opacity-90"
                        onClick={() => window.open(attachment.url, '_blank')}
                    />
                </div>
            );
        }

        return (
            <button
                onClick={() => handleDownload(attachment)}
                className="flex items-center gap-2 mt-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full text-left"
            >
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{attachment.name}</div>
                    <div className="text-xs text-gray-500">
                        {(attachment.size / 1024).toFixed(1)} KB
                    </div>
                </div>
                <Download className="w-4 h-4 text-gray-600" />
            </button>
        );
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                {!isOwn && message.sender && (
                    <div className="text-xs text-gray-500 mb-1 px-1">
                        {message.sender.firstName} {message.sender.lastName}
                    </div>
                )}

                <div
                    className={`rounded-2xl px-4 py-2 ${isOwn
                        ? 'bg-green-600 text-white rounded-tr-lg'
                        : 'bg-gray-200 text-gray-900 rounded-tl-lg'
                        }`}
                >
                    {message.content && (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    )}

                    {message.attachments?.map((attachment, idx) => (
                        <div key={idx}>{renderAttachment(attachment)}</div>
                    ))}
                </div>

                <div className={`text-xs text-gray-500 mt-1 px-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {format(new Date(message.createdAt), 'HH:mm')}
                    {isOwn && message.read && <span className="ml-1">✓✓</span>}
                </div>
            </div>
        </div>
    );
}
