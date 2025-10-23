import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Parse strict QX./A)/B)/C)/D)/Answer: format
function parseQuiz(aiText) {
  if (!aiText) return [];
  const qArr = aiText.split(/(?:^|\n)Q\d+\./g).filter(Boolean);
  return qArr
    .map(rawQ => {
      const lines = rawQ.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 5) return null;
      const question = lines[0];
      const options = [];
      for (let i = 1; i <= 4; i++) {
        const optLine = lines[i];
        if (optLine && /^[A-D]\)/.test(optLine)) {
          options.push(optLine.replace(/^[A-D]\)\s*/, '').trim());
        }
      }
      const ansLine = lines.find(l => /^Answer:/i.test(l));
      let answer = null;
      if (ansLine) {
        const match = ansLine.match(/Answer:\s*([A-D])/i);
        if (match) answer = match[1].toUpperCase();
      }
      return options.length === 4 && question
        ? { question, options, answer }
        : null;
    })
    .filter(Boolean);
}

export default function QuizPage({ isDark }) {
  const location = useLocation();
  const navigate = useNavigate();
  const aiText = location.state?.aiText || '';
  const questions = parseQuiz(aiText);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');

  if (!questions.length)
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gradient-to-b from-gray-950 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-coral-50'
      } flex flex-col items-center px-4 py-14`}>
        <div className={`p-6 max-w-3xl w-full rounded-2xl shadow-2xl flex flex-col items-center ${
          isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
        }`}>
          <button onClick={() => navigate(-1)} className={`mb-4 hover:underline font-medium ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}>
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-6">Quiz</h1>
          <p>No quiz found or quiz format error.</p>
          <pre className={`text-left text-xs p-2 mt-4 rounded ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>{aiText}</pre>
        </div>
      </div>
    );

  function handleSelect(optIdx) {
    const q = questions[currentIndex];
    setUserAnswers([...userAnswers, optIdx]);
    if (q.answer && optIdx === q.answer.charCodeAt(0) - 65) {
      setScore(s => s + 1);
    }
    if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
    else setShowResult(true);
  }

  function restartQuiz() {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswers([]);
    setShowResult(false);
  }

  async function handleSaveToDashboard() {
    const title = prompt('Enter a title for this quiz:', 'Untitled Quiz');
    if (!title) return;
    try {
      const { error } = await supabase.from('items').insert({
        title,
        type: 'quiz',
        content: aiText,
      });
      if (error) throw error;
      setSaveStatus('✅ Saved to dashboard!');
    } catch (err) {
      console.error(err);
      setSaveStatus('❌ Could not save, try again.');
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-b from-gray-950 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-coral-50'
    } flex flex-col items-center px-4 py-14`}>
      <div className={`max-w-2xl w-full rounded-2xl shadow-2xl p-8 border ${
        isDark ? 'bg-gray-900 border-gray-800 text-gray-100' : 'bg-white border-gray-100 text-gray-900'
      } flex flex-col items-center`}>
        <button onClick={() => navigate(-1)} className={`self-start mb-4 hover:underline font-medium ${
          isDark ? 'text-blue-300' : 'text-blue-600'
        }`}>
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center">
          🎯 Quiz
        </h1>

        {showResult ? (
          <div className={`w-full max-w-lg rounded-xl p-8 ${
            isDark ? 'bg-gray-800' : 'bg-blue-50'
          } shadow-md text-center`}>
            <h2 className={`text-2xl mb-2 font-bold ${
              isDark ? 'text-green-300' : 'text-green-700'
            }`}>Quiz completed!</h2>
            <p className={`font-bold mb-4 ${
              isDark ? 'text-blue-200' : 'text-blue-800'
            }`}>
              Your score: {score} / {questions.length}
            </p>
            <button
              className={`mt-3 px-4 py-2 rounded ${
                isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
              } font-medium hover:bg-blue-700 transition`}
              onClick={restartQuiz}
            >
              Retry Quiz
            </button>

            <button
              className={`mt-5 px-4 py-2 rounded ${
                isDark ? 'bg-green-600 text-white' : 'bg-green-600 text-white'
              } font-medium hover:bg-green-700 transition`}
              onClick={handleSaveToDashboard}
            >
              Save to Dashboard
            </button>

            {saveStatus && (
              <div className="mt-4 font-medium text-center text-sm"
                style={{ color: saveStatus.startsWith('✅') ? '#22c55e' : '#b91c1c' }}>
                {saveStatus}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-lg rounded-xl shadow-md p-8 bg-blue-50">
            <div className="mb-6 font-semibold text-lg text-blue-900">
              Q{currentIndex + 1}. {questions[currentIndex]?.question}
            </div>
            <div className="flex flex-col gap-5">
              {questions[currentIndex]?.options.map((opt, idx) => (
                <button
                  className={`border-2 border-blue-200 rounded-lg px-4 py-3 text-left transition text-lg shadow-sm ${
                    isDark
                      ? 'bg-gray-800 text-gray-200 hover:bg-blue-700 border-gray-700'
                      : 'bg-white text-blue-900 hover:bg-blue-200 border-blue-200'
                  }`}
                  key={idx}
                  onClick={() => handleSelect(idx)}
                >
                  <span className="mr-2 font-bold text-blue-400">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-8 text-sm text-gray-400 text-right">
              {currentIndex + 1} / {questions.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
