import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function UploadPage({ isDark, setIsDark }) {
  const [selectedTab, setSelectedTab] = useState('image');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [createOption, setCreateOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSelectedFile(null);
    setErrorMessage('');
    setCreateOption(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setErrorMessage('');
    setCreateOption(null);
  };

  const triggerInput = () => {
    inputRef.current.click();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !createOption) {
      setErrorMessage('Please select a file and an action.');
      return;
    }
    setUploading(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('myfile', selectedFile);
    formData.append('action', createOption);

    try {
      const res = await fetch(`${backendUrl}/file/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      if (data.aiText) {
        if (createOption === 'notes') {
          navigate('/notes', { state: { aiText: data.aiText } });
        } else if (createOption === 'quiz') {
          navigate('/quiz', { state: { aiText: data.aiText } });
        } else {
          setErrorMessage('Invalid option selected.');
        }
      } else if (data.message) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage('Upload successful, but no AI output received.');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
    setUploading(false);
  };

  const handleNotesClick = () => setCreateOption('notes');
  const handleQuizClick = () => setCreateOption('quiz');
  const handleBack = () => setCreateOption(null);

  return (
    <>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-b from-gray-950 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-coral-50'} flex flex-col items-center px-4 py-14`}>
      <div className={`max-w-xl w-full ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} rounded-2xl shadow-2xl p-8 flex flex-col items-center`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'} text-center`}>Upload or Paste Content</h2>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-center mb-6`}>
          Upload your content then select what you want to do with it.
        </p>
        <div className="flex space-x-3 mb-6">
          <button
            className={`px-6 py-3 rounded-lg font-medium transition shadow ${
              selectedTab === 'image'
                ? 'bg-blue-600 text-white shadow-lg'
                : `${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`
            }`}
            onClick={() => handleTabChange('image')}
            type="button"
          >
            Image
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition shadow ${
              selectedTab === 'document'
                ? 'bg-blue-600 text-white shadow-lg'
                : `${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`
            }`}
            onClick={() => handleTabChange('document')}
            type="button"
          >
            Document
          </button>
        </div>
        <div
          className={`w-full h-56 ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-blue-50 border-blue-200 text-gray-500'} border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${isDark ? 'dark:hover:bg-gray-700' : 'hover:bg-blue-100'} mb-4`}
          onClick={triggerInput}
        >
          <input
            ref={inputRef}
            type="file"
            accept={selectedTab === 'image' ? 'image/*' : '.pdf,.docx,.txt,.doc'}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {selectedFile ? (
            <span className="font-semibold text-blue-700">{selectedFile.name}</span>
          ) : (
            <span>Drag a {selectedTab} here or click to upload</span>
          )}
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-center items-stretch gap-8 mt-2">
          <div
            className={`p-8 flex-1 transition cursor-pointer flex flex-col justify-center items-center rounded-2xl ${isDark ? 'bg-gray-900 shadow-md' : 'bg-gray-50 shadow-md'} ${createOption === 'notes' ? 'border-2 border-blue-500' : 'hover:shadow-lg'}`}
            onClick={handleNotesClick}
          >
            <i className="bi bi-file-earmark-fill text-6xl text-blue-600 mb-2"></i>
            <h2 className={`text-xl font-semibold mb-2 text-center ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Create Short Notes</h2>
            <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
              Quickly turn your ideas or uploaded text into well-structured summaries using AI.
            </p>
          </div>
          <div
            className={`p-8 flex-1 transition cursor-pointer flex flex-col justify-center items-center rounded-2xl ${isDark ? 'bg-gray-900 shadow-md' : 'bg-gray-50 shadow-md'} ${createOption === 'quiz' ? 'border-2 border-blue-500' : 'hover:shadow-lg'}`}
            onClick={handleQuizClick}
          >
            <i className="bi bi-mortarboard-fill text-6xl text-blue-600 mb-2"></i>
            <h2 className={`text-xl font-semibold mb-2 text-center ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Generate Quiz</h2>
            <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
              Upload a document and let AI generate interactive quiz questions from it instantly.
            </p>
          </div>
        </div>
        <form onSubmit={handleUpload} className="w-full flex flex-col items-center">
          <button
            className={`mt-10 px-6 py-3 rounded-lg font-medium shadow ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-900'} active:bg-blue-600 transition hover:bg-blue-700 hover:text-white`}
            type="submit"
            disabled={!selectedFile || !createOption || uploading}
          >
            {uploading
              ? 'Uploading...'
              : createOption === 'notes'
              ? 'Upload for Notes'
              : createOption === 'quiz'
              ? 'Upload for Quiz'
              : 'Upload'}
          </button>
          {createOption && (
            <button
              type="button"
              onClick={handleBack}
              className="mt-2 text-blue-600 font-medium hover:underline"
            >
              ← Back
            </button>
          )}
        </form>
        {errorMessage && (
          <div className="mt-4 text-red-600 font-semibold">{errorMessage}</div>
        )}
      </div>
      </div>
    </>
  );
}
