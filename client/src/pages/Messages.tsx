import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Send, User, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  
  // Mock contacts based on role
  const initialContacts = user?.role === 'Student' ? [
    { id: 'c1', name: 'Alice (Recruiter at Google)', role: 'Recruiter', online: true, lastMsg: 'Your interview is scheduled for tomorrow.', unread: 1 },
    { id: 'c2', name: 'Bob (HR at Amazon)', role: 'Recruiter', online: false, lastMsg: 'We received your application.', unread: 0 },
  ] : [
    { id: 's1', name: 'John Doe', role: 'Student', online: true, lastMsg: 'Thank you for the opportunity!', unread: 2 },
    { id: 's2', name: 'Jane Smith', role: 'Student', online: false, lastMsg: 'Can we reschedule?', unread: 0 },
  ];

  const [contacts, setContacts] = useState(initialContacts);
  const [activeContactId, setActiveContactId] = useState(initialContacts[0]?.id || null);
  const [currentMessage, setCurrentMessage] = useState('');
  
  const [chats, setChats] = useState<Record<string, {sender: string, text: string, time: string}[]>>({
    'c1': [
      { sender: 'them', text: 'Hi, we reviewed your profile and were very impressed.', time: '10:00 AM' },
      { sender: 'me', text: 'Thank you! Im very interested in the role.', time: '10:05 AM' },
      { sender: 'them', text: 'Your interview is scheduled for tomorrow.', time: '10:10 AM' }
    ],
    's1': [
      { sender: 'me', text: 'Hi John, congratulations on clearing the first round.', time: '09:00 AM' },
      { sender: 'them', text: 'Thank you for the opportunity!', time: '09:15 AM' }
    ]
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when chats change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, activeContactId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !activeContactId) return;

    const newMessage = { sender: 'me', text: currentMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    
    setChats(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    
    setCurrentMessage('');

    // Simulate a reply after 2 seconds
    setTimeout(() => {
      setChats(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), { sender: 'them', text: 'Okay, noted. Thanks!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
      }));
    }, 2000);
  };

  const activeContact = contacts.find(c => c.id === activeContactId);
  const activeChat = chats[activeContactId || ''] || [];

  return (
    <div className="flex h-[calc(100vh-8rem)] max-h-[800px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Sidebar - Contact List */}
      <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <div 
              key={contact.id}
              onClick={() => {
                setActiveContactId(contact.id);
                // Clear unread
                setContacts(contacts.map(c => c.id === contact.id ? { ...c, unread: 0 } : c));
              }}
              className={`p-4 border-b border-slate-100 flex items-start gap-3 cursor-pointer transition-colors ${
                activeContactId === contact.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-100 border-l-4 border-l-transparent'
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                  {contact.name.charAt(0)}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{contact.name}</h4>
                  {contact.unread > 0 && (
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {contact.unread}
                    </span>
                  )}
                </div>
                <p className={`text-xs truncate ${contact.unread > 0 ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                  {contact.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                  {activeContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{activeContact.name}</h3>
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    {activeContact.online ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</> : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {activeChat.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No messages yet. Say hi!</p>
                </div>
              ) : (
                activeChat.map((msg, idx) => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                      <div className={`px-4 py-2.5 max-w-md rounded-2xl text-sm ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-br-sm shadow-sm' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {msg.time}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3">
              <input 
                type="text"
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                type="submit"
                disabled={!currentMessage.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-bold">Select a conversation</p>
          </div>
        )}
      </div>

    </div>
  );
};
