import { useState, useRef, useEffect } from "react";
import { useChatBotChatMutation } from "../../redux/api/chatBotApi";
import logo from "../../assets/Images/logo.png";
import { FiSend, FiMessageSquare } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your LMS assistant. How can I help you today?",
    },
  ]);
  const [sendChat, { isLoading }] = useChatBotChatMutation();
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await sendChat({ message: input }).unwrap();
      const botReply = { sender: "bot", text: res.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      const errorMsg =
        err?.data?.error || "Error fetching reply. Please try again.";
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `⚠️ ${errorMsg}` },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <header className="p-4 bg-indigo-600 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="LMS Logo" className="h-8 w-auto" />
            <h1 className="text-white font-semibold text-lg">
              ED MACHINE (Assistant)
            </h1>
          </div>
          <div className="text-indigo-100 text-sm">
            <FiMessageSquare className="inline mr-1" />
            Smart Assistant
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isUser = msg.sender === "user";
              const parts = msg.text.split(/```/g);

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-3 rounded-xl max-w-[85%] md:max-w-[75%] whitespace-pre-wrap break-words ${
                      isUser
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100"
                    }`}
                  >
                    {parts.map((part, idx) =>
                      idx % 2 === 1 ? (
                        <pre
                          key={idx}
                          className="bg-gray-800 text-green-300 p-3 my-2 rounded-lg overflow-x-auto text-xs font-mono"
                        >
                          <code>{part.trim()}</code>
                        </pre>
                      ) : (
                        <span key={idx}>{part}</span>
                      )
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="px-4 py-2 bg-white text-gray-600 rounded-xl rounded-bl-none shadow-sm border border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} className="h-4" />
        </main>

        {/* Input Area */}
        <footer className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <div className="absolute right-3 bottom-3 text-gray-400 text-xs">
                {input.length}/500
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl ${
                input.trim()
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              <FiSend className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </footer>
      </div>
    </div>
  );
}
