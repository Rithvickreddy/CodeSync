import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';

const VideoCall = ({ socket, roomId }) => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const peerRef = useRef();

  useEffect(() => {
    if (!socket) return;

    navigator.mediaDevices
      .getUserMedia({ 
        video: true, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        const handleUserJoined = (signal) => {
          setReceivingCall(true);
          setCallerSignal(signal);
        };

        const handleCallAccepted = (signal) => {
          setCallAccepted(true);
          if (peerRef.current) {
            peerRef.current.signal(signal);
          }
        };

        const handleCallEnded = () => {
          setCallEnded(true);
          if (peerRef.current) {
            peerRef.current.destroy();
          }
        };

        socket.on("user-joined", handleUserJoined);
        socket.on("call-accepted", handleCallAccepted);
        socket.on("call-ended", handleCallEnded);

        return () => {
          socket.off("user-joined", handleUserJoined);
          socket.off("call-accepted", handleCallAccepted);
          socket.off("call-ended", handleCallEnded);
        };
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
      });

    return () => {
      if (socket) {
        socket.off("user-joined");
        socket.off("call-accepted");
        socket.off("call-ended");
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [socket]);

  const callUser = () => {
    if (!stream || !socket) return;

    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on("signal", (data) => {
      socket.emit("call-user", { roomId, signalData: data });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
        userVideo.current.play().catch(console.error);
      }
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    peerRef.current = peer;
  };

  const acceptCall = () => {
    if (!stream || !socket || !callerSignal) return;

    setCallAccepted(true);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on("signal", (data) => {
      socket.emit("accept-call", { roomId, signalData: data });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
        userVideo.current.play().catch(console.error);
      }
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    peer.signal(callerSignal);
    peerRef.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    socket.emit("call-ended", { roomId });
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  };

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-4 bg-slate-800 p-4 rounded-lg">
      <div className="flex gap-4">
        <div className="flex flex-col">
          <h3 className="text-white text-sm mb-2">You</h3>
          <video 
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="w-80 h-60 bg-black rounded-lg object-cover"
          />
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-white text-sm mb-2">Remote</h3>
          <video 
            playsInline
            ref={userVideo}
            autoPlay
            className="w-80 h-60 bg-black rounded-lg object-cover"
          />
        </div>
      </div>
      
      <div className="flex gap-2 justify-center">
        {!callAccepted && stream && !callEnded && (
          <button 
            onClick={callUser} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📞 Start Call
          </button>
        )}
        
        {receivingCall && !callAccepted && (
          <button 
            onClick={acceptCall} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📞 Accept Call
          </button>
        )}
        
        {callAccepted && !callEnded && (
          <>
            <button 
              onClick={toggleAudio} 
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🎤 Toggle Audio
            </button>
            
            <button 
              onClick={toggleVideo} 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📹 Toggle Video
            </button>
            
            <button 
              onClick={endCall} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📴 End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCall;