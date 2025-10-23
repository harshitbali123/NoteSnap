import React from "react";

export default function Footer() {
  return (
    <footer className="text-center text-gray-500 text-sm py-8 mt-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      © {new Date().getFullYear()} <b>NoteWise</b> — Built to Make Learning Smarter
    </footer>
  );
}
