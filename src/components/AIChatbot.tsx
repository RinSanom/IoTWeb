"use client";

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User, X, Lightbulb } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { geminiAIService } from '@/lib/services/geminiAIService';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatbot({ isOpen, onClose }: ChatbotProps) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (!user || !isAuthenticated) return null;
    
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    
    if (user.username) {
      const nameParts = user.username.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.username.slice(0, 2).toUpperCase();
    }
    
    return user.email.slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user || !isAuthenticated) return 'User';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    return user.username || user.email;
  };

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        content: `Hello${isAuthenticated && user ? `, ${getUserDisplayName()}` : ''}! I'm your Air Quality Assistant. I can help you understand air pollution data, health impacts, and answer questions about environmental monitoring. How can I assist you today?`,
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, [isAuthenticated, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      const aiResponse = await geminiAIService.sendMessage(textToSend, conversationHistory);

      // Start streaming after getting the response
      setIsLoading(false);
      setIsStreaming(true);
      setStreamingMessage('');

      // Simulate streaming effect
      let currentText = '';
      const words = aiResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        setStreamingMessage(currentText);
        
        // Add delay between words to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Add final message to messages array
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessage('');
      setIsStreaming(false);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting right now. Please check your internet connection and try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamingMessage('');
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = geminiAIService.getSuggestedQuestions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-800/20 dark:border-gray-700">
          <DialogTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
            <Bot className="h-5 w-5 text-primary" />
            {isAuthenticated && user ? (
              `AI Assistant for ${getUserDisplayName()}`
            ) : (
              'AI Air Quality Assistant'
            )}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex gap-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 self-start ${
                      message.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600'
                    }`}
                    title={message.role === 'user' && isAuthenticated && user ? `${getUserDisplayName()} (${user.email})` : undefined}
                  >
                    {message.role === 'user' ? (
                      isAuthenticated && getUserInitials() ? (
                        <span className="text-sm font-medium">{getUserInitials()}</span>
                      ) : (
                        <User className="h-4 w-4" />
                      )
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border dark:border-gray-600'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70 dark:opacity-50">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {message.role === 'assistant' && (
                        <p className="text-xs opacity-60 ml-2 dark:opacity-50">
                          {message.content.length} characters
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Suggested Questions */}
            {showSuggestions && messages.length === 1 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lightbulb className="h-4 w-4" />
                  <span>Suggested questions:</span>
                </div>
                <div className="grid gap-2">
                  {suggestedQuestions.slice(0, 4).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="text-left p-2 text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors text-gray-800 dark:text-gray-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* AI Thinking Animation - shows while waiting for response */}
            {isLoading && !isStreaming && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border dark:border-gray-600">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Streaming AI Response - shows while typing response */}
            {isStreaming && streamingMessage && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 flex items-center justify-center flex-shrink-0 self-start">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border dark:border-gray-600 rounded-lg p-3">
                    <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70 dark:opacity-50">
                        {new Date().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs opacity-60 ml-2 text-blue-600 dark:text-blue-400 font-medium">
                        {streamingMessage.length} characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about air quality, health impacts, or pollution..."
                disabled={isLoading}
                className="pr-12 bg-white dark:bg-gray-700 dark:text-white"
              />
              {inputMessage && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                  {inputMessage.length}
                </span>
              )}
            </div>
            <Button
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send • Powered by Gemini AI
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
