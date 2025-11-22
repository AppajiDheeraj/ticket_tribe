"use client";

import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------
   Sample data (replace with real backend)
------------------------------------------ */
const SAMPLE_MEMBERS = [
  { id: 1, name: "Arjun Rao", role: "Admin", online: true, color: "#7c3aed" },
  { id: 2, name: "Maya K", role: "Member", online: true, color: "#0ea5a4" },
  { id: 3, name: "Rahul Sharma", role: "Member", online: false, color: "#fb923c" },
  { id: 4, name: "Noah Lee", role: "Member", online: true, color: "#ef4444" },
  { id: 5, name: "Asha Patel", role: "Member", online: true, color: "#06b6d4" },
];

const SAMPLE_MESSAGES = [
  { id: "m1", authorId: 1, author: "Arjun Rao", text: "Welcome to TickerTribe — good luck today!", time: "09:02", date: "2025-11-21" },
  { id: "m2", authorId: 2, author: "Maya K", text: "Anyone leaning NVDA?", time: "09:05", date: "2025-11-21" },
  { id: "m3", authorId: 1, author: "Arjun Rao", text: "I'm picking HIGHER on NVDA.", time: "09:07", date: "2025-11-21" },
  { id: "m4", authorId: 4, author: "Noah Lee", text: "GL everyone!", time: "09:12", date: "2025-11-21" },
];

/* ------------------------------------------
   Utils
------------------------------------------ */
function initials(name) {
  return name
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function groupBy(list, keyFn) {
  const out = {};
  list.forEach((item) => {
    const k = keyFn(item);
    if (!out[k]) out[k] = [];
    out[k].push(item);
  });
  return out;
}

function formatDate(dateISO) {
  const today = new Date().toISOString().slice(0, 10);
  if (dateISO === today) return "Today";
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function shade(hex, percent) {
  try {
    const f = parseInt(hex.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = Math.abs(percent) / 100;
    const R = Math.round((t - (f >> 16)) * p) + (f >> 16);
    const G = Math.round((t - ((f >> 8) & 0xff)) * p) + ((f >> 8) & 0xff);
    const B = Math.round((t - (f & 0xff)) * p) + (f & 0xff);
    return `rgb(${R}, ${G}, ${B})`;
  } catch {
    return hex;
  }
}

function Avatar({ name, color, size = 32 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-semibold"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${shade(color, -15)})`,
      }}
    >
      {initials(name)}
    </div>
  );
}

/* ------------------------------------------
   Main Component
------------------------------------------ */
export default function TribeChatPage() {
  const [members, setMembers] = useState(SAMPLE_MEMBERS);
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  const msgRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  const grouped = groupBy(messages, (m) => m.date);

  /* Smooth auto-scroll */
  useEffect(() => {
    const el = msgRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  /* Fake typing indicator (demo) */
  useEffect(() => {
    const t = setTimeout(() => {
      setTypingUsers([{ id: 2, name: "Maya K" }]);
      setTimeout(() => setTypingUsers([]), 1800);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  /* Send message */
  function sendMsg() {
    if (!text.trim() && attachedFiles.length === 0) return;

    setMessages((m) => [
      ...m,
      {
        id: "m" + Date.now(),
        author: "You",
        authorId: 0,
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toISOString().slice(0, 10),
        files: attachedFiles,
      },
    ]);

    setText("");
    setAttachedFiles([]);
  }

  /* Attach */
  function attach(e) {
    const files = Array.from(e.target.files || []).map((f) => ({
      name: f.name,
      size: f.size,
    }));
    setAttachedFiles((p) => [...p, ...files]);
    e.target.value = "";
  }

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* TOP BAR */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile drawer icon */}
            <button
              onClick={() => setShowMembers(true)}
              className="lg:hidden w-10 h-10 rounded-md bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center"
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <rect width="18" height="2" rx="1" fill="#444" />
                <rect y="5" width="18" height="2" rx="1" fill="#444" />
                <rect y="10" width="18" height="2" rx="1" fill="#444" />
              </svg>
            </button>

            <div>
              <div className="font-semibold text-neutral-900 text-[15px]">Tribe Chat</div>
              <div className="text-xs text-neutral-500">Real-time · Private tribe chat</div>
            </div>
          </div>

          {/* search */}
          <input
            placeholder="Find member…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="hidden sm:block border px-3 py-2 rounded-md text-sm bg-white"
          />
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-6">
          {/* CHAT */}
          <main className="bg-white border rounded-xl shadow-sm flex flex-col">

            {/* messages */}
            <div
              ref={msgRef}
              className="flex-1 overflow-y-auto p-3 md:p-4 space-y-5"
            >
              {Object.keys(grouped).map((date) => (
                <div key={date} className="space-y-4">
                  <div className="flex justify-center">
                    <span className="text-[11px] px-3 py-1 rounded-full bg-neutral-100 text-neutral-500">
                      {formatDate(date)}
                    </span>
                  </div>

                  {grouped[date].map((m, idx) => {
                    const isMe = m.author === "You";
                    const prev = grouped[date][idx - 1];
                    const showAuthor = !prev || prev.author !== m.author;

                    return (
                      <div key={m.id} className={`flex ${isMe ? "justify-end" : ""}`}>
                        <div className="max-w-[70%] text-[13px] leading-snug">
                          <div className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                            
                            {!isMe && showAuthor && (
                              <Avatar
                                name={m.author}
                                color={getColor(m.authorId, members)}
                                size={32}
                              />
                            )}

                            <div>
                              {!isMe && showAuthor && (
                                <div className="text-[11px] text-neutral-500 mb-0.5">
                                  {m.author}
                                </div>
                              )}

                              <div
                                className={`${isMe
                                  ? "bg-blue-600 text-white"
                                  : "bg-neutral-100 text-neutral-900"
                                } px-3 py-2 rounded-xl shadow-sm whitespace-pre-wrap`}
                              >
                                {m.text}

                                {m.files && m.files.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {m.files.map((f, i) => (
                                      <div
                                        key={i}
                                        className="text-[11px] bg-white px-2 py-1 border rounded-md"
                                      >
                                        {f.name}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="mt-1 text-[10px] text-neutral-400">
                                {m.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* typing indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 text-[12px] text-neutral-500">
                  <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center">
                    …
                  </div>
                  {typingUsers.map((t) => t.name).join(", ")} typing…
                </div>
              )}
            </div>

            {/* attachments preview */}
            {attachedFiles.length > 0 && (
              <div className="border-t bg-neutral-50 px-3 py-2 flex gap-2 overflow-x-auto">
                {attachedFiles.map((f, i) => (
                  <div key={i} className="border bg-white shadow-sm rounded-md px-3 py-2 text-[11px]">
                    {f.name}
                  </div>
                ))}
              </div>
            )}

            {/* composer */}
            <div className="border-t p-3 bg-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-10 h-10 rounded-md bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center"
                >
                  📎
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={attach}
                />

                <textarea
                  ref={inputRef}
                  rows={1}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMsg();
                    }
                  }}
                  placeholder="Message your tribe…"
                  className="flex-1 min-h-[40px] max-h-32 border rounded-md px-3 py-2 text-sm bg-neutral-50 resize-none"
                />

                <button
                  onClick={sendMsg}
                  className={`px-4 py-2 rounded-md text-sm ${
                    text.trim() || attachedFiles.length
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  Send
                </button>
              </div>
            </div>
          </main>

          {/* MEMBERS PANEL */}
          <aside
            className={`bg-white border rounded-xl shadow-sm p-4 transition-transform duration-200 lg:static lg:translate-x-0
            fixed top-0 right-0 h-full w-full z-50 ${
              showMembers ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-[14px] text-neutral-900">
                  Active Members
                </div>
                <div className="text-xs text-neutral-500">
                  {members.filter((m) => m.online).length} online
                </div>
              </div>

              <button
                onClick={() => setShowMembers(false)}
                className="lg:hidden px-3 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-sm"
              >
                Close
              </button>
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members"
              className="w-full border rounded-md px-3 py-2 text-sm bg-white mb-4"
            />

            <div className="space-y-3 overflow-y-auto max-h-[65vh]">
              {filteredMembers.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.name} color={m.color} size={38} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium truncate">{m.name}</div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          m.online ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      />
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {m.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-neutral-500 mt-4 border-t pt-2">
              Tribe chat • TickerTribe © 2025
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* helper */
function getColor(id, members) {
  const m = members.find((x) => x.id === id);
  return m?.color || "#6b7280";
}
