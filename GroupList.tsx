import { useState, useEffect } from 'react';
import { Group } from '../types';

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/groups/list`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitialsColor = (initials: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-green-500',
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return null;
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <div
          key={group.id}
          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
        >
          <div className={`w-10 h-10 ${group.color || getInitialsColor(group.initials)} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
            {group.initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{group.name}</p>
              {group.unreadCount && group.unreadCount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {group.unreadCount}
                </span>
              )}
            </div>
            {group.description && (
              <p className="text-xs text-gray-500 truncate">{group.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
