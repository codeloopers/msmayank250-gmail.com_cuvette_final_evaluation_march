import React, { useState } from 'react';
import CreateQuizModal from './CreateQuizModal';
import CreatePollModal from './CreatePollModal'; // Assuming you have a separate component for Poll Type
import '../Modal/Model.css';

const Model = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuizType, setSelectedQuizType] = useState(''); // State to track selected quiz type
  const [quizName, setQuizName] = useState(''); // State to track quiz name

  if (!isOpen) return null;

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const openModal = () => {
    setIsModalOpen(true);
    console.log(quizName, selectedQuizType);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleQuizTypeClick = (type) => {
    setSelectedQuizType(type);
  };

  const handleQuizNameChange = (event) => {
    setQuizName(event.target.value);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content" onClick={stopPropagation}>
          <input
            type="text"
            placeholder="Quiz Name"
            className="input-box"
            value={quizName}
            onChange={handleQuizNameChange}
          />
          <div className="button-group">
            <h3>Quiz Type</h3>
            <div
              className={`button-selectable ${selectedQuizType === 'Q & A' ? 'selected' : ''}`}
              onClick={() => handleQuizTypeClick('Q & A')}
            >
              Q & A
            </div>
            <div
              className={`button-selectable ${selectedQuizType === 'Poll Type' ? 'selected' : ''}`}
              onClick={() => handleQuizTypeClick('Poll Type')}
            >
              Poll Type
            </div>
          </div>
          <div className="button-group">
            <div className="cancelBtn" onClick={onClose}>Cancel</div>
            <div className="nextBtn" onClick={openModal}>Next</div>
          </div>
        </div>
        {isModalOpen && selectedQuizType === 'Q & A' && (
          <CreateQuizModal
            isOpen={isModalOpen}
            onClose={closeModal}
            quizName={quizName}
            selectedQuizType={selectedQuizType}
          />
        )}
        {isModalOpen && selectedQuizType === 'Poll Type' && (
          <CreatePollModal
            isOpen={isModalOpen}
            onClose={closeModal}
            quizName={quizName}
            selectedQuizType={selectedQuizType}
          />
        )}
      </div>
    </>
  );
};

export default Model;
