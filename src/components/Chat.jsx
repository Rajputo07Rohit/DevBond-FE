import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

export default function Chat() {
  const { targetUserId } = useParams();
  const loggedUser = useSelector((store) => store.user);
  const userId = loggedUser?._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Init socket connection ONCE
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    // RECEIVE message
    socket.on("messageReceived", (msg) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];

        // DUPLICATE FILTER (fixes your bug permanently)
        if (
          last &&
          last.text === msg.text &&
          last.firstName === msg.firstName &&
          last.lastName === msg.lastName
        ) {
          return prev; // ignore duplicate
        }

        return [...prev, msg];
      });
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  // SEND message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      userId, // local sender id
      targetUserId,
      firstName: loggedUser.firstName,
      lastName: loggedUser.lastName,
      text: newMessage,
    };

    // ADD instantly
    setMessages((prev) => [...prev, msg]);

    // EMIT to socket server
    socketRef.current.emit("sendMessage", msg);

    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white p-6">
      <div className="w-full max-w-3xl mx-auto border border-neutral-700 rounded-xl overflow-hidden shadow-xl bg-neutral-900/40 backdrop-blur-xl">
        {/* HEADER */}
        <h1 className="p-5 border-b border-neutral-700 text-lg font-semibold bg-neutral-900/40">
          Chat
        </h1>

        {/* MESSAGES */}
        <div className="flex-1 h-[65vh] overflow-y-scroll p-5 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 opacity-70 mt-10">
              Say Hi 👋 to start the chat
            </p>
          )}

          {messages.map((msg, index) => {
            const isMe =
              msg.userId === userId || msg.firstName === loggedUser.firstName;

            return (
              <div
                key={index}
                className={`chat ${isMe ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-header text-sm text-gray-400">
                  {msg.firstName} {msg.lastName}
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
