import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Loader2,
  ExternalLink,
  HelpCircle,
  Compass,
  MessageSquare,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface IslamicAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

const DEFAULT_SUGGESTIONS = [
  'What are the recommended Azkar after finishing Sallah?',
  'How do I perform Sujud as-Sahw (prostration of forgetfulness)?',
  'What are traveler concessions (Qasr and Jam) for prayer?',
  'How can I improve my Khushu and presence of heart in Sallah?',
  'What is the virtue of reciting Ayat al-Kursi after each prayer?',
];

export const IslamicAIAssistantModal: React.FC<IslamicAIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('sallah_ai_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        text: 'As-salamu alaykum wa rahmatullah. I am your Islamic knowledge assistant for Sallah Mate. Ask me about prayer rulings (Fiqh of Salah), post-prayer Adhkar, Khushu, Quranic verses, authentic Hadith, or traveler concessions.',
        references: ['Surah Al-Baqarah 2:43', 'Sahih al-Bukhari 527'],
        suggestedFollowUps: [
          'What are the recommended Azkar after Sallah?',
          'How to attain Khushu in prayer?',
          'What are the prayer times rules?',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial question if passed
  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleAskQuestion(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  // Save chat history
  useEffect(() => {
    try {
      localStorage.setItem('sallah_ai_chat_history', JSON.stringify(messages.slice(-20)));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleAskQuestion = async (queryText?: string) => {
    const q = (queryText || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const historyContext = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/islamic-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          history: historyContext,
          context: 'User learning about Sallah, post-prayer Azkar, Quran and Hadith in Sallah Mate app',
        }),
      });

      if (!res.ok) {
        throw new Error('Server request failed');
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'May Allah bless your quest for knowledge.',
        references: data.references || ['Quran & Sunnah'],
        suggestedFollowUps: data.suggestedFollowUps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const fallbackMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: 'Allah commands us to establish prayer and turn to Him in sincere remembrance. "Unquestionably, by the remembrance of Allah hearts are assured" (Surah Ar-Ra’d 13:28). For verified guidance, consult the Quran and authentic Sahih Hadith.',
        references: ['Surah Ar-Ra’d 13:28', 'Sahih al-Bukhari 527'],
        suggestedFollowUps: ['What are the authentic Adhkar after Sallah?', 'How to pray with Khushu?'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);
    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear conversation history?')) {
      window.speechSynthesis?.cancel();
      setIsSpeakingId(null);
      setMessages([
        {
          id: 'welcome-msg-reset',
          role: 'assistant',
          text: 'As-salamu alaykum. How may I assist your Islamic studies and prayer practice today?',
          references: ['Surah Al-Baqarah 2:43'],
          suggestedFollowUps: DEFAULT_SUGGESTIONS.slice(0, 3),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div
        id="islamic-ai-assistant-modal"
        className="max-w-2xl w-full h-[85vh] bg-stone-900 border border-stone-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Islamic AI Scholar</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-semibold uppercase tracking-wider">
                  Gemini Powered
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Grounded in Quran, Sahih Hadith, Sallah rulings & post-prayer Azkar
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="close-ai-assistant-modal-btn"
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsSpeakingId(null);
                onClose();
              }}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-stone-950/90 border border-stone-800 text-stone-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* References for Assistant */}
                {msg.role === 'assistant' && msg.references && msg.references.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-400" />
                      Citations:
                    </span>
                    {msg.references.map((ref, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-emerald-300 font-mono"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                )}

                {/* Audio Read & Timestamp */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-stone-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.id, msg.text)}
                      className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition"
                      title={isSpeakingId === msg.id ? 'Stop reading' : 'Read aloud'}
                    >
                      {isSpeakingId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span className="text-amber-300">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Recite</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Follow up suggestions */}
                {msg.role === 'assistant' &&
                  msg.suggestedFollowUps &&
                  msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((fu, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleAskQuestion(fu)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-stone-900 hover:bg-stone-800 border border-emerald-500/20 hover:border-emerald-500/50 text-stone-300 hover:text-emerald-300 transition text-left"
                        >
                          → {fu}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}

          {/* Loading state indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-stone-950/90 border border-stone-800 text-stone-300 rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-2 text-xs">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Consulting Islamic Quran & Hadith knowledge...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Pills */}
        <div className="px-4 py-2 bg-stone-950/60 border-t border-stone-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
          <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">Prompts:</span>
          {DEFAULT_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleAskQuestion(sug)}
              className="text-[11px] px-3 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-stone-300 hover:text-white whitespace-nowrap transition"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-stone-950 border-t border-stone-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskQuestion();
            }}
            className="flex items-center space-x-2"
          >
            <input
              id="ai-assistant-question-input"
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask anything about Sallah, post-prayer Azkar, Fiqh, Quran, or Hadith..."
              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500/60"
            />
            <button
              id="send-ai-question-btn"
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
