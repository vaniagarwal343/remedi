import React from 'react';
//import './QuickQuestions.css';
import { useNavigate } from 'react-router-dom';

const QuickQuestions = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-questions">
      <h2>Quick Questions</h2>
      <input type="text" placeholder="Ask me a question!" className="search-bar" />
      <button onClick={() => navigate('/chatbot')}>Go to Chatbot</button>
    </div>
  );
};

export default QuickQuestions;