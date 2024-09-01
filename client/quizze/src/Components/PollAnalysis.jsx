import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PollAnalysis.css'; 

const PollAnalysis = ({ quizId, quizName }) => {
    const [analysisData, setAnalysisData] = useState(null);
    const [impression, setImpression] = useState(null);
    const [createdAt, setCreatedAt] = useState(null);

    useEffect(() => {
        const fetchQuizAnalysis = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/poll/${quizId}/analysis`);

                setAnalysisData(response.data);

                const data = await axios.get(`http://localhost:5001/quiz/${quizId}`);
                setImpression(data.data.viewCount);

                const date = new Date(data.data.createdAt);
                const options = { day: '2-digit', month: 'long', year: 'numeric' };
                setCreatedAt(date.toLocaleDateString('en-GB', options));
            } catch (error) {
                console.error('Error fetching quiz analysis:', error);
            }
        };

        fetchQuizAnalysis();
    }, [quizId]);

    if (!analysisData) {
        return <div>Loading analysis...</div>;
    }

    return (
        <div className="quiz-analysis-container">
            <div className="header-title">
                <h1>{analysisData.quizName} Poll Analysis</h1>
                <div>
                    <div className='createdOn'>Created on: {createdAt}</div>
                    <div className='impressionAnalysis'>Impressions: {impression}</div>
                </div>
            </div>
            <div className="questions-container">
                {analysisData.questions.map((question, index) => (
                    <div key={index} className="question-section">
                        <h2>Q. {question.questionNumber}: {question.questionText}</h2>
                        <div className="card-row">
                            {analysisData.poll[index].map((option, idx) => (
                                <div key={idx} className="card_answers1">
                                    <h2>{option.pollCount}</h2>
                                    {question.optionType === 'imageUrl' ? (
                                        <img src={option.imgUrl} alt={`Option ${idx+1}`} className="poll-image" />
                                    ) : (
                                        <h3>{option.text}</h3>
                                    )}
                                    
                                </div>
                            ))}
                        </div>
                        <span className='line'></span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollAnalysis;
