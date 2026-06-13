import { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import SettingsPage from './components/SettingsPage';
import GeneratePage from './components/GeneratePage';
import './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('settings');

  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <nav className="main-nav">
        <div className="nav-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#6366f1"/>
            <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>BLAST Test Strategy</span>
        </div>
        <div className="nav-links">
          <button
            className={currentPage === 'settings' ? 'active' : ''}
            onClick={() => navigate('settings')}
          >
            Settings
          </button>
          <button
            className={currentPage === 'generate' ? 'active' : ''}
            onClick={() => navigate('generate')}
          >
            Generate
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'settings' && <SettingsPage onNavigate={navigate} />}
        {currentPage === 'generate' && <GeneratePage onNavigate={navigate} />}
      </main>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;