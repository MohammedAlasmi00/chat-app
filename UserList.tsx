import { useState, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';
import { User } from '../types';

interface UserListProps {
  onUserSelect: (userId: number) => void;
  selectedUserId: number | null;
}

export default function UserList({ onUserSelect, selectedUserId }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/list`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="w-80 bg-white p-4">Loading...</div>;
  }

  return (
    <div className="w-80 bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">CABANG YOG</h2>
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search here ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Group</h3>
            <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
              SHOW ALL
            </button>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Person</h3>
            <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
              SHOW ALL
            </button>
          </div>

          <div className="space-y-1">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => onUserSelect(user.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUserId === user.id ? 'bg-purple-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    {user.unreadCount && user.unreadCount > 0 ? (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2">
                        {user.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                      {user.lastMessage?.includes('.pdf') && <FileText className="w-3 h-3" />}
                      {user.lastMessage || user.status}
                    </p>
                    {user.timestamp && (
                      <span className="text-xs text-gray-400 ml-2">{formatTime(user.timestamp)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
