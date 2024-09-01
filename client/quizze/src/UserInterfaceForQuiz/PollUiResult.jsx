import React from 'react';
import '../UserInterfaceForQuiz/QuizUiResult.css'
import image from '../Images/image.png'

const PollUiResult = ({ result }) => {
  return (
    <div className="main-container">
        <div className="result-container">
      <div className='text'>Thank you</div>
      <div className='text'>for participating in </div>
      <div className='text'>the Poll</div>
      </div>
    </div>
  );
};

export default PollUiResult;
