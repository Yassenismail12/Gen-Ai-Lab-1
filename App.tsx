
import React, { useState } from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import ImageGenerator from './components/ImageGenerator';
import type { View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('chat');

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header currentView={view} onViewChange={setView} />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto h-full">
          {view === 'chat' ? <Chat /> : <ImageGenerator />}
        </div>
      </main>
    </div>
  );
};

export default App;
