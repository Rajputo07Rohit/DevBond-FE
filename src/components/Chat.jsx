import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

export default function Chat() {
  const { targetUserId } = useParams();
  const loggedUser = useSelector((store) => store.user);
  const userId = loggedUser?._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format last seen
  const formatLastSeen = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch previous chat
  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const loaded = res.data.messages.map((m) => ({
        userId: m.senderId._id,
        firstName: m.senderId.firstName,
        lastName: m.senderId.lastName,
        text: m.text,
        createdAt: m.createdAt,
      }));

      setMessages(loaded);
    } catch (err) {
      console.log("Error loading chat:", err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  // SOCKET LOGIC (online status + messages)
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    // Join chat room
    socket.emit("joinChat", { userId, targetUserId });

    // Handle online event
    socket.on("userOnline", (id) => {
      if (id === targetUserId) {
        setIsOnline(true);
      }
    });

    // Handle offline event
    socket.on("userOffline", ({ userId: uid, lastSeen }) => {
      if (uid === targetUserId) {
        setIsOnline(false);
        setLastSeen(lastSeen);
      }
    });

    // Receive new message
    socket.on("messageReceived", (msg) => {
      // Clean format
      const cleanMsg = {
        userId: msg.userId,
        firstName: msg.firstName,
        lastName: msg.lastName,
        text: msg.text,
        createdAt: msg.createdAt || new Date().toISOString(),
      };

      // Prevent duplicate if it's our own message
      if (cleanMsg.userId === userId) return;

      setMessages((prev) => [...prev, cleanMsg]);
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  // SEND message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      userId,
      targetUserId,
      firstName: loggedUser.firstName,
      lastName: loggedUser.lastName,
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    // Add instantly in UI
    setMessages((prev) => [...prev, msg]);

    // Emit to server
    socketRef.current.emit("sendMessage", msg);

    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6">
      <div className="w-full max-w-3xl mx-auto border border-neutral-700 rounded-xl overflow-hidden shadow-xl bg-neutral-900/40 backdrop-blur-xl">
        {/* HEADER */}
        <div className="p-5 border-b border-neutral-700 bg-neutral-900/40">
          <div className="text-lg font-semibold">Chat</div>

          {isOnline ? (
            <p className="text-green-400 text-xs mt-1">● Online</p>
          ) : lastSeen ? (
            <p className="text-gray-400 text-xs mt-1">
              Last seen: {formatLastSeen(lastSeen)}
            </p>
          ) : (
            <p className="text-gray-500 text-xs mt-1">Offline</p>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 h-[65vh] overflow-y-scroll p-5 space-y-6">
          {messages.map((msg, index) => {
            const isMe = msg.userId === userId;

            return (
              <div
                key={index}
                className={`chat ${isMe ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-header text-xs text-gray-400 mb-1">
                  {msg.firstName} {msg.lastName}
                  <span className="ml-2 text-[10px] opacity-70">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>

                <div
                  className={
                    "chat-bubble " +
                    (isMe
                      ? "text-white bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-neutral-800 text-gray-200")
                  }
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT BOX */}
        <div className="p-4 border-t border-neutral-700 bg-neutral-900/40 flex items-center gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-neutral-800 border border-neutral-700 text-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
            placeholder="Type a message..."
          />

          <button
            onClick={sendMessage}
            className="btn bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white rounded-xl hover:opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
