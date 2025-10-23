import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function parseBullets(aiText) {
  return aiText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim());
}

export default function NotesPage({ mongoUserId, isDark }) {
  const location = useLocation();
  const navigate = useNavigate();
  const aiText = location.state?.aiText || '';
  const notes = parseBullets(aiText);

  const [saveStatus, setSaveStatus] = useState('');
  const notesRef = useRef();

  // ✅ Save notes to Supabase dashboard
  const handleSaveToDashboard = async () => {
    const title = prompt('Enter a title for these notes:', 'Untitled Notes');
    if (!title) return;

    setSaveStatus('Saving...');
    try {
      const filename = `notes-${Date.now()}.txt`;
      const fileBlob = new Blob([aiText], { type: 'text/plain' });

      const { error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(filename, fileBlob, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('notes-files')
        .getPublicUrl(filename);

      const fileUrl = urlData?.publicUrl;
      if (!fileUrl) throw new Error('Could not get file URL from Supabase.');

      const metadata = {
        title,
        fileUrl,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(`${backendUrl}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(metadata),
      });

      if (!res.ok) throw new Error('Backend error saving metadata.');
      setSaveStatus('✅ Saved to dashboard!');
    } catch (err) {
      console.error(err);
      setSaveStatus('❌ Could not save, try again.');
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-gray-950 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-white to-coral-50'
      } flex flex-col items-center px-4 py-14`}
    >
      <div
        className={`max-w-2xl w-full rounded-2xl shadow-2xl p-8 border flex flex-col items-center ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
        }`}
      >
        <button
          onClick={() => navigate(-1)}
          className={`self-start mb-4 font-medium ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}
        >
          ← Back
        </button>

        <h1
          className={`text-3xl font-bold mb-6 text-center ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          📓 Short Notes
        </h1>

        <div ref={notesRef} id="notes-output" className="w-full">
          {notes.length > 0 ? (
            <ul className="w-full" style={{ paddingLeft: 0 }}>
              {notes.map((note, idx) => (
                <li
                  key={idx}
                  className={`mb-4 rounded-lg p-4 flex items-start ${
                    isDark
                      ? 'bg-gray-800 text-gray-200 shadow-sm'
                      : 'bg-blue-50 text-blue-800 shadow-md'
                  }`}
                >
                  <span
                    className={`mr-4 font-bold text-2xl ${
                      isDark ? 'text-blue-300' : 'text-blue-500'
                    }`}
                  >
                    •
                  </span>
                  <span className="flex-1">{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#64748b' }}>No notes available.</p>
          )}
        </div>

        {notes.length > 0 && (
          <>
            <button
              className={`mt-8 px-6 py-2 rounded font-medium shadow ${
                isDark ? 'bg-green-600 text-white' : 'bg-green-600 text-white'
              }`}
              onClick={handleSaveToDashboard}
            >
              Save to Dashboard
            </button>

            {saveStatus && (
              <div
                className="mt-4 font-medium text-center"
                style={{
                  color: saveStatus.startsWith('✅') ? '#22c55e' : '#b91c1c',
                }}
              >
                {saveStatus}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
