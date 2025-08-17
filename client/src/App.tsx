import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("you are connected id = ", socket.id);
      setSocketId(socket.id as string);
    });

    socket.on("welcome", (msg: string) => {
      console.log(msg);
    });

    socket.on("recieveMsg", (data) => {
      console.log(data.message);
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    setRoom("");
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    socket.emit("joinRoom", roomId);
    setRoomId("");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md w-full max-w-md p-6 flex flex-col gap-4">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Chat App</h1>
          <p className="text-sm text-gray-500">
            Connected as: <span className="font-mono">{socketId}</span>
          </p>
        </div>

        {/* Join Room */}
        <form onSubmit={handleJoin} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter room name..."
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400 outline-none"
          />
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition"
          >
            Join
          </button>
        </form>

        {/* Chat Box */}
        <div className="flex flex-col h-64 bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">No messages yet...</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg self-start"
              >
                {msg}
              </div>
            ))
          )}
        </div>

        {/* Send Message */}
        <form onSubmit={handleSend} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400 outline-none"
          />
          <input
            type="text"
            placeholder="Room/User"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
