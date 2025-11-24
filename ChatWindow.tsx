import { useState, useEffect, useRef } from 'react';
import { Search, Bell, MoreVertical, Smile, Paperclip, Mic, Send, Download, Play, Users } from 'lucide-react';
import { Message, ChatUser } from '../types';

interface ChatWindowProps {
  userId: number | null;
  isAiChat?: boolean;
  onSendMessage?: (message: string) => void;
}

export default function ChatWindow({ userId, isAiChat = false, onSendMessage }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userDetails, setUserDetails] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = Number(import.meta.env.VITE_CURRENT_USER_ID);

  useEffect(() => {
    if (userId && !isAiChat) {
      fetchUserDetails();
      fetchMessages();
    } else if (isAiChat) {
      setUserDetails({
        id: 0,
        name: 'AI Assistant',
        isOnline: true,
      });
    }
  }, [userId, isAiChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${userId}`);
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chatByUserId/${userId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (isAiChat && onSendMessage) {
      const userMsg: Message = {
        id: Date.now(),
        fromUser: currentUserId,
        toUser: 0,
        message: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);
      onSendMessage(newMessage);
      setNewMessage('');
      return;
    }

    if (!userId) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUser: currentUserId,
          toUser: userId,
          message: newMessage,
        }),
      });

      if (response.ok) {
        await fetchMessages();
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const filteredMessages = searchTerm
    ? messages.filter(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase()))
    : messages;

  const renderMessage = (msg: Message) => {
    const isCurrentUser = msg.fromUser === currentUserId;

    return (
      <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-md ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
          {!isCurrentUser && userDetails && (
            <div className="flex items-center space-x-2 mb-1">
              <img
                src={userDetails.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails.name)}&background=random`}
                alt={userDetails.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-xs font-medium">{userDetails.name}</span>
            </div>
          )}

          <div className={`${isCurrentUser ? 'bg-pink-400 text-white' : 'bg-purple-400 text-white'} rounded-2xl px-4 py-2`}>
            <p className="text-sm">{msg.message}</p>
          </div>

          <span className="text-xs text-gray-400 mt-1">{formatTimestamp(msg.timestamp)}</span>
        </div>
      </div>
    );
  };

  if (!userId && !isAiChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <button className="text-gray-600 hover:text-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <select className="border-none bg-transparent text-sm font-medium focus:outline-none">
              <option>All Category</option>
            </select>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search here ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative text-gray-600 hover:text-gray-800">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-semibold">A</span>
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{userDetails?.name || 'Loading...'}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {userDetails?.members && (
                  <>
                    <Users className="w-4 h-4" />
                    <span>and {userDetails.members} others</span>
                  </>
                )}
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 uppercase mt-1">YESTERDAY</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : (
              <>
                {filteredMessages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="bg-white border-t px-6 py-4">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Type your message ..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button className="text-gray-400 hover:text-gray-600">
                <Smile className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-80 bg-white border-l p-6">
          <div className="flex flex-col items-center">
            {userDetails && (
              <>
                <img
                  src={userDetails.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails.name)}&background=random&size=100`}
                  alt={userDetails.name}
                  className="w-20 h-20 rounded-full mb-3"
                />
                <h3 className="font-semibold text-lg">{userDetails.name}</h3>
                {userDetails.isOnline && (
                  <div className="flex items-center space-x-1 text-green-500 text-sm mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Online</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-600">Voluptatem</p>
            <p className="text-xs text-gray-500">
              Quis autem vel eum iure reprehenderit qui in ea voluptate.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium mb-3 uppercase text-gray-600">Today</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">RevenueUpdates.pdf</p>
                    <p className="text-xs text-gray-500">1.3Mb</p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-800">
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-pink-100 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">TrackingUpdates.doc</p>
                    <p className="text-xs text-gray-500">1.3Mb</p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-800">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
