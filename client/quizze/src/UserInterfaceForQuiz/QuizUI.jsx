import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../UserInterfaceForQuiz/QuizUI.css';
import QuizUiResult from './QuizUiResult';

const QuizUI = () => {
  const { quizID } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!quizID) {
          throw new Error('Quiz ID is undefined');
        }
        // Fetch the quiz data
        const response = await axios.get(`http://localhost:5001/quiz/${quizID}`);
        setQuiz(response.data);

        // Initialize timer based on quiz settings if needed
        if (response.data.questions[currentQuestionIndex].timer !== "off") {
          setTimer(parseInt(response.data.questions[currentQuestionIndex].timer, 10));
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [quizID, currentQuestionIndex]);

  useEffect(() => {
    const countIncrease = async () => {
      try {
        const count = await axios.patch(`http://localhost:5001/quiz/${quizID}/incrementViewCount`);

      } catch (error) {
        console.log(error);
      }
    };
    countIncrease();
  }, [quizID]);

  useEffect(() => {
    if (timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleOptionChange = (questionIndex, optionId) => {
    setSelectedOptions(prevSelectedOptions => {
      const newSelectedOptions = [...prevSelectedOptions];
      newSelectedOptions[questionIndex] = optionId;
      return newSelectedOptions;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimer(parseInt(quiz.questions[currentQuestionIndex + 1].timer, 10)); // Reset timer for next question
    }
  };

  const handleSubmit = async () => {
    try {
      const correctAnswers = quiz.questions.map(q =>
        q.options.find(option => option.isCorrect)?._id
      );
  
      const userAnswers = selectedOptions;
  
      const questionResults = quiz.questions.map((question, index) => {
        const isCorrect = userAnswers[index] === correctAnswers[index];
        return {
          questionId: question._id,
          isCorrect,
        };
      });
  
      const correctCount = questionResults.filter(q => q.isCorrect).length;
      const totalAttempts = quiz.questions.length;
      const totalWrong = totalAttempts - correctCount;
  
      const resultData = {
        correctAnswers: correctCount,
        totalQuestions: totalAttempts,
        quizID,
        answers: selectedOptions,
        totalAttempts,
        totalRight: correctCount,
        totalWrong,
        questionResults, 
      };
  
  
      const response = await axios.patch(`http://localhost:5001/quiz/${quizID}/update`, resultData);
  
  
      setResult(resultData);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };
  
  
  
  
  
  

  if (!quiz) return <div>Loading...</div>;

  const { questions } = quiz;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="main-container">
      {!result ? (
        <div className="card-container">
          <div className="card-header">
            <div className="question-count">
              {currentQuestionIndex + 1} / {questions.length}
            </div>
            <div className="timer">{formatTime(timer)}s</div>
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
                  className="options-btn-2"
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
      ) : (
        <QuizUiResult result={result} />
      )}
    </div>
  );
};

export default QuizUI;
