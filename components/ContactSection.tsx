"use client";

import React, { useState } from "react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "email">("email");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const roles = ["Full-Time Role", "Freelance / Contract", "Building a Product"];

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Please enter your name.", "error");
      return;
    }
    if (contactMethod === "email") {
      if (!email.trim() || !email.includes("@")) {
        showToast("Please enter a valid email address.", "error");
        return;
      }
    } else {
      if (!phone.trim()) {
        showToast("Please enter a valid phone number.", "error");
        return;
      }
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      showToast(`Thank you, ${name}! Your message has been sent.`, "success");
      // Reset form
      setName("");
      setCountry("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSelectedRoles([]);
      setContactMethod("email");
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      className="py-120 position-relative z-1 overflow-hidden"
      style={{
        background: "#000000",
        color: "#ffffff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        zIndex: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <div className="container tw-container-1800-px self-center">
        <form onSubmit={handleSubmit} className="contact-sentence-form">
          <div className="sentence-container">
            {/* Row 1 */}
            <div className="sentence-row">
              <span className="sentence-text">Hey, Zain! My name is</span>
              <input
                type="text"
                className="sentence-input input-name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <span className="sentence-text">and I am from</span>
              <input
                type="text"
                className="sentence-input input-country"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            {/* Row 2 */}
            <div className="sentence-row">
              <span className="sentence-text">Let&apos;s connect about</span>
              <span className="pills-wrapper">
                {roles.map((role) => {
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      className={`role-pill-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => handleRoleToggle(role)}
                    >
                      {role}
                    </button>
                  );
                })}
              </span>
            </div>

            {/* Row 3 */}
            <div className="sentence-row">
              <span className="sentence-text">We can talk in more detail at</span>
              {contactMethod === "email" ? (
                <input
                  type="email"
                  className="sentence-input input-email"
                  placeholder="your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              ) : (
                <input
                  type="tel"
                  className="sentence-input input-phone"
                  placeholder="your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              )}
              <span className="pills-wrapper">
                <button
                  type="button"
                  className={`role-pill-btn method-pill ${contactMethod === "whatsapp" ? "selected" : ""}`}
                  onClick={() => setContactMethod("whatsapp")}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  className={`role-pill-btn method-pill ${contactMethod === "email" ? "selected" : ""}`}
                  onClick={() => setContactMethod("email")}
                >
                  Email
                </button>
              </span>
            </div>

            {/* Row 4 (Forced New Line as requested) */}
            <div className="sentence-row mt-4">
              <span className="sentence-text">In short,</span>
              <input
                type="text"
                className="sentence-input input-message"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-container text-center">
            <button 
              type="submit" 
              className="submit-action-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send message"} 
              <span className="arrow-icon">↗</span>
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`contact-toast ${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === "success" ? "✓" : "⚠"}
            </span>
            <span className="toast-text">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Styling */}
      <style>{`
        .contact-sentence-form {
          max-width: 1450px;
          margin: 0 auto;
          padding: 0 15px;
        }

        .sentence-container {
          font-size: clamp(1.6rem, 3.5vw, 2.85rem);
          font-weight: 300;
          line-height: 1.8;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .sentence-row {
          margin-bottom: clamp(1.2rem, 2.5vw, 2.2rem);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          row-gap: 0.85rem;
        }

        .sentence-text {
          margin-right: 0.6rem;
          vertical-align: middle;
        }

        .sentence-input {
          border: none;
          border-bottom: 1.5px solid rgba(255, 255, 255, 0.25);
          background: transparent;
          color: #ffffff;
          font-family: inherit;
          font-size: inherit;
          font-weight: 400;
          outline: none;
          padding: 0 4px;
          margin-right: 0.85rem;
          transition: border-bottom-color 0.3s ease, background-color 0.3s ease;
          vertical-align: middle;
        }

        .sentence-input:focus {
          border-bottom-color: #ffffff;
          background-color: rgba(255, 255, 255, 0.05);
        }

        .sentence-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
          font-weight: 300;
        }

        .input-name {
          width: clamp(200px, 20vw, 360px);
        }

        .input-country {
          width: clamp(150px, 15vw, 280px);
        }

        .input-email,
        .input-phone {
          width: clamp(260px, 25vw, 480px);
        }

        .input-message {
          width: 300px;
          flex-grow: 1;
          margin-right: 0.5rem;
        }

        .pills-wrapper {
          display: inline-flex;
          gap: 0.6rem;
          margin: 0 0.6rem;
          vertical-align: middle;
          flex-wrap: wrap;
        }

        .role-pill-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #ffffff;
          padding: clamp(6px, 1vw, 12px) clamp(16px, 2vw, 32px);
          border-radius: 35px;
          font-size: clamp(0.9rem, 1.3vw, 1.15rem);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .role-pill-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #ffffff;
          transform: translateY(-1px);
        }

        .role-pill-btn.selected {
          background: #ffffff;
          border-color: #ffffff;
          color: #000000;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
        }

        .method-pill {
          background: rgba(255, 255, 255, 0.06);
        }

        .submit-container {
          margin-top: clamp(60px, 8vw, 120px);
          margin-bottom: 20px;
        }

        .submit-action-btn {
          font-size: clamp(2.5rem, 6vw, 5.5rem);
          font-weight: 400;
          color: #8e8e93;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.4s ease, transform 0.4s ease;
          display: inline-flex;
          align-items: center;
          gap: 15px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
        }

        .submit-action-btn:hover {
          color: #ffffff;
          transform: scale(1.03);
        }

        .submit-action-btn:active {
          transform: scale(0.98);
        }

        .arrow-icon {
          display: inline-block;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .submit-action-btn:hover .arrow-icon {
          transform: translate(8px, -8px);
        }

        /* Toast Styles */
        .contact-toast {
          position: fixed;
          bottom: 40px;
          right: 40px;
          background: #1c2025;
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 9999;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .contact-toast.success {
          border-left: 4px solid #34c759;
        }

        .contact-toast.error {
          border-left: 4px solid #ff3b30;
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toast-icon {
          font-weight: bold;
          font-size: 1.2rem;
        }

        .toast-text {
          font-size: 0.95rem;
          font-weight: 500;
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .sentence-container {
            line-height: 2.2;
          }
          .sentence-row {
            margin-bottom: 1.5rem;
          }
          .sentence-input {
            margin-bottom: 0.5rem;
          }
          .input-message {
            width: 100%;
          }
          .contact-toast {
            bottom: 20px;
            right: 20px;
            left: 20px;
          }
        }
      `}</style>
    </section>
  );
}
