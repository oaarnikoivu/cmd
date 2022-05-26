import React, { useEffect, useState } from "react";
import { Terminal } from "./components/Terminal/Terminal";
import { useKeyPress } from "./hooks/useKeyPress";

interface Input {
  line: number;
  disabled: boolean;
  text: string;
}

function App() {
  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const enterPressed = useKeyPress("Enter");
  const [index, setIndex] = useState<number>(0);
  const [input, setInput] = useState<Input[]>([
    { line: 0, disabled: false, text: "" },
  ]);

  useEffect(() => {
    let prevLine: number = 0;

    if (enterPressed) {
      setInput((input: Input[]) =>
        input.map((item: Input, i: number) => {
          if (i === input.length - 1) {
            prevLine = item.line;
            item.disabled = true;
          }
          return item;
        })
      );
      setInput((old: Input[]) => [
        ...old,
        { line: prevLine + 1, disabled: false, text: "" },
      ]);
      setIndex((i: number) => i + 1);
    }
  }, [enterPressed]);

  useEffect(() => {
    if (index > 0 && arrowUpPressed) {
      setIndex((i) => i - 1);
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (index < input.length - 1 && arrowDownPressed) {
      setIndex((i) => i + 1);
    }
  }, [arrowDownPressed]);

  useEffect(() => {
    try {
      setInput((input: Input[]) =>
        input.map((item: Input, i: number) => {
          if (i === input.length - 1) {
            item.text = input[index].text;
          }
          return item;
        })
      );
    } catch (err) {
      console.log(err);
    }
  }, [index, input.length]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let newInput = [...input];
    newInput[newInput.length - 1].text = event.target.value;
    setInput(newInput);
  };

  return (
    <div style={{ marginLeft: "20px", marginTop: "20px" }}>
      {input.map((item) => {
        return (
          <Terminal
            key={item.line}
            value={item.text}
            disabled={item.disabled}
            onChange={handleInputChange}
          />
        );
      })}
    </div>
  );
}

export default App;
