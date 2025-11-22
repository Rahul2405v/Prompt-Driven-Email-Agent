import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import EmailsPage from './components/EmailsPage';
import PromptBrain from './components/promptBrain';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<EmailsPage />} />


        <Route path="/prompts" element={<PromptBrain />} />

      </Routes>
    </Router>
  );
}

export default App;
