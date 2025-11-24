import { useState } from 'react';
import Sidebar from './components/Sidebar';
import UserList from './components/UserList';
import GroupList from './components/GroupList';
import ChatWindow from './components/ChatWindow';
import AIChat from './components/AIChat';
import { Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
    setShowAiChat(false);
    setMobileChatOpen(true);
  };

  const handleAiChatSelect = () => {
    setShowAiChat(true);
    setSelectedUserId(null);
    setMobileChatOpen(true);
  };

  const handleBackToList = () => {
    setMobileChatOpen(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className={`${mobileChatOpen ? 'hidden' : 'block'} md:block w-full md:w-auto`}>
          <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-lg font-semibold">Messages</h1>
            <div className="w-6" />
          </div>

          <div className="flex flex-col md:flex-row h-full">
            <UserList onUserSelect={handleUserSelect} selectedUserId={selectedUserId} />

            <div className="hidden md:block w-80 bg-white border-l p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Group</h3>
                </div>
                <GroupList />
              </div>

              <div className="mt-6">
                <button
                  onClick={handleAiChatSelect}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-lg"
                >
                  Chat with AI Assistant
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden fixed bottom-20 right-4">
            <button
              onClick={handleAiChatSelect}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`${mobileChatOpen ? 'block' : 'hidden'} md:block flex-1`}>
          {showAiChat ? (
            <div className="h-full flex flex-col">
              <div className="md:hidden flex items-center p-4 bg-white border-b">
                <button
                  onClick={handleBackToList}
                  className="text-gray-600 hover:text-gray-800 mr-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold">AI Assistant</h1>
              </div>
              <AIChat />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {selectedUserId && (
                <div className="md:hidden flex items-center p-4 bg-white border-b">
                  <button
                    onClick={handleBackToList}
                    className="text-gray-600 hover:text-gray-800 mr-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className="text-lg font-semibold">Chat</h1>
                </div>
              )}
              <ChatWindow userId={selectedUserId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
