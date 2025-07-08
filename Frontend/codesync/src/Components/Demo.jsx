
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

//const socket = io("http://localhost:5000");

function Demo() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [code, setCode] = useState("");
  const editorRef = useRef(null);

  const joinRoom = () => {
    if (!roomId) return;
    socket.emit("join-room", roomId);
    setJoined(true);
  };

  useEffect(() => {
    if (!joined) return;

    socket.on("code-change", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-change");
    };
  }, [joined]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    socket.emit("code-change", { roomId, code: newCode });
  };

  return (
    <div style={{ padding: "2rem" }}>
      {!joined ? (
        <>
          <input
            placeholder="Enter Room ID or Generate New"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ padding: "0.5rem", width: "60%" }}
          />
          <button
            onClick={() => setRoomId(uuidv4())}
            style={{ margin: "0 1rem" }}
          >
            Generate
          </button>
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <>
          <h3>Room ID: {roomId}</h3>
          <textarea
            ref={editorRef}
            value={code}
            onChange={handleCodeChange}
            style={{ width: "100%", height: "300px", marginTop: "1rem" }}
          ></textarea>
        </>
      )}
    </div>
  );
}

export default Demo;
