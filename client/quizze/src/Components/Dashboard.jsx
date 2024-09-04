import React, { useState, useEffect } from "react";
import styles from "../Components/Dashboard.css";
import Modal from "./Modal/Model";
import Analytics from "./Analytics";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import eye from "../Images/eye.png";

const Dashboard = () => {

  const title = 'Quiz Analysis'
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [quizCount, setQuizCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [quizzes, setQuizzes] = useState([]); 

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token"); 

        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch data for quiz counts and impressions
        const quizzesResponse = await axios.get(
          "https://msmayank250-gmail-com-cuvette-final.onrender.com/quiz/getQuizData",
          {
            headers: { Authorization: `Bearer ${token}` }, // Include token in headers
          }
        );

        const quizzesData = quizzesResponse.data;
        const QuizCount = quizzesData.length;
        setQuizCount(QuizCount);

        const totalQuestion = quizzesData.reduce(
          (total, quiz) => total + quiz.questions.length,
          0
        );
        setQuestionCount(totalQuestion);

        const totalViewCount = quizzesData.reduce(
          (total, quiz) => total + quiz.viewCount,
          0
        );
        setImpressions(totalViewCount);

        // Fetch data for quizzes to display below the cards
        const quizzesNewResponse = await axios.get(
          "https://msmayank250-gmail-com-cuvette-final.onrender.com/quizzes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Access quizzes from response object
        const fetchedQuizzes = quizzesNewResponse.data.quizzes;
        if (Array.isArray(fetchedQuizzes)) {
          setQuizzes(fetchedQuizzes);
        } else {
          console.error("Unexpected data format:", quizzesNewResponse.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access. Please log in again.");
        } else {
          console.error("Error fetching quizzes:", error);
        }
      }
    };

    fetchQuizzes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return (
          <div className="content">
            <div className="card-content">
              <div className="card card1">
                <div className="card-header-dashboard">
                  <div className="textValue">{quizCount}</div>
                  <div className="textQuiz1">Quiz</div>
                </div>
                <div className="card-body1">Created</div>
              </div>
              <div className="card card2">
                <div className="card-header-dashboard">
                  <div className="textValue">{questionCount}</div>
                  <div className="textQuiz2">questions</div>
                </div>
                <div className="card-body2">Created</div>
              </div>
              <div className="card card3">
                <div className="card-header-dashboard">
                  <div className="textValue">{impressions}</div>
                  <div className="textQuiz3">Total</div>
                </div>
                <div className="card-body3">Impressions</div>
              </div>
            </div>
            <h1 className="trending">Trending Quizs</h1>
            <div className="quizzes-list">
              {quizzes
                .filter((quiz) => quiz.viewCount >= 10) 
                .map((quiz) => (
                  <div key={quiz._id} className="quiz-item">
                    <div className="card-data">
                      <h3>{quiz.quizName}</h3>
                      <div className="info-container">
                        <p>{quiz.viewCount}</p>
                        <img src={eye} alt="" />
                      </div>
                    </div>

                    <p className="created">
                      Created on:{" "}
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        );
      case "Analytics":
        return <Analytics title={title}/>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="main">
        <div className="sidebar">
          <h1 className="title">QUIZZIE</h1>
          <div className="nav">
            <div
              className={`navlink ${
                activeComponent === "Dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveComponent("Dashboard")}
            >
              Dashboard
            </div>
            <div
              className={`navlink ${
                activeComponent === "Analytics" ? "active" : ""
              }`}
              onClick={() => setActiveComponent("Analytics")}
            >
              Analytics
            </div>
            <div className="navlink" onClick={openModal}>
              Create Quiz
            </div>
          </div>
          <span className="span-line"></span>
          <div className="logout" onClick={handleLogout}>
            LOGOUT
          </div>
        </div>
        {renderContent()}
        {isModalOpen && <Modal isOpen={isModalOpen} onClose={closeModal} />}
      </div>
    </>
  );
};

export default Dashboard;
