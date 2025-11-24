import { useState } from 'react';
import { Message } from '../types';
import ChatWindow from './ChatWindow';

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      fromUser: 0,
      toUser: Number(import.meta.env.VITE_CURRENT_USER_ID),
      message: 'Hello! I am your AI assistant. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSendMessage = async (message: string) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      const errorMsg: Message = {
        id: Date.now() + 1,
        fromUser: 0,
        toUser: Number(import.meta.env.VITE_CURRENT_USER_ID),
        message: 'Please configure your OpenAI API key in the .env file (VITE_OPENAI_API_KEY)',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: message },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      const aiMsg: Message = {
        id: Date.now() + 1,
        fromUser: 0,
        toUser: Number(import.meta.env.VITE_CURRENT_USER_ID),
        message: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        fromUser: 0,
        toUser: Number(import.meta.env.VITE_CURRENT_USER_ID),
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return <ChatWindow userId={0} isAiChat={true} onSendMessage={handleSendMessage} />;
}
