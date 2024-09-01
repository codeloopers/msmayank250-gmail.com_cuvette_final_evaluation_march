import React, { useState, useEffect } from "react";
import axios from "axios";
import EditQuiz from "./EditQuiz";
import '../Modal/EditQuizDetailsModal.css';
import EditPoll from "./EditPoll";

const EditQuizDetailsModal = ({ isOpen, onClose, quizId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState(''); // Default type

  useEffect(() => {
    if (quizId) {
      axios
        .get(`http://localhost:5001/quiz/${quizId}`)
        .then((response) => {
          const quizData = response.data;
          console.log(quizData);
          setQuizName(quizData.quizName);
          setQuizType(quizData.selectedQuizType); // Set default to "Q & A" if not provided
        })
        .catch((error) => {
          console.error("Error fetching quiz details:", error);
        });
    }
  }, [quizId]);

  if (!isOpen) return null;

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onClose(); // Close the current modal when the EditQuiz modal is closed
  };

  const handleQuizTypeClick = (type) => {
    setQuizType(type); // Update quizType state when a quiz type is selected
  };

  return (
    isOpen && (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={stopPropagation}>
          <div className="input-group">
            <input
              type="text"
              value={quizName}
              className="input-box"
            />
          </div>
          <div className="input-group">
            <h3>Quiz Type</h3>
            <div
              className={`button-selectable1 ${quizType === 'Q & A' ? 'selected' : ''}`}
            >
              Q & A
            </div>
            <div
              className={`button-selectable1 ${quizType === 'Poll Type' ? 'selected' : ''}`}
            >
              Poll Type
            </div>
          </div>
          <div className="button-group">
            <div className="cancelBtn" onClick={onClose}>Cancel</div>
            <button className="nextBtn" onClick={openModal}>Continue</button>
          </div>
        </div>

        {isModalOpen&& quizType === 'Q & A' && (
          <EditQuiz
            isOpen={isModalOpen}
            onClose={closeModal}
            quizName={quizName}
            selectedQuizType={quizType}
            quizId={quizId}
          />
        )}
        {isModalOpen && quizType === 'Poll Type' && (
          <EditPoll
            isOpen={isModalOpen}
            onClose={closeModal}
            quizName={quizName}
            selectedQuizType={quizType}
            quizId = {quizId}
          />
        )}
      </div>
    )
  );
};

export default EditQuizDetailsModal;
