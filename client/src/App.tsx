import React, { useEffect, useState } from "react";
import { Terminal } from "./components/Terminal/Terminal";
import { useKeyPress } from "./hooks/useKeyPress";

interface Input {
  disabled: boolean;
  text: string;
}

function App() {
  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const enterPressed = useKeyPress("Enter");
  const [index, setIndex] = useState<number>(0);
  const [input, setInput] = useState<Input[]>([{ disabled: false, text: "" }]);

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
      setInput((old: Input[]) => [...old, { disabled: false, text: "" }]);
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

  return (
    <div style={{ marginLeft: "20px", marginTop: "20px" }}>
      {input.map((item, i) => {
        return (
          <Terminal
            key={i}
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
