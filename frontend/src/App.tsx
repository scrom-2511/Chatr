import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatMain from './pages/ChatMain';
import SignupAndSignin from './pages/SignupAndSignin';
import Profile from './components/Profile';
import Temp from './pages/Temp';

const App = () => {
  return (
    <Router>
      <div className="h-screen w-screen bg-gray-900">
        <Routes>
          <Route path="/auth" element={<SignupAndSignin />} />
          <Route path="/chat" element={<ChatMain />} />
          <Route path="/chat/:id" element={<ChatMain />} />
          <Route path="/groupChat/:groupId" element={<ChatMain />} />
          <Route path="/temp" element={<Temp />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
