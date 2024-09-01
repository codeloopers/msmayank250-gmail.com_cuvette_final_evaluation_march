import React from 'react';
import '../UserInterfaceForQuiz/QuizUiResult.css'
import image from '../Images/image.png'

const QuizUiResult = ({ result }) => {
  return (
    <div className="result-container">
      <h2>Congrats Quiz is completed</h2>
      <img src={image} alt="" className='trophy'/>
      <div className='result'>Your Score is 
      <span> 0{result.correctAnswers}/</span>
      <span>0{result.totalQuestions}</span>
      </div>
    </div>
  );
};

export default QuizUiResult;
