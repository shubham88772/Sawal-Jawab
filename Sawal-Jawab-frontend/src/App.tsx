import React, { useState } from 'react';
import { Header } from './components/Header';
import { QuestionForm } from './components/QuestionForm';
import { Question } from './components/Question';

import 'tailwindcss/tailwind.css';
import { SideMenu } from './components/SideMenu';
import { Footer } from './components/Footer';
import { NoResults } from './components/NoResults';

interface User {
  username: string;
  email: string;
}

interface Answer {
  id: number;
  text: string;
  votes: number;
  author: string;
  timestamp: string;
}

interface QuestionData {
  id: number;
  text: string;
  answers: Answer[];
  votes: number;
  author: string;
  timestamp: string;
}

export default function App() {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [showAnswerInput, setShowAnswerInput] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [registerError, setRegisterError] = useState<string>('');
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionData[]>([]);

  const handleLogin = () => {
    setLoginError('');
    if (!loginData.email || !loginData.password) {
      setLoginError('Please fill in all fields');
      return;
    }
    setCurrentUser({
      username: loginData.email.split('@')[0],
      email: loginData.email,
    });
    setShowLoginModal(false);
    setLoginData({ email: '', password: '' });
  };

  const handleRegister = () => {
    setRegisterError('');
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password
    ) {
      setRegisterError('Please fill in all fields');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    setCurrentUser({
      username: registerData.username,
      email: registerData.email,
    });
    setShowRegisterModal(false);
    setRegisterData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const filterQuestions = (filter: string) => {
    switch (filter) {
      case 'my':
        if (currentUser) {
          setFilteredQuestions(
            questions.filter(q => q.author === currentUser.username)
          );
        }
        break;
      case 'voted':
        setFilteredQuestions(
          [...questions].sort((a, b) => b.votes - a.votes)
        );
        break;
      default:
        setFilteredQuestions(questions);
    }
  };

  const filterTrendingQuestions = (filter: string) => {
    // query the trending questions and set to Questions.
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log('Button clicked with param:', filter, event);
    };
  }

  const addQuestion = () => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    if (newQuestion.trim()) {
      const question: QuestionData = {
        id: Date.now(),
        text: newQuestion,
        answers: [],
        votes: 0,
        author: currentUser.username,
        timestamp: new Date().toLocaleString(),
      };
      setQuestions([question, ...questions]);
      setNewQuestion('');
    }
  };

  const addAnswer = (questionId: number, answerText: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    if (answerText.trim()) {
      setQuestions(
        questions.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              answers: [
                ...q.answers,
                {
                  id: Date.now(),
                  text: answerText,
                  votes: 0,
                  author: currentUser.username,
                  timestamp: new Date().toLocaleString(),
                },
              ],
            };
          }
          return q;
        })
      );
      setShowAnswerInput({ ...showAnswerInput, [questionId]: false });
    }
  };

  const handleVote = (questionId: number, answerId: number | null = null) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          if (answerId === null) {
            return { ...q, votes: q.votes + 1 };
          }
          return {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, votes: a.votes + 1 } : a
            ),
          };
        }
        return q;
      })
    );
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gray-100 pt-8 pb-4 px-8">
        <Header
          currentUser={currentUser}
          handleLogout={handleLogout}
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          showRegisterModal={showRegisterModal}
          setShowRegisterModal={setShowRegisterModal}
          loginData={loginData}
          setLoginData={setLoginData}
          registerData={registerData}
          setRegisterData={setRegisterData}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          loginError={loginError}
          registerError={registerError}
        />
      </div>
      <div className="flex my-4">
        {/* Side Menu */}
        <SideMenu
          currentUser={currentUser}
          handleLogout={handleLogout}
          filterQuestions={filterQuestions}
          filterTrendingQuestions={filterTrendingQuestions}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 w-full space-y-6 overflow-y-auto flex-1">
          {/* <main className="flex-1 max-w-3xl w-full mx-auto py-4 space-y-6 overflow-y-auto"> */}

          <QuestionForm
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
            addQuestion={addQuestion}
          />

          <div className="space-y-4">
            {(filteredQuestions.length > 0 ? filteredQuestions : questions).map((question) => (
              <Question
                key={question.id}
                question={question}
                handleVote={handleVote}
                showAnswerInput={showAnswerInput}
                setShowAnswerInput={setShowAnswerInput}
                addAnswer={addAnswer}
              />
            ))}
          </div>

          {filteredQuestions.length == 0 && questions.length == 0 && <div className='space-y-4'><NoResults /></div>}

        </main>
      </div>
      <Footer />
    </div>
  );
}
