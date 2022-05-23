import React, { useEffect, useState } from "react";

export const Terminal = () => {
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (input.includes("mkdir ")) {
      console.log("highlight");
    }
  }, [input]);

  const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const splits = input.split(" ").map((item) => item.trim());
      switch (splits.at(0)) {
        case "mkdir":
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

        case "ls":
          if (splits.join("").trim() === "ls") {
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInput(event.target.value);
          }}
          onKeyPress={handlePressEnter}
        />
      </div>
    </div>
  );
};
