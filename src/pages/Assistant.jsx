import React, { useEffect, useRef, useState } from "react";
import { Send, MessageCircleQuestion, Sparkles } from "lucide-react";
import AppLayout from "../components/AppLayout";
import api from "../api/api";

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your Smart Assistant. Ask me about cramps, bloating, late periods, or anything else about your cycle." },
  ]);
  const [input, setInput] = useState("");
  const [suggested, setSuggested] = useState([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    api.get("/assistant/suggested-questions").then((res) => setSuggested(res.data.questions)).catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(question) {
    const q = (question ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setSending(true);
    try {
      const res = await api.post("/assistant/ask", { question: q });
      setMessages((m) => [...m, { role: "assistant", text: res.data.answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <AppLayout title="Smart Assistant">
      <div className="card max-w-2xl mx-auto flex flex-col h-[70vh] mt-4">
        <div className="flex items-center gap-2 pb-3 border-b border-plum-50 dark:border-plum-800 mb-3">
          <MessageCircleQuestion size={18} className="text-rose-500" />
          <p className="text-xs text-plum-400">Rule-based answers from a local knowledge base — general information only, not medical advice.</p>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                m.role === "user" ? "bg-plum-rose text-white" : "bg-plum-50 dark:bg-plum-800 text-ink-900 dark:text-blush-50"
              }`}>
                {m.role === "assistant" && <Sparkles size={12} className="inline mr-1.5 -mt-0.5 text-rose-400" />}
                {m.text}
              </div>
            </div>
          ))}
          {sending && <p className="text-xs text-plum-400 pl-2">Thinking...</p>}
        </div>

        {messages.length <= 1 && suggested.length > 0 && (
          <div className="flex flex-wrap gap-2 py-3">
            {suggested.map((q, i) => (
              <button key={i} onClick={() => send(q)} className="text-xs px-3 py-1.5 rounded-full border border-plum-200 dark:border-plum-700 text-plum-600 dark:text-plum-200 hover:bg-plum-50 dark:hover:bg-plum-800">
                {q}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 pt-3 border-t border-plum-50 dark:border-plum-800 mt-2">
          <input
            className="input-field flex-1" placeholder="Ask a question about your cycle..."
            value={input} onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-primary px-4" aria-label="Send">
            <Send size={18} />
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
