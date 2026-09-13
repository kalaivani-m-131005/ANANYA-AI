import { useEffect, useState, useRef } from 'react';
import { Bot, Send, MessageSquare, Plus, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getConversations, getConversation, deleteConversation, sendChatMessage, type Conversation, type Message } from '@/services/ai';
import { Spinner } from '@/components/ui/Spinner';

export default function AIChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0 && !currentConversationId) {
        loadConversation(data[0]._id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
      setLoading(false);
    }
  };

  const loadConversation = async (id: string) => {
    setLoading(true);
    try {
      const data = await getConversation(id);
      setCurrentConversationId(id);
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load conversation', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setError(null);
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;
    try {
      await deleteConversation(id);
      if (currentConversationId === id) {
        handleNewChat();
      }
      fetchConversations();
    } catch (err) {
      console.error('Failed to delete conversation', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    const newMessage: Message = { role: 'user', content: inputMessage.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setSending(true);
    setError(null);

    try {
      const response = await sendChatMessage(newMessage.content, currentConversationId || undefined);
      const assistantMessage: Message = { role: 'assistant', content: response.reply };
      setMessages(prev => [...prev, assistantMessage]);
      
      if (!currentConversationId) {
        setCurrentConversationId(response.conversationId);
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send message', err);
      setError('Sorry, I couldn\'t process that request right now. Please try again.');
      // Remove the optimistic user message if failed
      setMessages(prev => prev.slice(0, -1));
      setInputMessage(newMessage.content); // restore input
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    "Explain OOP concepts in Java",
    "Create a study plan for my exams",
    "Help me understand this programming error",
    "How can I prepare for a technical interview?"
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex bg-slate-950">
      {/* Sidebar */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
        <div className="p-4 border-b border-slate-800">
          <button
            onClick={handleNewChat}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-sm text-slate-500 text-center mt-4">Start your first conversation with ANANYA-AI.</p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv._id}
                onClick={() => loadConversation(conv._id)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  currentConversationId === conv._id ? 'bg-slate-800 text-indigo-400' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium truncate">{conv.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conv._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative bg-slate-950">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size={10} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8">
                  <div>
                    <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Bot className="h-8 w-8 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">How can I help with your studies today?</h2>
                    <p className="text-slate-400">ANANYA-AI uses your academic profile, goals, and planner to provide personalized help.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => setInputMessage(prompt)}
                        className="p-4 text-left border border-slate-800 rounded-xl hover:bg-slate-800/50 hover:border-indigo-500/50 transition-colors group"
                      >
                        <p className="text-sm text-slate-300 group-hover:text-white">{prompt}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-6 pb-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-slate-800' : 'bg-indigo-600'
                      }`}>
                        {msg.role === 'user' ? <span className="text-sm text-slate-300 font-medium">U</span> : <Bot className="h-5 w-5 text-white" />}
                      </div>
                      <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-slate-800 text-slate-100 rounded-tr-none' 
                            : 'bg-transparent text-slate-300'
                        }`}>
                          {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 max-w-none">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex items-center text-slate-400 text-sm gap-2 mt-2">
                        <Spinner size={4} /> ANANYA-AI is thinking...
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center shrink-0">
                        <Bot className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="px-5 py-3 rounded-2xl bg-red-950/50 text-red-400 border border-red-900/50 text-sm">
                        {error}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950 border-t border-slate-900">
              <div className="max-w-4xl mx-auto relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question or type a prompt..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-12 py-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none overflow-hidden min-h-[56px] max-h-32"
                  rows={1}
                  disabled={sending}
                  style={{ minHeight: '56px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sending}
                  className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-center text-xs text-slate-600 mt-3">
                ANANYA-AI can make mistakes. Verify important information.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
