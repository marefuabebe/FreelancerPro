import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket.js';
import { useChatStore } from '../store/useChatStore.js';
import { getConversations, getUsers, getMessages } from '../api/chatApi.js';
import { useAuthStore } from '../store/useAuthStore.js';
import ChatMessage from '../components/chat/ChatMessage.jsx';
import FileUpload from '../components/chat/FileUpload.jsx';
import { Paperclip, Send, X, Users } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Chat() {
    const socketRef = useSocket();
    const { user } = useAuthStore();
    const { messages, registerSocketHandlers, sendMessage } = useChatStore();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize recipientId from URL params if available
    const [recipientId, setRecipientId] = useState(searchParams.get('user') || '');
    const [content, setContent] = useState('');
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingConvos, setLoadingConvos] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const typingTimeoutRef = useRef(null);
    const listRef = useRef(null);

    console.log('🔍 Chat component rendered, recipientId:', recipientId);

    useEffect(() => {
        if (socketRef.current) {
            registerSocketHandlers(socketRef);

            // Listen for upload events
            socketRef.current.on('upload_progress', ({ progress }) => {
                setUploadProgress(progress);
            });

            socketRef.current.on('upload_complete', () => {
                setUploading(false);
                setShowFileUpload(false);
                setUploadProgress(0);
            });

            socketRef.current.on('upload_error', ({ message }) => {
                alert(message);
                setUploading(false);
                setUploadProgress(0);
            });

            // Listen for typing events
            socketRef.current.on('user_typing', ({ userId, typing }) => {
                if (userId === recipientId) {
                    setIsTyping(typing);
                }
            });

            // Listen for online users
            socketRef.current.on('online_users', (users) => {
                console.log('👥 Received online_users:', users);
                console.log('👥 Setting onlineUsers Set with:', users);
                setOnlineUsers(new Set(users));
            });

            socketRef.current.on('user_online', (data) => {
                const userId = data.userId || data;
                console.log('✅ User came online:', userId);
                setOnlineUsers(prev => {
                    const newSet = new Set([...prev, userId]);
                    console.log('👥 Updated onlineUsers after user_online:', Array.from(newSet));
                    return newSet;
                });
            });

            socketRef.current.on('user_offline', (data) => {
                const userId = data.userId || data;
                console.log('❌ User went offline:', userId);
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    console.log('👥 Updated onlineUsers after user_offline:', Array.from(newSet));
                    return newSet;
                });
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off('upload_progress');
                socketRef.current.off('upload_complete');
                socketRef.current.off('upload_error');
                socketRef.current.off('user_typing');
                socketRef.current.off('online_users');
                socketRef.current.off('user_online');
                socketRef.current.off('user_offline');
            }
        };
    }, [socketRef, registerSocketHandlers, recipientId]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoadingConvos(true);
            try {
                console.log('🔍 Fetching conversations and users...');
                const [convosRes, usersRes] = await Promise.all([
                    getConversations(),
                    getUsers()
                ]);
                console.log('✅ Conversations response:', convosRes.data);
                console.log('✅ Users response:', usersRes.data);

                if (mounted) {
                    const convos = (convosRes.data.data || convosRes.data).items || (convosRes.data.data || convosRes.data) || [];
                    let usersList = (usersRes.data.data || usersRes.data) || [];

                    // Filter users based on role
                    if (user?.role === 'freelancer') {
                        usersList = usersList.filter(u => u.role === 'client');
                    } else if (user?.role === 'client') {
                        usersList = usersList.filter(u => u.role === 'freelancer');
                    }

                    console.log(`📊 Loaded ${convos.length} conversations and ${usersList.length} users`);
                    console.log('🔍 First conversation structure:', convos[0]);
                    setConversations(convos);
                    setUsers(usersList);
                }
            } catch (err) {
                console.error('❌ Failed to load data:', err);
                console.error('Error details:', err.response?.data || err.message);
            } finally {
                if (mounted) setLoadingConvos(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    // Load messages when recipient changes
    useEffect(() => {
        if (!recipientId) {
            return;
        }

        console.log('📨 Loading messages for recipient:', recipientId);

        const loadMessages = async () => {
            try {
                const response = await getMessages(recipientId);
                console.log('✅ Messages loaded:', response.data);
                const msgs = (response.data.data || response.data).items || (response.data.data || response.data) || [];
                console.log('📋 Parsed messages:', msgs.length);

                // Update chat store with loaded messages
                useChatStore.setState({ messages: msgs });
            } catch (error) {
                console.error('❌ Failed to load messages:', error);
            }
        };

        loadMessages();
    }, [recipientId]);

    const handleTyping = () => {
        const socket = socketRef.current;
        if (!socket || !recipientId) return;

        // Emit typing event
        socket.emit('typing', { recipientId });

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { recipientId });
        }, 3000);
    };

    const handleStopTyping = () => {
        const socket = socketRef.current;
        if (!socket || !recipientId) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socket.emit('stop_typing', { recipientId });
    };

    const onSend = async (e) => {
        e.preventDefault();
        if (!recipientId || !content.trim()) return;

        console.log('📤 Sending message to:', recipientId);
        console.log('📝 Content:', content);

        const socket = socketRef.current;
        if (socket) {
            console.log('🔌 Sending via socket');
            socket.emit('send_message', { recipientId, content });
        } else {
            console.log('📡 Sending via API');
            await sendMessage({ recipientId, content });
        }
        setContent('');
    };

    const handleFileSelect = async (file) => {
        if (!recipientId) {
            alert('Please select a recipient first');
            return;
        }

        setUploading(true);
        const socket = socketRef.current;

        if (!socket) {
            alert('Socket not connected');
            setUploading(false);
            return;
        }

        // Read file as base64
        const reader = new FileReader();
        reader.onload = () => {
            socket.emit('upload_file', {
                recipientId,
                fileData: reader.result,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Messages</h1>
                    <p className="text-green-100">Connect with clients and freelancers</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <div className="h-[calc(100vh-16rem)] flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Conversations List */}
                    <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
                        <div className="p-4 bg-white border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Conversations</h2>

                            {/* Toggle between conversations and all users */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowUsers(false)}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${!showUsers
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Chats
                                </button>
                                <button
                                    onClick={() => setShowUsers(true)}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${showUsers
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Users className="w-4 h-4" />
                                    All Users
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loadingConvos && (
                                <div className="p-4 text-sm text-gray-500">Loading...</div>
                            )}

                            {/* Show conversations */}
                            {!showUsers && conversations.length > 0 && conversations.map((c) => {
                                const participantId = c.participantId || c.userId;
                                const isOnline = onlineUsers.has(participantId);
                                const lastSeen = c.lastSeen || c.user?.lastSeen;

                                // Format last seen time
                                const getLastSeenText = () => {
                                    if (isOnline) return 'Online now';
                                    if (!lastSeen) return 'Offline';

                                    const lastSeenDate = new Date(lastSeen);
                                    const now = new Date();
                                    const diffMs = now - lastSeenDate;
                                    const diffMins = Math.floor(diffMs / 60000);
                                    const diffHours = Math.floor(diffMs / 3600000);
                                    const diffDays = Math.floor(diffMs / 86400000);

                                    if (diffMins < 1) return 'Just now';
                                    if (diffMins < 60) return `${diffMins}m ago`;
                                    if (diffHours < 24) return `${diffHours}h ago`;
                                    if (diffDays < 7) return `${diffDays}d ago`;
                                    return lastSeenDate.toLocaleDateString();
                                };

                                console.log(`🔍 Checking online status for conversation:`, {
                                    participantId,
                                    participantName: c.participantName,
                                    isOnline,
                                    onlineUsersArray: Array.from(onlineUsers)
                                });

                                return (
                                    <button
                                        key={c.id || c._id}
                                        onClick={() => {
                                            const userId = c.participantId || c.userId;
                                            setRecipientId(userId);
                                            setSearchParams({ user: userId });
                                            setShowUsers(false);
                                        }}
                                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${recipientId === (c.participantId || c.userId) ? 'bg-green-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                {(() => {
                                                    const avatarUrl = c.participantAvatar?.url ||
                                                        (typeof c.participantAvatar === 'string' ? c.participantAvatar : null) ||
                                                        c.user?.avatar?.url ||
                                                        (typeof c.user?.avatar === 'string' ? c.user?.avatar : null);

                                                    return avatarUrl ? (
                                                        <img
                                                            src={avatarUrl}
                                                            alt={c.participantName || c.user?.name || 'User'}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null;
                                                })()}
                                                <div
                                                    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium"
                                                    style={{ display: (c.participantAvatar?.url || (typeof c.participantAvatar === 'string' && c.participantAvatar) || c.user?.avatar?.url || (typeof c.user?.avatar === 'string' && c.user?.avatar)) ? 'none' : 'flex' }}
                                                >
                                                    {(c.participantName || c.user?.name || c.user?.email || 'U')[0].toUpperCase()}
                                                </div>
                                                {/* Online status indicator */}
                                                <span
                                                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'
                                                        }`}
                                                    title={isOnline ? 'Online' : 'Offline'}
                                                ></span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {c.participantName || c.user?.name || c.user?.email || 'Unknown'}
                                                    </div>
                                                    {c.unreadCount > 0 && (
                                                        <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium text-white bg-green-600 rounded-full">
                                                            {c.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {isOnline ? '●' : '○'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 truncate">
                                                        {getLastSeenText()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {/* Show all users */}
                            {showUsers && users.map((u) => {
                                const avatarUrl = u.avatar?.url || (typeof u.avatar === 'string' ? u.avatar : null);
                                const isOnline = onlineUsers.has(u._id);

                                return (
                                    <button
                                        key={u._id}
                                        onClick={() => {
                                            setRecipientId(u._id);
                                            setSearchParams({ user: u._id });
                                            setShowUsers(false);
                                        }}
                                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${recipientId === u._id ? 'bg-green-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                {avatarUrl ? (
                                                    <img
                                                        src={avatarUrl}
                                                        alt={`${u.firstName} ${u.lastName}`}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-medium"
                                                    style={{ display: avatarUrl ? 'none' : 'flex' }}
                                                >
                                                    {u.firstName?.[0]}{u.lastName?.[0]}
                                                </div>
                                                {isOnline && (
                                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {u.firstName} {u.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                                    <span className={isOnline ? 'text-green-600 font-medium' : 'text-gray-400'}>
                                                        {isOnline ? '● Online' : '○ Offline'}
                                                    </span>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="truncate">{u.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {!loadingConvos && !showUsers && conversations.length === 0 && (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    No conversations yet.<br />
                                    Click "All Users" to start messaging someone.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-gray-50">
                        {recipientId ? (
                            <>
                                {/* Messages */}
                                <div ref={listRef} className="flex-1 overflow-y-auto p-6 space-y-2">
                                    {messages.map((m) => {
                                        const senderId = String(m.sender?._id || m.sender);
                                        const currentUserId = String(user?._id);
                                        const isOwn = senderId === currentUserId;

                                        // Debug logging
                                        if (messages.length > 0 && messages.indexOf(m) === 0) {
                                            console.log('🔍 Rendering first message:', {
                                                messageId: m._id,
                                                senderId,
                                                senderObject: m.sender,
                                                currentUserId,
                                                userObject: user,
                                                isOwn,
                                                content: m.content
                                            });
                                        }

                                        return (
                                            <ChatMessage
                                                key={m._id || m.id}
                                                message={m}
                                                isOwn={isOwn}
                                            />
                                        );
                                    })}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                            <span className="italic">typing...</span>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Progress */}
                                {uploading && (
                                    <div className="px-6 py-2 bg-blue-50 border-t border-blue-100">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-600">{uploadProgress}%</span>
                                        </div>
                                    </div>
                                )}

                                {/* File Upload */}
                                {showFileUpload && (
                                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                                        <div className="flex items-start gap-2">
                                            <div className="flex-1">
                                                <FileUpload
                                                    onFileSelect={handleFileSelect}
                                                    disabled={uploading}
                                                />
                                            </div>
                                            <button
                                                onClick={() => setShowFileUpload(false)}
                                                className="p-2 text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Input */}
                                <div className="p-4 bg-white border-t border-gray-200">
                                    <form onSubmit={onSend} className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowFileUpload(!showFileUpload)}
                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                            disabled={uploading}
                                        >
                                            <Paperclip className="w-5 h-5" />
                                        </button>

                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={content}
                                            onChange={(e) => {
                                                setContent(e.target.value);
                                                handleTyping();
                                            }}
                                            onBlur={handleStopTyping}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                            disabled={uploading}
                                        />

                                        <button
                                            type="submit"
                                            disabled={!content.trim() || uploading}
                                            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <p className="text-lg font-medium">Select a conversation</p>
                                    <p className="text-sm mt-1">Choose a contact to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
