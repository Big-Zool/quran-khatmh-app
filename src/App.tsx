import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateKhatm from './pages/CreateKhatm';
import ShareKhatm from './pages/ShareKhatm';
import JoinKhatm from './pages/JoinKhatm';
import ReadingInterface from './pages/ReadingInterface';
import KhatmCompleted from './pages/KhatmCompleted';
import Terms from './pages/Terms';

function App() {
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
      </div>
    </Router>
  );
}

export default App;
