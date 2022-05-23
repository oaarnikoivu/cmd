import React, { useState } from "react";
import { Terminal } from "./components/Terminal/Terminal";
import { Keywords } from "./utils/keywords";

function App() {
  const [input, setInput] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const splits = input.split(" ").map((item) => item.trim());
      switch (splits.at(0)) {
        case Keywords.MKDIR:
          const directoryTitle = splits.slice(1).join();

          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: directoryTitle }),
          };

          fetch("http://127.0.0.1:8002/dirs/", requestOptions)
            .then((response: Response) => response.json())
            .then(() => console.log("Success!"));

          break;

        case Keywords.LS:
          if (splits.join("").trim() === Keywords.LS) {
            const requestOptions = {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            };

            fetch("http://127.0.0.1:8002/dirs/", requestOptions).then(
              (response) => response.json().then((data) => console.log(data))
            );
          }

          break;
      }
    }
  };

  return (
    <div style={{ marginLeft: "20px", marginTop: "20px" }}>
      <Terminal onKeyPress={handlePressEnter} onChange={handleInputChange} />
    </div>
  );
}

export default App;
