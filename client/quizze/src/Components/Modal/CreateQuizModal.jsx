import React, { useState } from "react";
import axios from "axios";
import "../Modal/CreateQuizModal.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import QuizPreviewModal from "./QuizPreviewModal";

const CreateQuizModal = ({ isOpen, onClose, quizName, selectedQuizType }) => {
  
  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: "",
      options: [
        { id: 1, value: "", imageUrl: "", isCorrect: false },
        { id: 2, value: "", imageUrl: "", isCorrect: false },
      ],
      timer: "off",
      optionType: "text",
    },
  ]);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);



  const addQuestion = () => {
    if (questions.length >= 5) {
      alert("You can only add up to 5 questions.");
      return;
    }
  
    const newQuestionId = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: newQuestionId,
        questionText: "",
        options: [
          { id: 1, value: "", imageUrl: "", isCorrect: false },
          { id: 2, value: "", imageUrl: "", isCorrect: false },
        ],
        timer: "off",
        optionType: "text",
      },
    ]);
    setCurrentQuestionId(newQuestionId);
    setSelectedQuestionNumber(newQuestionId);
  };
  

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptionId = q.options.length + 1;
          return {
            ...q,
            options: [
              ...q.options,
              { id: newOptionId, value: "", imageUrl: "", isCorrect: false },
            ],
          };
        }
        return q;
      })
    );
  };

  const removeOption = (questionId, optionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((opt) => opt.id !== optionId),
          };
        }
        return q;
      })
    );
  };

  const handleQuestionChange = (id, event) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        return { ...q, questionText: event.target.value };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionId, optionId, event) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = q.options.map((opt) => {
            if (opt.id === optionId) {
              if (q.optionType === "text") {
                return { ...opt, value: event.target.value };
              } else if (q.optionType === "imageUrl") {
                return { ...opt, imageUrl: event.target.value };
              } else if (q.optionType === "textAndImage") {
                if (event.target.dataset.type === "text") {
                  return { ...opt, value: event.target.value };
                } else if (event.target.dataset.type === "imageUrl") {
                  return { ...opt, imageUrl: event.target.value };
                }
              }
            }
            return opt;
          });
          return { ...q, options: updatedOptions };
        }
        return q;
      })
    );
  };

  const handleCorrectOptionChange = (questionId, optionId) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const updatedOptions = q.options.map((opt) => ({
          ...opt,
          isCorrect: opt.id === optionId,
        }));
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleQuizTypeChange = (event) => {
    const updatedQuestions = questions.map((q) => {
        if (q.id === currentQuestionId) {
            return {
                ...q,
                optionType: event.target.value,
                options: q.options.map((opt) => ({
                    ...opt,
                    value: "",
                    imageUrl: "",
                    isCorrect: false,
                })),
            };
        }
        return q;
    });
    setQuestions(updatedQuestions);
};


  const handleTimerChange = (value) => {
    const updatedQuestions = questions.map((q) => ({ ...q, timer: value }));
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token'); 
        
        if (!userId || !token) {
            console.error("User ID or token is missing.");
            return;
        }

        const filteredQuestions = questions.filter(
            (q) => q.id <= selectedQuestionNumber
        );


        const response = await axios.post("http://localhost:5001/quiz/create", {
            quizName,
            selectedQuizType,
            questions: filteredQuestions.map((q) => ({
                questionNumber: q.id,
                questionText: q.questionText,
                timer: q.timer,
                optionType: q.optionType,
                options: q.options.map((opt) => ({
                    text: opt.value,
                    imageUrl: opt.imageUrl,
                    isCorrect: opt.isCorrect,
                })),
            })),
            userId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const quizId = response.data.quizId;
        const value =  `/quiz/${quizId}`

        setPreviewData(value);
        setIsPreviewOpen(true);

        //navigate(`/quiz/${quizId}`);
    } catch (error) {
        console.error("Error creating quiz:", error);
    }
};
const closePreviewModal = () => {
  setIsPreviewOpen(false);
  setPreviewData(null);
};

  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
        <div className="question-nav">
          {questions.map((q) => (
            <div
              key={q.id}
              className={`question-button ${
                currentQuestionId === q.id ? "active" : ""
              }`}
              onClick={() => {
                setCurrentQuestionId(q.id);
                setSelectedQuestionNumber(q.id);
              }}
            >
              {q.id}
            </div>
          ))}
          <div className="add-question-button" onClick={addQuestion}>
            +
          </div>
        </div>
        <div className="question-content">
          {questions.map(
            (q) =>
              q.id === currentQuestionId && (
                <div key={q.id}>
                  <input
                    type="text"
                    placeholder="Question Text"
                    value={q.questionText}
                    onChange={(event) => handleQuestionChange(q.id, event)}
                    className="input-text1"
                  />
                  <div className="option-type-selection">
                    <h4>Option Type</h4>
                    <label>
                      <input
                        type="radio"
                        name={`optionType-${q.id}`}
                        value="text"
                        checked={q.optionType === "text"}
                        onChange={handleQuizTypeChange}
                      />
                      Text
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`optionType-${q.id}`}
                        value="imageUrl"
                        checked={q.optionType === "imageUrl"}
                        onChange={handleQuizTypeChange}
                      />
                      Image URL
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`optionType-${q.id}`}
                        value="textAndImage"
                        checked={q.optionType === "textAndImage"}
                        onChange={handleQuizTypeChange}
                      />
                      Text & Image URL
                    </label>
                  </div>
                  <div className="options-container">
                    <div className="options-group">
                      {q.options.map((option) => (
                        <div key={option.id} className="option-row">
                          {q.optionType === "text" && (
                            <input
                              type="text"
                              placeholder={`Option ${option.id}`}
                              value={option.value}
                              onChange={(event) =>
                                handleOptionChange(q.id, option.id, event)
                              }
                              className={`input-optionQuiz ${
                                option.isCorrect ? "correct-option" : ""
                              }`}
                              onClick={() =>
                                handleCorrectOptionChange(q.id, option.id)
                              }
                            />
                          )}
                          {q.optionType === "imageUrl" && (
                            <input
                              type="text"
                              placeholder={`Image URL for Option ${option.id}`}
                              value={option.imageUrl}
                              onChange={(event) =>
                                handleOptionChange(q.id, option.id, event)
                              }
                              className={`input-optionQuiz ${
                                option.isCorrect ? "correct-option" : ""
                              }`}
                              onClick={() =>
                                handleCorrectOptionChange(q.id, option.id)
                              }
                            />
                          )}
                          {q.optionType === "textAndImage" && (
                            <div>
                              <input
                                type="text"
                                placeholder={`Option ${option.id} Text`}
                                value={option.value}
                                data-type="text"
                                onChange={(event) =>
                                  handleOptionChange(q.id, option.id, event)
                                }
                                className={`input-optionQuiz-imageandtext ${
                                  option.isCorrect ? "correct-option" : ""
                                }`}
                                onClick={() =>
                                  handleCorrectOptionChange(q.id, option.id)
                                }
                              />
                              <input
                                type="text"
                                placeholder={`Option ${option.id} Image URL`}
                                value={option.imageUrl}
                                data-type="imageUrl"
                                onChange={(event) =>
                                  handleOptionChange(q.id, option.id, event)
                                }
                                className={`input-optionQuiz-imageandtext2 ${
                                  option.isCorrect ? "correct-option" : ""
                                }`}
                                onClick={() =>
                                  handleCorrectOptionChange(q.id, option.id)
                                }
                              />
                            </div>
                          )}
                          {option.id > 2 && (
    <span className="material-symbols-outlined delete-option-icon" onClick={() => removeOption(q.id, option.id)}>
        delete
    </span>
)}

                        </div>
                      ))}
                      <div
                        className="add-option-button"
                        onClick={() => addOption(q.id)}
                      >
                        Add Option
                      </div>
                    </div>
                    <div className="timer-options">
                      <h3>Timer</h3>
                      <div
                        className={`timer-button ${
                          q.timer === "off" ? "active" : ""
                        }`}
                        onClick={() => handleTimerChange("off")}
                      >
                        Off
                      </div>
                      <div
                        className={`timer-button ${
                          q.timer === "5sec" ? "active" : ""
                        }`}
                        onClick={() => handleTimerChange("5sec")}
                      >
                        5 sec
                      </div>
                      <div
                        className={`timer-button ${
                          q.timer === "10sec" ? "active" : ""
                        }`}
                        onClick={() => handleTimerChange("10sec")}
                      >
                        10 sec
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
        <div className="button-group">
          <div className="cancelBtnCreate" onClick={onClose}>
            Cancel
          </div>
          <button className="nextBtn" onClick={handleSubmit}>
            Create Quiz
          </button>
        </div>
      </div>
      <QuizPreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreviewModal}
        quizData={previewData}
      />
      
    </div>
  );
};

export default CreateQuizModal;
