import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { analyzeMessage } from '../services/llmService';
import { savePersonalInfo } from '../services/personalInfoService';
import PersonalInfoModal from './PersonalInfoModal';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  riskLevel?: 'LOW' | 'MID' | 'HIGH';
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 세션 ID 생성 또는 복원
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem('sessionId', newSessionId);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePersonalInfoSubmit = async (data: { 
    name: string; 
    location: string; 
    contact: string;
    isChild: boolean;
  }) => {
    try {
      // 개인정보 저장
      await savePersonalInfo(data);
      
      // 전문가 연동 알림
      const expertMessage: Message = {
        id: uuidv4(),
        text: data.isChild 
          ? '곧 어른이 전화줄 거예요. 도와줄게요. 조금만 기다려주세요.'
          : '귀하의 정보는 암호화되어 저장됩니다. 곧 담당부서 관계자가 연락드리겠습니다.',
        sender: 'ai',
        timestamp: new Date(),
        riskLevel: 'HIGH'
      };
      setMessages(prev => [...prev, expertMessage]);
    } catch (error) {
      console.error('개인정보 저장 중 오류 발생:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        text: '개인정보 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: uuidv4(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await analyzeMessage(input, history);
      
      const aiMessage: Message = {
        id: uuidv4(),
        text: response.message,
        sender: 'ai',
        timestamp: new Date(),
        riskLevel: response.riskLevel
      };

      setMessages((prev) => [...prev, aiMessage]);

      // 위험도에 따른 추가 조치
      if (response.riskLevel === 'HIGH') {
        setShowPersonalInfoModal(true);
      }
    } catch (error) {
      console.error('채팅 처리 중 오류 발생:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
                {message.riskLevel && (
                  <div className="mt-1 text-xs">
                    위험도: {message.riskLevel}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '전송'}
            </button>
          </div>
        </form>
      </div>

      <PersonalInfoModal
        isOpen={showPersonalInfoModal}
        onClose={() => setShowPersonalInfoModal(false)}
        onSubmit={handlePersonalInfoSubmit}
      />
    </>
  );
};

export default ChatBot; 