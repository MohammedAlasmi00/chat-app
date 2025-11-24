export interface User {
  id: number;
  name: string;
  avatar?: string;
  status?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface Group {
  id: number;
  name: string;
  initials: string;
  description?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  color?: string;
}

export interface Message {
  id: number;
  fromUser: number;
  toUser: number;
  message: string;
  timestamp?: string;
  type?: 'text' | 'audio' | 'file';
  fileName?: string;
  fileSize?: string;
}

export interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  members?: number;
}
