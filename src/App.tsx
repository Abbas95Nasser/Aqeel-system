import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import MemberForm from './components/MemberForm';
import Login from './components/Login';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'form'>('home');
  const [editingMemberId, setEditingMemberId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddMember = (memberId?: string) => {
    setEditingMemberId(memberId);
    setCurrentView('form');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('home');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col print:bg-white print:min-h-0">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="font-black text-sm uppercase tracking-widest text-gray-700">Aqeel Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-400">{user.email}</span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold ml-4 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">خروج</span>
          </button>
        </div>
      </header>

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
