import React from 'react';
import ChatBot from './components/ChatBot';
import CrisisKeywords from './components/CrisisKeywords';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            혼자가 아니에요
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            AI가 먼저 듣고, 전문가가 함께합니다
          </p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <CrisisKeywords />
            <ChatBot />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App; 