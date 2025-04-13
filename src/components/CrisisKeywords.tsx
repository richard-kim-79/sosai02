import React, { useState } from 'react';
import { crisisKeywords, CrisisKeyword } from '../data/crisisKeywords';

const CrisisKeywords: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState<CrisisKeyword | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">
        많은 분들이 다음과 같은 일로 어려움을 겪고 있다고 상담해주셨습니다.
      </h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {crisisKeywords.map((keyword) => (
          <button
            key={keyword.keyword}
            onClick={() => setSelectedKeyword(keyword)}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
          >
            #{keyword.keyword}
          </button>
        ))}
      </div>

      {selectedKeyword && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">{selectedKeyword.title}</h3>
          <p className="text-gray-600 mb-4">{selectedKeyword.description}</p>
          
          <div className="space-y-2">
            {selectedKeyword.contacts.map((contact, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">{contact.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <a 
                    href={`tel:${contact.phone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {contact.phone}
                  </a>
                  <span className="text-gray-400">|</span>
                  <a 
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    홈페이지 바로가기
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrisisKeywords; 