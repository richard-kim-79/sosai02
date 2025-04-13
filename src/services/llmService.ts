import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  riskLevel: 'LOW' | 'MID' | 'HIGH';
  suggestedActions: string[];
}

export const analyzeMessage = async (message: string, history: ChatMessage[]): Promise<ChatResponse> => {
  const chatWithLLM = httpsCallable(functions, 'chatWithLLM');
  
  try {
    const result = await chatWithLLM({
      message,
      history,
      sessionId: localStorage.getItem('sessionId')
    });
    
    return result.data as ChatResponse;
  } catch (error) {
    console.error('LLM 호출 중 오류 발생:', error);
    throw error;
  }
}; 