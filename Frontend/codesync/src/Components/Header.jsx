// Header.js
import React from "react";
import { Copy, Users } from "lucide-react";

const Header = ({ roomId, connectedUsers, onLeaveRoom }) => {
  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      alert("Room ID copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy Room ID.");
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white">CodeSync</h1>
        <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
          <span className="text-gray-300 text-sm">Room ID:</span>
          <span className="text-white font-mono font-semibold">{roomId}</span>
          <button
            className="text-gray-400 hover:text-white transition-colors"
            title="Copy Room ID"
            onClick={handleCopyRoomId}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">{connectedUsers.length} online</span>
        </div>
        <button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={onLeaveRoom}
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default Header;
