import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import "./AIAssistant.css";

const initialMessage = {
  id: 1,
  role: "assistant",
  text: "Hi! I'm E-Cart AI. I can help you search products, check stock, and navigate the store. I can search the live catalog, check product stock, and open store pages for you.",
};

const AIAssistant = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const isAdmin = isAuthenticated && user?.role === "admin";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const addMessage = (role, text) => {
    setMessages((current) => [
      ...current,
      { id: Date.now() + Math.random(), role, text },
    ]);
  };

  const sendMessage = async (event) => {
    event?.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) return;

    addMessage("user", trimmedMessage);
    setMessage("");
    setIsSending(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: trimmedMessage,
          context: {
            path: window.location.pathname,
            role: user?.role || "guest",
          },
          history: messages
            .slice(-8)
            .map(({ role, text }) => ({ role, text })),
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "The AI server returned an unexpected response. Check that the backend is running on the configured API URL."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI assistant request failed");
      }

      addMessage("assistant", data.message);

      if (data.action?.type === "navigate" && data.action.path) {
        navigate(data.action.path);
      }
    } catch (error) {
      addMessage(
        "assistant",
        error.message || "I couldn't process that request. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const quickAction = (label, path) => {
    addMessage("user", label);
    addMessage("assistant", `Opening ${label.toLowerCase()}...`);
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="ai-assistant-root">
      {isOpen && (
        <section className="ai-chat-window" aria-label="E-Cart AI assistant">
          <header className="ai-chat-header">
            <div className="ai-chat-title">
              <span className="ai-avatar">
                {isAdmin ? <AdminPanelSettingsIcon /> : <SmartToyIcon />}
              </span>
              <div>
                <h2>{isAdmin ? "E-Cart AI Admin" : "E-Cart AI"}</h2>
                <span>{isAdmin ? "Admin assistant" : "Shopping assistant"}</span>
              </div>
            </div>
            <button
              type="button"
              className="ai-icon-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant"
            >
              <CloseIcon />
            </button>
          </header>

          <div className="ai-message-list">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`ai-message-row ${item.role === "user" ? "user" : "assistant"}`}
              >
                <div className="ai-message-bubble">{item.text}</div>
              </div>
            ))}
            {isSending && (
              <div className="ai-message-row assistant">
                <div className="ai-message-bubble ai-typing">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-quick-actions">
            <button type="button" onClick={() => quickAction("products", "/products")}>
              <StorefrontIcon /> Products
            </button>
            <button type="button" onClick={() => quickAction("cart", "/cart")}>
              <ShoppingCartIcon /> Cart
            </button>
            {isAuthenticated && (
              <button type="button" onClick={() => quickAction("profile", "/profile")}>
                <PersonIcon /> Profile
              </button>
            )}
          </div>

          <form className="ai-input-area" onSubmit={sendMessage}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={isAdmin ? "Ask the admin assistant..." : "Ask about products..."}
              disabled={isSending}
              aria-label="Message E-Cart AI"
            />
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`ai-floating-button ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close E-Cart AI" : "Open E-Cart AI"}
        aria-expanded={isOpen}
      >
        {isOpen ? <CloseIcon /> : <SmartToyIcon />}
      </button>
    </div>
  );
};

export default AIAssistant;
