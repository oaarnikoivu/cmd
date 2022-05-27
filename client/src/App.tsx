import React, { useCallback, useEffect, useState } from "react";
import { Terminal } from "./components/Terminal/Terminal";
import { useKeyPress } from "./hooks/useKeyPress";
import { Keywords } from "./utils/keywords";

interface Input {
  disabled: boolean;
  hasError: boolean;
  dropdown?: boolean;
  text: string;
}

const keywords: string[] = Object.values(Keywords);

function App() {
  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const enterPressed = useKeyPress("Enter");
  const [index, setIndex] = useState<number>(0);
  const [input, setInput] = useState<Input[]>([
    { disabled: false, hasError: false, text: "", dropdown: false },
  ]);
  const [clear, setClear] = useState<boolean>(false);

  const removeElements = useCallback(() => {
    if (clear) {
      input.forEach((_, i: number) => {
        let currentDiv = document.getElementById(`id-${i}`);
        if (i !== input.length - 1) {
          currentDiv?.remove();
        } else {
          setInput((input: Input[]) =>
            input.map((item: Input, i: number) => {
              if (i === input.length - 1) {
                item.text = "";
              }
              return item;
            })
          );
        }
      });
    }
    setClear(false);
  }, [clear, input]);

  useEffect(() => {
    removeElements();
  }, [removeElements]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "l") {
        setClear(true);
      }
    };
    window.addEventListener("keydown", handle);
  }, []);

  useEffect(() => {
    if (enterPressed) {
      let currentInput = input[input.length - 1];

      if (currentInput.text === Keywords.CLEAR) {
        setClear(true);
      } else {
        setInput((input: Input[]) =>
          input.map((item: Input, i: number) => {
            if (i === input.length - 1) {
              item.disabled = true;
              item.dropdown = currentInput.text === Keywords.LS;
            }
            return item;
          })
        );
        setInput((old: Input[]) => [
          ...old,
          {
            disabled: false,
            hasError: !keywords.includes(
              old[old.length - 1].text.split(" ")[0]
            ),

            text: "",
          },
        ]);
        setIndex(input.length - 1 + 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterPressed]);

  useEffect(() => {
    if (index > 0 && arrowUpPressed) {
      setIndex((i) => i - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div key={idx} id={`id-${idx}`}>
        <div
          style={{
            fontSize: 14,
            marginTop: 4,
            marginBottom: 4,
            fontWeight: "bold",
            color: "#ea3838",
          }}
        >
          {item.hasError ? `command not found!` : undefined}
        </div>
        <Terminal
          key={idx}
          value={item.text}
          disabled={item.disabled}
          hasError={false}
          onChange={handleInputChange}
          showDropdown={item.dropdown}
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
