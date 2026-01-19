import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateKhatm from './pages/CreateKhatm';
import ShareKhatm from './pages/ShareKhatm';
import JoinKhatm from './pages/JoinKhatm';
import ReadingInterface from './pages/ReadingInterface';
import KhatmCompleted from './pages/KhatmCompleted';
import Terms from './pages/Terms';

import { Analytics } from '@vercel/analytics/react';

import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  // Theme initialization is now handled better inside components or a ThemeProvider, 
  // but for now we keep the existing useEffect logic here or move it? 
  // The user didn't ask to change theme logic, but LanguageProvider usually might sit alongside it.
  // Actually, wait, let's keep the existing useEffect here but wrap everything in LanguageProvider.

  // Note: The previous logic for theme init still exists.
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const isDarkPref = storedTheme === 'dark' || !storedTheme;
    if (isDarkPref) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen font-arabic text-text-main dark:text-white bg-background-light dark:bg-background-dark">
          <Routes>
            <Route path="/" element={<CreateKhatm />} />
            <Route path="/share/:khatmId" element={<ShareKhatm />} />
            <Route path="/share" element={<ShareKhatm />} />
            <Route path="/join/:khatmId" element={<JoinKhatm />} />
            <Route path="/read/:khatmId" element={<ReadingInterface />} />
            <Route path="/completed/:khatmId" element={<KhatmCompleted />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <Analytics />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
