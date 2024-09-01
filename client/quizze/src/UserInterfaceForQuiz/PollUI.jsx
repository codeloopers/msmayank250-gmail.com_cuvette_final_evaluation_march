import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../UserInterfaceForQuiz/QuizUI.css';

const PollUI = () => {
  const { quizID } = useParams();
  const navigate = useNavigate();  // Add this hook
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!quizID) {
          throw new Error('Quiz ID is undefined');
        }
        const response = await axios.get(`http://localhost:5001/quiz/${quizID}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [quizID]);

  useEffect(() => {
    const countIncrease = async () => {
      try {
        await axios.patch(`http://localhost:5001/quiz/${quizID}/incrementViewCount`);
      } catch (error) {
        console.log(error);
      }
    };
    countIncrease();
  }, [quizID]);

  const handleOptionChange = async (questionIndex, optionId) => {
    try {
      setSelectedOptions(prevSelectedOptions => {
        const newSelectedOptions = [...prevSelectedOptions];
        newSelectedOptions[questionIndex] = optionId;
        return newSelectedOptions;
      });

      await axios.patch(`http://localhost:5001/quiz/${quizID}/questions/${questionIndex}/options/${optionId}/incrementCount`);
    } catch (error) {
      console.error('Error updating option count:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleSubmit = () => {
    navigate('/poll-result');  // Navigate to PollUIResult
  };

  if (!quiz) return <div>Loading...</div>;

  const { questions } = quiz;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="main-container">
      <div className="card-container">
        <div className="card-header">
          <div className="question-count">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
        <div className="card-question">{currentQuestion.questionText}</div>
        <div className="mainOptioncard">
          <div className="options-card1">
            {currentQuestion.optionType === 'text' && currentQuestion.options.map(option => (
              <div
                key={option._id}
                className={`options-btn ${selectedOptions[currentQuestionIndex] === option._id ? 'selected' : ''}`}
                onClick={() => handleOptionChange(currentQuestionIndex, option._id)}
              >
                {option.text}
              </div>
            ))}
            {currentQuestion.optionType === 'imageUrl' && currentQuestion.options.map(option => (
              <div
                key={option._id}
                className={`options-btn ${selectedOptions[currentQuestionIndex] === option._id ? 'selected' : ''}`}
                onClick={() => handleOptionChange(currentQuestionIndex, option._id)}
              >
                <img src={option.imageUrl} alt={`Option ${option._id}`} />
              </div>
            ))}
            {currentQuestion.optionType === 'textAndImage' && currentQuestion.options.map(option => (
              <div
                key={option._id}
                className={`options-btn btn-img-txt ${selectedOptions[currentQuestionIndex] === option._id ? 'selected' : ''}`}
                onClick={() => handleOptionChange(currentQuestionIndex, option._id)}
              >
                <div>{option.text}</div>
                <img src={option.imageUrl} alt={`Option ${option._id}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="navigation-buttons">
          {isLastQuestion ? (
            <div className="card-submit-button" onClick={handleSubmit}>
              Submit
            </div>
          ) : (
            <div className="card-submit-button" onClick={handleNextQuestion}>
              Next
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollUI;
