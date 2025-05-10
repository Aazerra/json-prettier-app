import React, { useState, useEffect } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { format } from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import Toastify from "toastify-js";
import Clipboard from 'clipboard'

import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "./App.css";
import "toastify-js/src/toastify.css";
import Icon from "./components/Icon/Icon";

require("codemirror/mode/javascript/javascript");

let instance;
const GITHUB_REPOSITORY =
  "https://github.com/augusto-jm-amaral/json-prettier-app";

function App(props) {
  const [text, setText] = useState("");

  useEffect(() => {
    const clipboard = new Clipboard(".btnCopy", {
      text: () => text,
    })
    return () => clipboard.destroy()
  }, [text])

  const prettify = (rawText) => {
        try {
          const newText = format(rawText, {
            parser: "json",
            printWidth: 0,
            trailingComma: "all",
            plugins: [parserBabel],
          });

          instance.setValue(newText);
        } catch (e) {
          console.error(e);

          Toastify({
            text: "Invalid JSON",
            duration: 3000,
            newWindow: true,
            gravity: "top",
            position: "right",
            backgroundColor:
              "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            stopOnFocus: true,
          }).showToast();
        }
    }
  const handlePaste = (editor, event) => {
      event.preventDefault(); // prevent default paste
      const pastedText = event.clipboardData.getData("text");
      prettify(pastedText)
  }

  return (
    <div className="wrapper">
      <CodeMirror
        editorDidMount={(editor) => {
          instance = editor;
          instance.on("paste", handlePaste)
        }}
        onChange={(editor, data, value) => {
          setText(value);
        }}
        className="CodeMirror"
        options={{
          mode: { name: "javascript", json: true },
          theme: "dracula",
          lineNumbers: true,
          viewportMargin: Infinity,
        }}
      />
      <div className="iconsContainer">
        <a href={GITHUB_REPOSITORY} target="_blanck">
          <Icon icon={["fab", "github"]} size="lg" color="#fff" />
        </a>
      </div>
      <div className="button-container">
        <a 
          href
          className='btn btnCopy'
          onClick={() => {
            Toastify({
              text: "Copied",
              duration: 3000,
              newWindow: true,
              gravity: "top",
              position: 'right',
              backgroundColor: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
              stopOnFocus: true,
            }).showToast();
          }}>
          <span>Copy</span>
        </a>
        <a
          href
          className="btn"
          onClick={() => prettify(text)}
        >
          <span>Prettify</span>
        </a>
      </div>
    </div >
  );
}

export default App;
