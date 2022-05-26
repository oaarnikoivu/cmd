import React from "react";
interface TerminalProps {
  onChange: React.ChangeEventHandler;
  value: string;
  hasError: boolean;
  disabled: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  value,
  disabled,
  onChange,
}) => {
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
          disabled={disabled}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: 14,
          }}
          type="text"
          placeholder=""
          value={value}
          onChange={onChange}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
            }
          }}
        />
      </div>
    </div>
  );
};
