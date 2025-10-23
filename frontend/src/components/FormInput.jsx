import React from "react";

export default function FormInput({ label, type="text", name, value, onChange, placeholder }) {
  return (
    <div className="form-group">
      {label && <label style={{display:"block", marginBottom:6}}>{label}</label>}
      <input
        className="input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
