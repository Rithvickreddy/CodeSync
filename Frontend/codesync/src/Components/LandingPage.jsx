// LandingPage.js
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Code, Video, Zap } from "lucide-react";

const generateParticles = () =>
  Array.from({ length: 10 }, (_, i) => {
    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;
    const size = `${Math.random() * 4 + 2}px`;
    const delay = `${Math.random() * 2}s`;
    const duration = `${Math.random() * 3 + 2}s`;

    return (
      <div
        key={i}
        className="absolute bg-white opacity-10 rounded-full animate-pulse"
        style={{
          left,
          top,
          width: size,
          height: size,
          animationDelay: delay,
          animationDuration: duration,
        }}
      />
    );
  });

const LandingPage = () => {
  const particles = useMemo(() => generateParticles(), []);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const HandleCreateRoom = () => {
    const newRoomId = uuidv4();
    navigate(`/editor/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) return;
    navigate(`/editor/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {particles}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Sync</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Real-time code collaboration platform for interviews, teaching, and pair programming
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard Icon={Code} title="Real-time Coding" description="Collaborate on code with instant synchronization and live cursor tracking" color="text-cyan-400" />
            <FeatureCard Icon={Video} title="Video Calling" description="High-quality video calls perfect for interviews and teaching sessions" color="text-purple-400" />
            <FeatureCard Icon={Zap} title="Live Compiler" description="Run and test code instantly with our integrated compiler and debugger" color="text-yellow-400" />
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full mt-10 mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Get Started</h2>
            <div className="space-y-6">
              <button
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={HandleCreateRoom}
              >
                Create New Room
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">or</span>
                </div>
              </div>

              <input
                type="text"
                placeholder="Enter room id"
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
              />
              <button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={handleJoinRoom}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ Icon, title, description, color }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
    <Icon className={`w-12 h-12 ${color} mb-4 mx-auto`} />
    <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

export default LandingPage;
