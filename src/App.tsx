import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ErrorPage from '@pages/error';
import GuidePage from '@pages/guide';
import LearnPage from '@pages/learn';
import LoginPage from '@pages/login';
import MainPage from '@pages/main';
import NewsPage from '@pages/news';
import PlayPage from '@pages/play';
import PuzzlesPage from '@pages/puzzles';
import ReviewPage from '@pages/review';
import SignUpPage from '@pages/signup';
import SocialPage from '@pages/social';

import Header from '@components/Header';

import '@styles/global.scss';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/play" element={<PlayPage />} />
      <Route path="/puzzles" element={<PuzzlesPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/social" element={<SocialPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
