import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import QuizUI from './UserInterfaceForQuiz/QuizUI';
import PollUI from './UserInterfaceForQuiz/PollUI';
import QuizAnalysis from './Components/QuizAnalysis';
import 'react-toastify/dist/ReactToastify.css';
import PollUiResult from './UserInterfaceForQuiz/PollUiResult';
import './App.css'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/quiz/:quizID" element={<QuizUI />} />
        <Route path="/poll/:quizID" element={<PollUI />} />
        <Route path="/quiz/:quizId/analysis" element={<QuizAnalysis />} /> 
        <Route path="/poll-result" element={<PollUiResult />} />
        
      </Routes>
    </Router>
    
    </>
  );
}

export default App;
