// Editor.js
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Monaco from "./Monaco";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import VideoCall from "./VideoCall";

const Editor = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketConnection = io("http://localhost:5000");
    setSocket(socketConnection);

    socketConnection.emit("join-room", { roomId });

    socketConnection.on("user-list", (users) => {
      console.log("Users in room:", users);
      setConnectedUsers(users);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [roomId]);

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
    }
    navigate("/");
  };

  return (
    <>
      <Header roomId={roomId} connectedUsers={connectedUsers} onLeaveRoom={handleLeaveRoom} />
      <div className="flex">
      <Monaco socket={socket} roomId={roomId} />
      <VideoCall socket={socket} roomId={roomId}/>
      </div>
      
    </>
  );
};

export default Editor;
