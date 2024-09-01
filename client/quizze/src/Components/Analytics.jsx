import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Analytics.css'; // Ensure correct path to CSS file
import EditQuizDetailsModal from './Modal/EditQuizDetailsModal'; // Ensure correct path to the modal component
import QuizAnalysis from './QuizAnalysis'; // Ensure correct path to QuizAnalysis component
import PollAnalysis from './PollAnalysis'; // Ensure correct path to PollAnalysis component
import CopyLink from './Modal/CopyLink';

const Analytics = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedQuizType, setSelectedQuizType] = useState(null);
    const [isQuizAnalysisActive, setIsQuizAnalysisActive] = useState(false);
    const [isCopyLinkOpen, setIsCopyLinkOpen] = useState(false);
    const [linkToCopy, setLinkToCopy] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(`https://msmayank250-gmail-com-cuvette-final.onrender.com/quizzes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = response.data.quizzes || [];
                setQuizzes(data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
                setQuizzes([]); // Set an empty array on error
            }
        };

        fetchQuizzes();
    }, []);

    const handleDelete = async (quizId) => {
        try {
            await axios.delete(`https://msmayank250-gmail-com-cuvette-final.onrender.com/quiz/${quizId}`);
            setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleEditClick = (quizId) => {
        setSelectedQuizId(quizId);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedQuizId(null);
    };
    const handleShare = (quizId) => {
        setLinkToCopy(quizId);
        <CopyLink link={quizId}/>
        setIsCopyLinkOpen(true);
        
    };

    const handleQuizAnalysisClick = (quizId) => {
        const selectedQuiz = quizzes.find(quiz => quiz._id === quizId);
        if (selectedQuiz) {
            setSelectedQuizId(quizId);
            setSelectedQuizType(selectedQuiz.selectedQuizType);
            setIsQuizAnalysisActive(true);
        }
    };

    return (
        <div className="analytics-container">
            {!isQuizAnalysisActive && (
                <div className='Quiz-Analysis'>Quiz Analysis</div>
            )}

            {isQuizAnalysisActive ? (
                selectedQuizType === 'Poll Type' ? (
                    <PollAnalysis quizId={selectedQuizId} />
                ) : (
                    <QuizAnalysis quizId={selectedQuizId} />
                )
            ) : (
                <>
                    <div className="analytics-table">
                        <div className="header-row">
                            <div className="header-cell">Sno.</div>
                            <div className="header-cell">Quiz Name</div>
                            <div className="header-cell">Created On</div>
                            <div className="header-cell">Impressions</div>
                        </div>
                        <div className="main-analytics-cell">
                            {quizzes.map((quiz, index) => (
                                <div className={`analytics-row ${index % 2 === 0 ? 'even' : 'odd'}`} key={quiz._id}>
                                    <div className="analytics-cell-sno">{index + 1}</div>
                                    <div className="analytics-cell">{quiz.quizName}</div>
                                    <div className="analytics-cell">{new Date(quiz.createdAt).toLocaleDateString()}</div>
                                    <div className="analytics-cell">{quiz.viewCount || 0}</div>
                                    <div className="analytics-cell links">
                                        <span
                                            className="material-symbols-outlined"
                                            onClick={() => handleEditClick(quiz._id)}
                                            style={{ cursor: 'pointer', color: 'blue' }}
                                        >
                                            edit
                                        </span>
                                        <span
                                            className="material-symbols-outlined"
                                            onClick={() => handleDelete(quiz._id)}
                                            style={{ cursor: 'pointer', color: 'red' }}
                                        >
                                            delete
                                        </span>
                                        <span className="material-symbols-outlined" 
                                            onClick={()=>{
                                            handleShare(quiz._id)
                                            
                                        }
                                        }>share</span>
                                        <span
                                            className="quiz-analysis-link"
                                            onClick={() => handleQuizAnalysisClick(quiz._id)}
                                            style={{ cursor: 'pointer', color: 'green' }}
                                        >
                                            Quiz wise analysis
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isEditModalOpen && (
                        <EditQuizDetailsModal
                            isOpen={isEditModalOpen}
                            onClose={handleCloseModal}
                            quizId={selectedQuizId}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Analytics;
