import React from 'react';
import '../Modal/QuizPreviewModal.css';
import CopyLink from './CopyLink'; // Ensure the correct path

const QuizPreviewModal = ({ isOpen, onClose, quizData }) => {
  if (!isOpen) return null;

  return (
   
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
        <div className='titleshare'>
          <h2>Congrats! Your Quiz is</h2>
          <h2>Published!</h2>
        </div>
        
        <div className="link-container">
          <CopyLink link={quizData} />  
        </div>
        <div className="buttoncancel">
        <div onClick={onClose} className='nextBtn'>Share</div>

        </div>
        
        
      </div>
    </div>
  );
};

export default QuizPreviewModal;
