import React from "react";
// Navbar is provided globally by App
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GroupImage from "../assets/Group 1000007251.png";

export default function Home({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  function goGetStarted() {
    if (user) navigate('/upload');
    else navigate('/signup');
  }

  return (
    <>
      <div className={`min-h-screen transition-colors duration-300 ${isDark
        ? 'bg-gradient-to-b from-gray-950 to-gray-900'
        : 'bg-gradient-to-b from-gray-50 to-white'
      }`}>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-left flex flex-col items-start">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Enhance your notes and documents with the power of AI
              </h1>
              <p className={`text-lg md:text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Save valuable hours and enhance your productivity in note-taking and document editing with our suite of AI-enhanced tools.
              </p>
              <div className="space-y-4">
                <button
                  onClick={goGetStarted}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition duration-200 shadow-lg hover:shadow-xl"
                >
                  Get started for free
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center h-full">
              <img
                src={GroupImage}
                alt="Group AI Notes"
                className="rounded-2xl shadow-2xl w-full max-w-3xl h-auto"
                style={{ background: isDark ? "#18181b" : "#f3f4f6", minHeight: "400px", objectFit: "contain" }}
              />
            </div>
          </div>
        </section>

        {/* Features Section - Center features and add hover effect */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Powerful AI Tools at Your Fingertips
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to create, organize, and enhance your content
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Feature 1 */}
            <div className={`group ${isDark ? 'bg-gray-900' : 'bg-white'} p-8 rounded-2xl shadow-lg hover:shadow-xl transition w-full max-w-md 
              hover:bg-blue-600 hover:text-white cursor-pointer duration-200`}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto 
                group-hover:bg-blue-500 duration-200">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-3 text-center group-hover:text-white duration-200 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>AI Note Generator</h3>
              <p className={`text-center group-hover:text-white duration-200 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Transform your ideas into comprehensive notes with AI-powered generation
              </p>
            </div>
            {/* Feature 2 */}
            <div className={`group ${isDark ? 'bg-gray-900' : 'bg-white'} p-8 rounded-2xl shadow-lg hover:shadow-xl transition w-full max-w-md 
              hover:bg-blue-600 hover:text-white cursor-pointer duration-200`}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto 
                group-hover:bg-blue-500 duration-200">
                <svg className="w-6 h-6 text-green-600 group-hover:text-white duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-3 text-center group-hover:text-white duration-200 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Quiz Generator</h3>
              <p className={`text-center group-hover:text-white duration-200 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Generate custom quizzes to test your knowledge and track progress
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 mb-16">
          <div className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center shadow-2xl`}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-white`}>
              Ready to supercharge your learning?
            </h2>
            <p className={`text-xl text-blue-100 mb-8`}>
              Join thousands of students already using Revisely
            </p>
            <button
              onClick={goGetStarted}
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg text-lg hover:bg-gray-50 transition duration-200 shadow-lg"
            >
              Start for free
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
