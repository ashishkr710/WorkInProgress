import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Chat from './components/Chat';

function App() {
  return (
    <div className="app-container md-6">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Login />} />
          <Route path="/chat/:userId/:agencyId" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App; 