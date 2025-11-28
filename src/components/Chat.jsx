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

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Scroll bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch chat history
  const fetchChatMessages = async () => {
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
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  // Init socket once
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    // Receive message
    socket.on("messageReceived", (msg) => {
      const cleanMsg = {
        userId: msg.userId || msg.senderId?._id,
        firstName: msg.firstName || msg.senderId?.firstName,
        lastName: msg.lastName || msg.senderId?.lastName,
        text: msg.text,
        createdAt: msg.createdAt || new Date().toISOString(),
      };

      // Prevent duplicate for sender
      if (cleanMsg.userId === userId) return;

      setMessages((prev) => [...prev, cleanMsg]);
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  // Send message
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

    // Add locally
    setMessages((prev) => [...prev, msg]);

    // Emit to socket
    socketRef.current.emit("sendMessage", msg);

    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6">
      <div className="w-full max-w-3xl mx-auto border border-neutral-700 rounded-xl overflow-hidden shadow-xl bg-neutral-900/40 backdrop-blur-xl">
        {/* Header */}
        <h1 className="p-5 border-b border-neutral-700 text-lg font-semibold bg-neutral-900/40">
          Chat
        </h1>

        {/* Messages */}
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
                  <span className="ml-2 opacity-70 text-[10px]">
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

        {/* Input */}
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
