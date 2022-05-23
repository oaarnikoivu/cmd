import React from "react";
interface TerminalProps {
  onKeyPress: any;
  onChange: any;
}

export const Terminal: React.FC<TerminalProps> = ({ onKeyPress, onChange }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div>/</div>
      <div style={{ width: "100%" }}>
        <input
          autoFocus
          style={{ border: "none", outline: "none", width: "100%" }}
          type="text"
          placeholder=""
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </div>
    </div>
  );
};
