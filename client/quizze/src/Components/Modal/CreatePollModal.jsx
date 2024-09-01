import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Modal/CreatePollModal.css'

const CreatePollModal = ({ isOpen, onClose, quizName, selectedQuizType }) => {
    const [questions, setQuestions] = useState([{ id: 1, questionText: '', options: [{ id: 1, value: '', imageUrl: '' }, { id: 2, value: '', imageUrl: '' }], optionType: 'text' }]);
    const [currentQuestionId, setCurrentQuestionId] = useState(1);
    const [selectedQuestionNumber, setSelectedQuestionNumber] = useState(1);

    const navigate = useNavigate();

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
            questionText: '',
            options: [
              { id: 1, value: '', imageUrl: '' },
              { id: 2, value: '', imageUrl: '' }
            ],
            optionType: 'text'
          }
        ]);
        setCurrentQuestionId(newQuestionId);
        setSelectedQuestionNumber(newQuestionId);
      };
      

    const addOption = (questionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const newOptionId = q.options.length + 1;
                return { ...q, options: [...q.options, { id: newOptionId, value: '', imageUrl: '' }] };
            }
            return q;
        }));
    };

    const removeOption = (questionId, optionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                return { ...q, options: q.options.filter(opt => opt.id !== optionId) };
            }
            return q;
        }));
    };

    const handleQuestionChange = (id, event) => {
        const updatedQuestions = questions.map(q => {
            if (q.id === id) {
                return { ...q, questionText: event.target.value };
            }
            return q;
        });
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionId, optionId, event) => {
        const { name, value } = event.target;
    
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const updatedOptions = q.options.map(opt => {
                    if (opt.id === optionId) {
                        if (q.optionType === 'text') {
                            return { ...opt, value: value };
                        } else if (q.optionType === 'imageUrl') {
                            return { ...opt, imageUrl: value };
                        } else if (q.optionType === 'textAndImage') {
                            if (name === 'textValue') {
                                return { ...opt, value: value };
                            } else if (name === 'imageValue') {
                                return { ...opt, imageUrl: value };
                            }
                        }
                    }
                    return opt;
                });
                return { ...q, options: updatedOptions };
            }
            return q;
        }));
    };
    

    const handleQuizTypeChange = (event) => {
        const updatedQuestions = questions.map(q => {
            if (q.id === currentQuestionId) {
                return { ...q, optionType: event.target.value };
            }
            return q;
        });
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
            const filteredQuestions = questions.filter(q => q.id <= selectedQuestionNumber);

            const response = await axios.post('https://msmayank250-gmail-com-cuvette-final.onrender.com/quiz/create', {
                quizName,
                selectedQuizType,
                questions: filteredQuestions.map(q => ({
                    questionNumber: q.id,
                    questionText: q.questionText,
                    optionType: q.optionType,
                    options: q.options.map(opt => ({
                        text: opt.value,
                        imageUrl: opt.imageUrl,
                    }))
                })),
                userId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

            const quizId = response.data.quizId;
            const value = (`/poll/${quizId}`)
            const selecttedtype =response.data.selectedQuizType

            if(selectedQuizType==='Poll Type'){
                navigate(`/poll/${quizId}`);
            }
            else{
                navigate(`/poll/${quizId}`);
            }
           


        } catch (error) {
            console.error('Error creating poll:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
                <div className="question-nav1">
                    {questions.map(q => (
                        <div
                            key={q.id}
                            className={`question-button ${currentQuestionId === q.id ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentQuestionId(q.id);
                                setSelectedQuestionNumber(q.id);
                            }}
                        >
                        {q.id}
                        </div>
                    ))}
                    <div className="add-question-button-poll" onClick={addQuestion}>+</div>
                </div>
                <div className="question-content">
                    {questions.map(q => (
                        q.id === currentQuestionId && (
                            <div key={q.id}>
                                <input
                                    type="text"
                                    placeholder="Question Text"
                                    value={q.questionText}
                                    onChange={(event) => handleQuestionChange(q.id, event)}
                                    className="input-boxQuiz"
                                />
                                <div className="option-type-selection">
                                    <h4>Option Type</h4>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`optionType-${q.id}`}
                                            value="text"
                                            checked={q.optionType === 'text'}
                                            onChange={handleQuizTypeChange}
                                        />
                                        Text
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`optionType-${q.id}`}
                                            value="imageUrl"
                                            checked={q.optionType === 'imageUrl'}
                                            onChange={handleQuizTypeChange}
                                        />
                                        Image URL
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`optionType-${q.id}`}
                                            value="textAndImage"
                                            checked={q.optionType === 'textAndImage'}
                                            onChange={handleQuizTypeChange}
                                        />
                                        Text & Image URL
                                    </label>
                                </div>
                                <div className="options-container">
                                    <div className="options-group">
                                        {q.options.map((option) => (
                                            <div key={option.id} className="option-row">
                                                {q.optionType === 'text' && (
                                                    <input
                                                        type="text"
                                                        placeholder={'Text'}
                                                        value={option.value}
                                                        onChange={(event) => handleOptionChange(q.id, option.id, event)}
                                                        className="input-boxQuiz1"
                                                    />
                                                )}
                                                {q.optionType === 'imageUrl' && (
                                                    <input
                                                        type="text"
                                                        placeholder={`Image URL for Option ${option.id}`}
                                                        value={option.imageUrl}
                                                        onChange={(event) => handleOptionChange(q.id, option.id, event)}
                                                        className="input-boxQuiz1"
                                                    />
                                                )}
                                                {q.optionType === 'textAndImage' && (
    <div>
        <input
            type="text"
            name="textValue"
            placeholder={`Option ${option.id} Text`}
            value={option.textValue}
            onChange={(event) => handleOptionChange(q.id, option.id, event)}
            className="input-boxQuiz-poll"
        />
        <input
            type="text"
            name="imageValue"
            placeholder={`Option ${option.id} Image URL`}
            value={option.imageValue}
            onChange={(event) => handleOptionChange(q.id, option.id, event)}
            className="input-boxQuiz-poll1"
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
                                        <div className="add-option-button1" onClick={() => addOption(q.id)}>Add Option</div>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
                <div className="button-group">
                    <div className="cancelBtnCreate" onClick={onClose}>Cancel</div>
                    <div className="nextBtn" onClick={handleSubmit}>Next</div>
                </div>
            </div>
        </div>
    );
};

export default CreatePollModal;
