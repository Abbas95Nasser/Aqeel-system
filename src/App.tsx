import React, { useState } from 'react';
import Home from './components/Home';
import MemberForm from './components/MemberForm';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'form'>('home');
  const [editingMemberId, setEditingMemberId] = useState<string | undefined>(undefined);

  const handleAddMember = (memberId?: string) => {
    setEditingMemberId(memberId);
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col print:bg-white print:min-h-0">
      <div className="flex-1">
        {currentView === 'home' ? (
          <Home onAddMember={handleAddMember} />
        ) : (
          <MemberForm 
            onBack={() => setCurrentView('home')} 
            memberId={editingMemberId}
          />
        )}
      </div>
      
      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 font-bold no-print mt-auto border-t border-gray-200 bg-white">
        تطوير وتصميم عباس الأمين
      </footer>
    </div>
  );
}
