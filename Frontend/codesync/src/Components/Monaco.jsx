import React, { useRef, useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { Play } from 'lucide-react';
import { CODE_SNIPPETS } from '../constants';
import { giveResult } from '../Api';

const Monaco = ({ socket, roomId }) => {
  const [value, setValue] = useState(`\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`);
  const [language, setLanguage] = useState("javascript");
  const [Output, setOutput] = useState("press run to execute your code");
  const editorRef = useRef();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    if (CODE_SNIPPETS && CODE_SNIPPETS[newLanguage]) {
      const newCode = CODE_SNIPPETS[newLanguage];
      setValue(newCode);
      
      if (socket && socket.connected) {
        socket.emit("code-change", { roomId, code: newCode });
      }
    }
  };

  const handleCodeChange = (newValue) => {
    setValue(newValue);
    
    if (socket && socket.connected && roomId) {
      socket.emit("code-change", { roomId, code: newValue });
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCodeChange = (data) => {
      if (data && data.code !== undefined) {
        if (!data.roomId || data.roomId === roomId) {
          setValue(data.code);
        }
      }
    };

    const handleIncomingOutputChange = (data) => {
      if (data && data.result !== undefined) {
        setOutput(data.result);
      }
    };
    
    socket.on("code-change", handleIncomingCodeChange);
    socket.on("output-change", handleIncomingOutputChange);

    return () => {
      socket.off("code-change", handleIncomingCodeChange);
      socket.off("output-change", handleIncomingOutputChange);
    };
  }, [socket, roomId]);

  const handleOutput = async () => {
    if (!value) return;
    
    try {
      const { run: result } = await giveResult(language, value);
      setOutput(result);
      
      if (socket && socket.connected && roomId) {
        socket.emit("output-change", { roomId, result });
      }
    } catch (e) {
      const errorMsg = `Error: ${e.message || e}`;
      setOutput(errorMsg);
      
      if (socket && socket.connected && roomId) {
        socket.emit("output-change", { roomId, result: errorMsg });
      }
    }
  }

  const renderOutput = () => {
    if (typeof Output === 'string') {
      return Output;
    }
    
    if (typeof Output === 'object' && Output !== null) {
      if (Output.output) return Output.output;
      if (Output.stdout) return Output.stdout;
      return JSON.stringify(Output, null, 2);
    }
    
    return 'Run your code to see output...';
  };

  return (
    <>
    <div className="flex flex-col">
      <div className='bg-gray-800 w-[1000px] h-10 flex flex-row justify-between'>
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-purple-400"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">csharp</option>
          </select>
        </div>

        <button
          className="mr-2 mt-1 w-20 h-8 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded flex items-center space-x-2 transition-colors"
          onClick={handleOutput}
        >
          <Play className="w-4 h-4" />
          <span>Run</span>
        </button>
      </div>
      
      <div className='w-[1000px] h-96'>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={value}
          onChange={handleCodeChange}
          onMount={onMount}
          language={language}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      
      <div className="h-[185px] w-[1000px] border-t border-gray-700 flex flex-col">
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <h3 className="text-white font-semibold">Output</h3>
        </div>
        <div className="flex-1 bg-gray-900 p-4 overflow-y-auto">
          <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
            {renderOutput()}
          </pre>
        </div>
      </div>
      </div>
    </>
  );
};

export default Monaco;