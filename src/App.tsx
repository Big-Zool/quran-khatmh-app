import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateKhatm from './pages/CreateKhatm';
import ShareKhatm from './pages/ShareKhatm';
import JoinKhatm from './pages/JoinKhatm';
import ReadingInterface from './pages/ReadingInterface';
import KhatmCompleted from './pages/KhatmCompleted';
import Terms from './pages/Terms';

import { Analytics } from '@vercel/analytics/react';

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    // Default to dark if no preference (null), or if explicitly 'dark'
    const isDarkPref = storedTheme === 'dark' || !storedTheme;

    if (isDarkPref) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
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
  );
}

export default App;
