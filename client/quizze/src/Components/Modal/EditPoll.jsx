import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Modal/CreatePollModal.css'

const EditPoll = ({ isOpen, onClose, quizName, quizId, selectedQuizType }) => {
    const [questions, setQuestions] = useState([{ id: 1, questionText: '', options: [{ id: 1, value: '', imageUrl: '' }, { id: 2, value: '', imageUrl: '' }], optionType: 'text' }]);
    const [currentQuestionId, setCurrentQuestionId] = useState(1);
    const [selectedQuestionNumber, setSelectedQuestionNumber] = useState(1);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchQuizData = async () => {
          try {
            const response = await axios.get(`https://msmayank250-gmail-com-cuvette-final.onrender.com/quiz/${quizId}`);
            const quizData = response.data;
    
            // Populate state with fetched data
            setQuestions(quizData.questions.map((q, index) => ({
              id: index + 1,
              questionText: q.questionText,
              options: q.options.map((opt, optIndex) => ({
                id: optIndex + 1,
                value: opt.text,
                imageUrl: opt.imageUrl,
                isCorrect: opt.isCorrect
              })),
              timer: q.timer || "off",
              optionType: q.optionType || "text",
            })));
    
            // Set initial question id
            setCurrentQuestionId(1);
            setSelectedQuestionNumber(1);
          } catch (error) {
            console.error("Error fetching quiz data:", error);
          }
        };
    
        fetchQuizData();
      }, [quizId]);




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
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const updatedOptions = q.options.map(opt => {
                    if (opt.id === optionId) {
                        if (q.optionType === 'text') {
                            return { ...opt, value: event.target.value };
                        } else if (q.optionType === 'imageUrl') {
                            return { ...opt, imageUrl: event.target.value };
                        } else if (q.optionType === 'textAndImage') {
                            if (event.target.dataset.type === 'text') {
                                return { ...opt, value: event.target.value };
                            } else if (event.target.dataset.type === 'imageUrl') {
                                return { ...opt, imageUrl: event.target.value };
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

    

    const handleSubmit = async () => {
        try {
            const filteredQuestions = questions.filter(q => q.id <= selectedQuestionNumber);

            console.log('Payload:', {
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
                }))
            });

            const response = await axios.patch(`https://msmayank250-gmail-com-cuvette-final.onrender.com/quiz/${quizId}/updateEdit`, {
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
                }))
            });

            //const quizId = response.data.quizId;
            const selecttedtype =response.data.selectedQuizType
            console.log(selecttedtype)

            if(selectedQuizType==='Poll Type'){
                navigate(`/poll/${quizId}`);
            }
            else{
                navigate(`/quiz/${quizId}`);
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
                                            
                                        />
                                        Text
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`optionType-${q.id}`}
                                            value="imageUrl"
                                            checked={q.optionType === 'imageUrl'}
                                            
                                        />
                                        Image URL
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`optionType-${q.id}`}
                                            value="textAndImage"
                                            checked={q.optionType === 'textAndImage'}
                                        
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
                                                            placeholder={`Option ${option.id} Text`}
                                                            value={option.value}
                                                            data-type="text"
                                                            onChange={(event) => handleOptionChange(q.id, option.id, event)}
                                                            className="input-boxQuiz-poll"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder={`Option ${option.id} Image URL`}
                                                            value={option.imageUrl}
                                                            data-type="imageUrl"
                                                            onChange={(event) => handleOptionChange(q.id, option.id, event)}
                                                            className="input-boxQuiz-poll1"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                            
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

export default EditPoll;
