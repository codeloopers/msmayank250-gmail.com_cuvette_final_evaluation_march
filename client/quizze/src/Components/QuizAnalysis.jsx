import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QuizAnalysis.css'; // Ensure correct path to CSS file

const QuizAnalysis = ({ quizId ,quizName}) => {
    const [analysisData, setAnalysisData] = useState(null);
    const [Impression,setImpression] = useState(null);
    const [ceratedAT,setCreatedAt] = useState(null)

    useEffect(() => {
        const fetchQuizAnalysis = async () => {
            try {
                const response = await axios.get(`https://msmayank250-gmail-com-cuvette-final.onrender.com/quiz/${quizId}/analysis`);
                setAnalysisData(response.data);

                const data = await axios.get(`https://msmayank250-gmail-com-cuvette-final.onrender.com/quiz/${quizId}`)
                setImpression(data.data.viewCount)

                const date = new Date(data.data.createdAt);
                
                const options = { day: '2-digit', month: 'long', year: 'numeric' };
                setCreatedAt(date.toLocaleDateString('en-GB', options))
                

                


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
            <h1>{analysisData.quizName} Question Analysis</h1>
            <div>
            <div className='createdOn'>Created on : {ceratedAT}</div>
            <div className='impressionAnalysis'>Imprssion : {Impression}</div>
                
            </div>
            </div>
            <div className="questions-container">
                {analysisData.questions.map((question, index ) => (
                    <div key={index} className="question-section">
                        <h2>Q. {question.questionNumber}: {question.questionText}</h2>
                        <div className="card-row">
                            <div className="card_answers">
                                <h3>{question.totalRight+question.totalWrong}</h3>
                                <p>people Attempted the question</p>
                            </div>
                            <div className="card_answers">
                                <h3>{question.totalRight}</h3>
                                <p>people Answerd Correctly</p>
                            </div>
                            <div className="card_answers">
                                <h3>{question.totalWrong}</h3>
                                <p>people Answerd Incorrectly</p>
                            </div>
                        </div>
                        <span className='line'></span>
                    </div>
                ))}
                
            </div>
        </div>
    );
};

export default QuizAnalysis;
