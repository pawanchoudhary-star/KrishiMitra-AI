import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BottomNav from './components/BottomNav';
import VoiceAssistant from './components/VoiceAssistant';
import Home from './pages/Home';
import Sell from './pages/Sell';
import Scanner from './pages/Scanner';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import CropSuggest from './pages/CropSuggest';
import CropCare from './pages/CropCare';
import Register from './pages/Register';
import Login from './pages/Login';
import Chatbot from './pages/Chatbot';
import Schemes from './pages/Schemes';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isHomePage = location.pathname === '/';
  
  // Basic route guard
  const RequireAuth = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      return <Navigate to="/register" replace />;
    }
    return children;
  };

  return (
    <div className="app-container">
      <div className="content-area" style={{ paddingBottom: isAuthPage ? '20px' : undefined }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/sell" element={<RequireAuth><Sell /></RequireAuth>} />
            <Route path="/scanner" element={<RequireAuth><Scanner /></RequireAuth>} />
            <Route path="/alerts" element={<RequireAuth><Alerts /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/crop-suggest" element={<RequireAuth><CropSuggest /></RequireAuth>} />
            <Route path="/crop-care" element={<RequireAuth><CropCare /></RequireAuth>} />
            <Route path="/chat" element={<RequireAuth><Chatbot /></RequireAuth>} />
            <Route path="/schemes" element={<RequireAuth><Schemes /></RequireAuth>} />
          </Routes>
        </AnimatePresence>
      </div>
      {isHomePage && !isAuthPage && <VoiceAssistant />}
      {!isAuthPage && <BottomNav />}
    </div>
  );
}

export default App;
