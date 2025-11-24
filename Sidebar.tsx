import { LayoutDashboard, Package, MapPin, MessageSquare, DollarSign, Map, Settings, LogOut, Plus } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'DASHBOARD', color: 'bg-yellow-400' },
    { id: 'shipment', icon: Package, label: 'SHIPMENT', color: 'bg-pink-400' },
    { id: 'tracking', icon: MapPin, label: 'TRACKING', color: 'bg-orange-400' },
  ];

  return (
    <div className="w-20 bg-gradient-to-b from-indigo-600 to-purple-700 flex flex-col items-center py-6 space-y-6">
      <div className="text-white text-xs font-semibold -rotate-90 whitespace-nowrap mb-8">
        Justin
      </div>

      <div className="flex flex-col space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`${item.color} p-3 rounded-lg hover:opacity-90 transition-opacity`}
          >
            <item.icon className="w-6 h-6 text-white" />
          </button>
        ))}

        <button className="bg-purple-800 p-3 rounded-lg hover:bg-purple-900 transition-colors">
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col space-y-6 mb-4">
        <button
          onClick={() => onTabChange('messages')}
          className={`${activeTab === 'messages' ? 'bg-purple-900' : 'bg-transparent'} p-3 rounded-lg hover:bg-purple-900 transition-colors relative`}
        >
          <MessageSquare className="w-6 h-6 text-white" />
          {activeTab === 'messages' && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r" />}
          <span className="absolute -top-1 -right-1 bg-white text-purple-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            358
          </span>
        </button>

        <button className="p-3 rounded-lg hover:bg-purple-900 transition-colors">
          <DollarSign className="w-6 h-6 text-white" />
        </button>

        <button className="p-3 rounded-lg hover:bg-purple-900 transition-colors">
          <Map className="w-6 h-6 text-white" />
        </button>

        <button className="p-3 rounded-lg hover:bg-purple-900 transition-colors">
          <Settings className="w-6 h-6 text-white" />
        </button>

        <button className="p-3 rounded-lg hover:bg-purple-900 transition-colors">
          <LogOut className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
