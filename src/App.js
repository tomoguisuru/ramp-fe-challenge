import { useState } from "react";

import "./styles.css";

function findFlagUrl(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  elems = doc.getElementsByClassName("ref");
  return Array.from(elems)
    .map((el) => el.getAttribute("value"))
    .join("");
}

function FlagForm() {
  const [flagUrlValue, setFlagUrlValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foundUrlValue, setFoundUrlValue] = useState("");
  const [flagValue, setFlagValue] = useState("");

  const onSubmit = async () => {
    setIsLoading(true);
    setFlagUrlValue("");
    setFoundUrlValue("");
    setFlagValue("");

    try {
      let resp = await fetch(flagUrlValue);

      if (!resp.ok) {
        throw Error("Request failed");
      }

      const html = await resp.text();
      const flagUrl = findFlagUrl(html);

      if (!flagUrl || flagUrl.length === 0) {
        throw Error("Unable to find URL from request");
      }

      setFoundUrlValue(flagUrl);

      resp = await fetch(flagUrl);
      const flag = await resp.text();
      setFlagValue(flag);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (event) => {
    setFlagUrlValue(event.target.value);
  };

  return (
    <>
      <div>
        <label>
          <input
            type="text"
            value={flagUrlValue}
            placeholder="Enter url to search for flag..."
            onChange={onChange}
            disabled={isLoading}
          />
        </label>
        <button onClick={onSubmit} disabled={isLoading}>
          Submit
        </button>
      </div>
      {isLoading && <div>Loading URL ...</div>}
      {foundUrlValue && (
        <div>
          <strong>Found URL:</strong>
          <br />
          {foundUrlValue}
        </div>
      )}
      {foundUrlValue && (
        <div>
          <strong>Flag:</strong>
          <br />
          {flagValue}
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>Find the Flag</h1>
      <FlagForm />
    </div>
  );
}
