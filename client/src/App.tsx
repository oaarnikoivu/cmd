import React, { useEffect, useState } from "react";
import { Terminal } from "./components/Terminal/Terminal";
import { useKeyPress } from "./hooks/useKeyPress";

interface Input {
  disabled: boolean;
  hasError: boolean;
  text: string;
}

function App() {
  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const enterPressed = useKeyPress("Enter");
  const [index, setIndex] = useState<number>(0);
  const [input, setInput] = useState<Input[]>([
    { disabled: false, hasError: false, text: "" },
  ]);

  useEffect(() => {
    if (enterPressed) {
      setInput((input: Input[]) =>
        input.map((item: Input, i: number) => {
          if (i === input.length - 1) {
            item.disabled = true;
          }
          return item;
        })
      );
      setInput((old: Input[]) => [
        ...old,
        {
          disabled: false,
          hasError: !old[old.length - 1].text.includes("mkdir"),
          text: "",
        },
      ]);
      setIndex(input.length - 1 + 1);
    }
  }, [enterPressed]);

  useEffect(() => {
    if (index > 0 && arrowUpPressed) {
      setIndex((i) => i - 1);
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      setIndex((i) => i + 1);
    }
  }, [arrowDownPressed]);

  useEffect(() => {
    setInput((input: Input[]) =>
      input.map((item: Input, i: number) => {
        if (i === input.length - 1) {
          try {
            item.text = input[index].text;
          } catch (err) {
            item.text = "";
          }
        }
        return item;
      })
    );
  }, [index]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let newInput = [...input];
    newInput[newInput.length - 1].text = event.target.value;
    setInput(newInput);
  };

  const renderTerminal = (idx: number, item: Input) => {
    return (
      <div>
        <div style={{ fontSize: 14, marginTop: 4, marginBottom: 4 }}>
          {item.hasError ? `command not found!` : undefined}
        </div>
        <Terminal
          key={idx}
          value={item.text}
          disabled={item.disabled}
          hasError={false}
          onChange={handleInputChange}
        />
      </div>
    );
  };

  return (
    <div style={{ marginLeft: "20px", marginTop: "20px" }}>
      {input.map((item, i) => {
        return renderTerminal(i, item);
      })}
    </div>
  );
}

export default App;
