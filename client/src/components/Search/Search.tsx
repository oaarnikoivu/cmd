import React, { useEffect, useState } from "react";
import styles from "./Search.module.css";
import { Search as SearchIcon, Save } from "lucide-react";

export const Search: React.FC = () => {
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [command, setCommand] = useState<string>("");

  useEffect(() => {
    if (command.length > 0) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  }, [command]);

  return (
    <div className={styles.search}>
      <input
        className={styles.input}
        autoFocus
        type="text"
        placeholder="Search..."
        value={command}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCommand(event.target.value);
        }}
      />
      <div className={styles.icons}>
        <div
          className={styles.icon}
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            setCommand("");
          }}
        >
          {showIcon ? <SearchIcon size={14} /> : undefined}
        </div>
        <div
          className={styles.icon}
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();

            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ command: command }),
            };

            console.log(requestOptions);

            fetch("http://127.0.0.1:8002/commands/", requestOptions)
              .then((response: Response) => response.json())
              .then(() => console.log("Success!"));

            setCommand("");
          }}
        >
          {showIcon ? <Save size={14} /> : undefined}
        </div>
      </div>
    </div>
  );
};
