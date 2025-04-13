import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import OpenAI from 'openai';

admin.initializeApp();
const corsHandler = cors({ origin: true });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatRequest {
  message: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  sessionId: string;
}

interface ChatResponse {
  message: string;
  riskLevel: 'LOW' | 'MID' | 'HIGH';
  suggestedActions: string[];
}

export const chatWithLLM = functions.https.onCall(async (data: ChatRequest, context) => {
  try {
    const { message, history, sessionId } = data;

    // 위험 키워드 체크
    const riskKeywords = {
      HIGH: ['죽고 싶다', '자살', '끝내고 싶다', '살기 싫다'],
      MID: ['힘들다', '외롭다', '도와줘', '상담'],
    };

    let riskLevel: 'LOW' | 'MID' | 'HIGH' = 'LOW';
    
    // 위험 키워드 분석
    for (const keyword of riskKeywords.HIGH) {
      if (message.includes(keyword)) {
        riskLevel = 'HIGH';
        break;
      }
    }

    if (riskLevel === 'LOW') {
      for (const keyword of riskKeywords.MID) {
        if (message.includes(keyword)) {
          riskLevel = 'MID';
          break;
        }
      }
    }

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `당신은 위기 상황에 있는 사람들을 도와주는 상담사입니다. 
          공감과 이해를 바탕으로 대화하며, 위험도가 높은 경우 전문가의 도움이 필요함을 알려주세요.
          현재 위험도: ${riskLevel}`
        },
        ...history,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content || '죄송합니다. 응답을 생성하는데 문제가 발생했습니다.';

    // 위험도에 따른 제안 액션
    const suggestedActions = [];
    if (riskLevel === 'HIGH') {
      suggestedActions.push('전문가 상담 연결', '긴급 연락처 제공');
    } else if (riskLevel === 'MID') {
      suggestedActions.push('상담 예약 안내', '자조 그룹 추천');
    }

    return {
      message: aiResponse,
      riskLevel,
      suggestedActions,
    } as ChatResponse;

  } catch (error) {
    console.error('Error in chatWithLLM:', error);
    throw new functions.https.HttpsError('internal', '채팅 처리 중 오류가 발생했습니다.');
  }
}); 