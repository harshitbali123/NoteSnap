import React from "react";

export default function AuthCard({ children, title }) {
  return (
    <div className="center">
      <div className="card" role="region" aria-label={title}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
