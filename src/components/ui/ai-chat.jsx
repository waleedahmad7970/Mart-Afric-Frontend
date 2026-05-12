import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react"; // npm install lucide-react
import aiSuggestionApis from "../../api/ai-suggestion/ai-suggestion-apis";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Welcome to Sahel! How can I help you find the best flavors today?",
      products: [],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    const [res, error] = await aiSuggestionApis.aiChat(userText);
    const data = res?.data?.data;
    if (res?.data) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data?.message,
          debug: {
            intent: data?.intent,
            productCount: data?.products?.length,
          },
          products: data?.products || [],
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-warm shadow-glow text-white z-50 transition-smooth hover:scale-110 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[70vh] bg-card border border-border rounded-[2rem] shadow-elevated z-50 flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="p-5 border-b border-border bg-gradient-sheen">
            <h3 className="font-display text-xl text-primary flex items-center gap-2">
              <Sparkles size={18} className="text-accent" /> Afric Assistant
            </h3>
            <p className="text-xs text-muted-foreground italic">
              Powered by Afric AI
            </p>
          </div>

          {/* Conversation Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-background/50"
          >
            {messages?.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                {/* MESSAGE BUBBLE */}
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-secondary text-secondary-foreground rounded-tl-none shadow-soft"
                  }`}
                >
                  {m.text}
                </div>

                {/* PRODUCTS SECTION */}
                {m.products?.length > 0 && (
                  <div className="mt-3 w-full max-w-[85%]">
                    <p className="text-xs text-muted-foreground mb-2">
                      Suggested products
                    </p>

                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {m.products.map((p) => (
                        <div
                          key={p._id}
                          className="min-w-[150px] bg-card border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-md transition"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-24 w-full object-cover"
                          />

                          <div className="p-2 space-y-1">
                            <p className="text-[10px] uppercase text-muted-foreground">
                              {p.origin || "product"}
                            </p>

                            <p className="text-xs font-medium line-clamp-1">
                              {p.name}
                            </p>

                            <p className="text-xs font-semibold text-primary">
                              ${p.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-xs text-muted-foreground animate-pulse">
                Assistant is thinking...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2 items-center bg-muted rounded-full px-4 py-2 border border-border focus-within:border-primary transition-smooth">
              <input
                className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about Ghana Jollof or Kivo..."
              />
              <button
                onClick={sendMessage}
                className="text-primary hover:text-accent transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
