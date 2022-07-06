import React, { useCallback, useEffect, useState } from "react";
import { Terminal } from "./components/Terminal/Terminal";
import { useKeyPress } from "./hooks/useKeyPress";
import { Keywords } from "./utils/keywords";
import "@fontsource/anonymous-pro";

interface Input {
  disabled: boolean;
  hasError: boolean;
  dropdown?: boolean;
  text: string;
  directory: string;
}

const keywords: string[] = Object.values(Keywords);

function App() {
  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const enterPressed = useKeyPress("Enter");
  const [index, setIndex] = useState<number>(0);
  const [input, setInput] = useState<Input[]>([
    {
      disabled: false,
      hasError: false,
      text: "",
      dropdown: false,
      directory: "home",
    },
  ]);
  const [clear, setClear] = useState<boolean>(false);

  // Create root directory if it doesn't exist
  // Else cd root directory on initial render
  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "root" }),
    };

    fetch("http://127.0.0.1:8002/nodes/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setInput((input: Input[]) =>
          input.map((item: Input, i: number) => {
            if (i === input.length - 1) {
              item.directory = data.name;
            }
            return item;
          })
        );
      });
  }, []);

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
            directory:
              currentInput.text.split(" ")[0] === Keywords.CD
                ? currentInput.text.split(" ")[1].replace(/[^a-zA-Z0-9 ]/g, "")
                : old[old.length - 1].directory.replace(/[^a-zA-Z0-9 ]/g, ""),
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
          currentDirectory={item.directory}
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
