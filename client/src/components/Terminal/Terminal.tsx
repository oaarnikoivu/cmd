import React from "react";
import { Dropdown } from "../Dropdown/Dropdown";
interface TerminalProps {
  onChange: React.ChangeEventHandler;
  value: string;
  hasError: boolean;
  disabled: boolean;
  showDropdown?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  value,
  disabled,
  showDropdown,
  onChange,
}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "4px",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ fontSize: 14, color: "black", fontWeight: "bold" }}>
          home :{" "}
        </div>
        <div style={{ width: "80%" }}>
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
      <div>{showDropdown ? <Dropdown /> : undefined}</div>
    </div>
  );
};
