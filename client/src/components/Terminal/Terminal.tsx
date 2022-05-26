import React from "react";
interface TerminalProps {
  onChange: React.ChangeEventHandler;
  value: string;
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
          ref={(ref) => ref && ref.focus()}
          autoFocus
          disabled={disabled}
          style={{ border: "none", outline: "none", width: "100%" }}
          type="text"
          placeholder=""
          value={value}
          onChange={onChange}
          onFocus={(e) =>
            e.currentTarget.setSelectionRange(
              e.currentTarget.value.length,
              e.currentTarget.value.length
            )
          }
        />
      </div>
    </div>
  );
};
