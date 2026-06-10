// // import { useState, useRef, useEffect } from "react";
// // import { MessageCircle, X, Send, Sparkles } from "lucide-react"; // npm install lucide-react
// // import aiSuggestionApis from "../../api/ai-suggestion/ai-suggestion-apis";

// // const AIChat = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [input, setInput] = useState("");
// //   const [messages, setMessages] = useState([
// //     {
// //       role: "ai",
// //       text: "Welcome to Sahel! How can I help you find the best flavors today?",
// //       products: [],
// //     },
// //   ]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const scrollRef = useRef(null);

// //   // Auto-scroll to bottom on new messages
// //   useEffect(() => {
// //     if (scrollRef.current) {
// //       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
// //     }
// //   }, [messages, isOpen]);
// //   const sendMessage = async () => {
// //     if (!input.trim() || isLoading) return;

// //     const userText = input;
// //     setInput("");
// //     setMessages((prev) => [...prev, { role: "user", text: userText }]);
// //     setIsLoading(true);

// //     const [res, error] = await aiSuggestionApis.aiChat(userText);
// //     const data = res?.data?.data;
// //     if (res?.data) {
// //       setMessages((prev) => [
// //         ...prev,
// //         {
// //           role: "ai",
// //           text: data?.message,
// //           debug: {
// //             intent: data?.intent,
// //             productCount: data?.products?.length,
// //           },
// //           products: data?.products || [],
// //         },
// //       ]);
// //     }
// //     setIsLoading(false);
// //   };

// //   return (
// //     <>
// //       {/* Floating Action Button */}
// //       <button
// //         onClick={() => setIsOpen(!isOpen)}
// //         className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-warm shadow-glow text-white z-50 transition-smooth hover:scale-110 active:scale-95"
// //       >
// //         {isOpen ? <X size={24} /> : <Sparkles size={24} />}
// //       </button>

// //       {/* Chat Window */}
// //       {isOpen && (
// //         <div className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[70vh] bg-card border border-border rounded-[2rem] shadow-elevated z-50 flex flex-col overflow-hidden animate-fade-up">
// //           {/* Header */}
// //           <div className="p-5 border-b border-border bg-gradient-sheen">
// //             <h3 className="font-display text-xl text-primary flex items-center gap-2">
// //               <Sparkles size={18} className="text-accent" /> Afric Assistant
// //             </h3>
// //             <p className="text-xs text-muted-foreground italic">
// //               Powered by Afric AI
// //             </p>
// //           </div>

// //           {/* Conversation Area */}
// //           <div
// //             ref={scrollRef}
// //             className="flex-1 overflow-y-auto p-4 space-y-6 bg-background/50"
// //           >
// //             {messages?.map((m, idx) => (
// //               <div
// //                 key={idx}
// //                 className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
// //               >
// //                 {/* MESSAGE BUBBLE */}
// //                 <div
// //                   className={`max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap ${
// //                     m.role === "user"
// //                       ? "bg-primary text-primary-foreground rounded-tr-none"
// //                       : "bg-secondary text-secondary-foreground rounded-tl-none shadow-soft"
// //                   }`}
// //                 >
// //                   {m.text}
// //                 </div>

// //                 {/* PRODUCTS SECTION */}
// //                 {m.products?.length > 0 && (
// //                   <div className="mt-3 w-full max-w-[85%]">
// //                     <p className="text-xs text-muted-foreground mb-2">
// //                       Suggested products
// //                     </p>

// //                     <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
// //                       {m.products.map((p) => (
// //                         <div
// //                           key={p._id}
// //                           className="min-w-[150px] bg-card border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-md transition"
// //                         >
// //                           <img
// //                             src={p.image}
// //                             alt={p.name}
// //                             className="h-24 w-full object-cover"
// //                           />

// //                           <div className="p-2 space-y-1">
// //                             <p className="text-[10px] uppercase text-muted-foreground">
// //                               {p.origin || "product"}
// //                             </p>

// //                             <p className="text-xs font-medium line-clamp-1">
// //                               {p.name}
// //                             </p>

// //                             <p className="text-xs font-semibold text-primary">
// //                               ${p.price}
// //                             </p>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //             {isLoading && (
// //               <div className="text-xs text-muted-foreground animate-pulse">
// //                 Assistant is thinking...
// //               </div>
// //             )}
// //           </div>

// //           {/* Input Area */}
// //           <div className="p-4 border-t border-border bg-card">
// //             <div className="flex gap-2 items-center bg-muted rounded-full px-4 py-2 border border-border focus-within:border-primary transition-smooth">
// //               <input
// //                 className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground"
// //                 value={input}
// //                 onChange={(e) => setInput(e.target.value)}
// //                 onKeyPress={(e) => e.key === "Enter" && sendMessage()}
// //                 placeholder="Ask about Ghana Jollof or Kivo..."
// //               />
// //               <button
// //                 onClick={sendMessage}
// //                 className="text-primary hover:text-accent transition-colors disabled:opacity-50"
// //                 disabled={isLoading}
// //               >
// //                 <Send size={18} />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default AIChat;
// import { useState, useRef, useEffect } from "react";
// import { X, Send, Sparkles, Mic, MicOff, Loader2 } from "lucide-react";
// import aiSuggestionApis from "../../api/ai-suggestion/ai-suggestion-apis";
// import { cartActions } from "../../store/slices/cart/slice";
// import cartApis from "../../api/cart/cart-apis";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const getSupportedMimeType = () => {
//   const types = [
//     "audio/webm;codecs=opus",
//     "audio/ogg;codecs=opus",
//     "audio/mp4",
//     "audio/webm",
//   ];
//   return types.find((t) => MediaRecorder.isTypeSupported(t)) || "";
// };

// // Parse AI action commands and return clean text
// const processReply = async (reply, products, dispatch, navigate) => {
//   const addToCartMatch = reply.match(/ACTION:ADD_TO_CART:(\S+)/);
//   const navigateMatch = reply.match(/ACTION:NAVIGATE:(\S+)/);
//   const cleanReply = reply.replace(/ACTION:\S+/g, "").trim();

//   if (addToCartMatch) {
//     const productId = addToCartMatch[1].replace(/[^a-zA-Z0-9]/g, "");
//     try {
//       const [res, error] = await cartApis.addItem({
//         product: productId,
//         quantity: 1,
//       });
//       if (res?.data) {
//         dispatch(cartActions.addToCart(res.data?.data || res.data));
//         console.log("✅ Added to cart:", productId);
//       }
//     } catch (err) {
//       console.error("Cart error:", err);
//     }
//   }

//   if (navigateMatch) {
//     navigate(navigateMatch[1]);
//   }

//   return cleanReply;
// };
// const AIChat = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([
//     {
//       role: "ai",
//       text: "Welcome to Sahel! How can I help you find the best flavors today?",
//       products: [],
//     },
//   ]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const scrollRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages, isOpen]);

//   // ── Text message ────────────────────────────────────────────────
//   const sendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userText = input;
//     setInput("");
//     setMessages((prev) => [
//       ...prev,
//       { role: "user", text: userText, products: [] },
//     ]);
//     setIsLoading(true);

//     try {
//       const [res, error] = await aiSuggestionApis.aiChatText(userText);
//       const data = res?.data;

//       if (data?.success) {
//         const products = data.products || [];
//         const cleanReply = await processReply(
//           data.reply,
//           products,
//           dispatch,
//           navigate,
//         );

//         setMessages((prev) => [
//           ...prev,
//           { role: "ai", text: cleanReply, products },
//         ]);

//         if (window.speechSynthesis) {
//           window.speechSynthesis.cancel();
//           window.speechSynthesis.speak(
//             new SpeechSynthesisUtterance(cleanReply),
//           );
//         }
//       }
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "ai",
//           text: "Sorry, something went wrong. Try again.",
//           products: [],
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ── Voice: start recording ───────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mimeType = getSupportedMimeType();
//       const mediaRecorder = new MediaRecorder(stream, { mimeType });

//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       mediaRecorder.start(100);
//       setIsRecording(true);
//     } catch (err) {
//       console.error("Mic error:", err);
//       alert("Microphone access denied. Please allow mic permission.");
//     }
//   };

//   // ── Voice: stop recording & send ────────────────────────────────
//   const stopRecording = async () => {
//     const mediaRecorder = mediaRecorderRef.current;
//     if (!mediaRecorder) return;

//     setIsRecording(false);
//     setIsLoading(true);

//     mediaRecorder.onstop = async () => {
//       mediaRecorder.stream.getTracks().forEach((t) => t.stop());

//       const mimeType = getSupportedMimeType();
//       const ext = mimeType.includes("ogg")
//         ? "ogg"
//         : mimeType.includes("mp4")
//           ? "mp4"
//           : "webm";

//       const blob = new Blob(audioChunksRef.current, { type: mimeType });
//       const formData = new FormData();
//       formData.append("audio", blob, `recording.${ext}`);

//       try {
//         const [res, error] = await aiSuggestionApis.aiChatVoice(formData);
//         const data = res?.data;

//         if (data?.success) {
//           const products = data.products || [];
//           const cleanReply = await processReply(
//             data.reply,
//             products,
//             dispatch,
//             navigate,
//           );

//           setMessages((prev) => [
//             ...prev,
//             { role: "user", text: `🎤 ${data.transcript}`, products: [] },
//             { role: "ai", text: cleanReply, products },
//           ]);

//           if (window.speechSynthesis) {
//             window.speechSynthesis.cancel();
//             window.speechSynthesis.speak(
//               new SpeechSynthesisUtterance(cleanReply),
//             );
//           }
//         }
//       } catch (err) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "ai",
//             text: "Sorry, could not process your voice. Try again.",
//             products: [],
//           },
//         ]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     mediaRecorder.stop();
//   };

//   return (
//     <>
//       {/* Floating Action Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-warm shadow-glow text-white z-50 transition-smooth hover:scale-110 active:scale-95"
//       >
//         {isOpen ? <X size={24} /> : <Sparkles size={24} />}
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[70vh] bg-card border border-border rounded-[2rem] shadow-elevated z-50 flex flex-col overflow-hidden animate-fade-up">
//           {/* Header */}
//           <div className="p-5 border-b border-border bg-gradient-sheen">
//             <h3 className="font-display text-xl text-primary flex items-center gap-2">
//               <Sparkles size={18} className="text-accent" /> Afric Assistant
//             </h3>
//             <p className="text-xs text-muted-foreground italic">
//               Powered by Afric AI
//             </p>
//           </div>

//           {/* Messages */}
//           <div
//             ref={scrollRef}
//             className="flex-1 overflow-y-auto p-4 space-y-6 bg-background/50"
//           >
//             {messages?.map((m, idx) => (
//               <div
//                 key={idx}
//                 className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
//               >
//                 {/* Message bubble */}
//                 <div
//                   className={`max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap ${
//                     m.role === "user"
//                       ? "bg-primary text-primary-foreground rounded-tr-none"
//                       : "bg-secondary text-secondary-foreground rounded-tl-none shadow-soft"
//                   }`}
//                 >
//                   {m.text}
//                 </div>

//                 {/* Product cards */}
//                 {m.products?.length > 0 && (
//                   <div className="mt-3 w-full max-w-[85%]">
//                     <p className="text-xs text-muted-foreground mb-2">
//                       Suggested products
//                     </p>
//                     <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
//                       {m.products.map((p) => (
//                         <div
//                           key={p._id}
//                           className="min-w-[150px] bg-card border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-md transition cursor-pointer"
//                         >
//                           <img
//                             src={p.image}
//                             alt={p.name}
//                             className="h-24 w-full object-cover"
//                           />
//                           <div className="p-2 space-y-1">
//                             <p className="text-[10px] uppercase text-muted-foreground">
//                               {p.origin || "product"}
//                             </p>
//                             <p className="text-xs font-medium line-clamp-1">
//                               {p.name}
//                             </p>
//                             <p className="text-xs font-semibold text-primary">
//                               £{p.price}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div className="text-xs text-muted-foreground animate-pulse">
//                 {isRecording ? "🔴 Recording..." : "Assistant is thinking..."}
//               </div>
//             )}
//           </div>

//           {/* Input Area */}
//           <div className="p-4 border-t border-border bg-card">
//             <div className="flex gap-2 items-center bg-muted rounded-full px-4 py-2 border border-border focus-within:border-primary transition-smooth">
//               <input
//                 className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                 placeholder="Ask about Ghana Jollof or Kivo..."
//                 disabled={isLoading}
//               />

//               {/* Send */}
//               <button
//                 onClick={sendMessage}
//                 className="text-primary hover:text-accent transition-colors disabled:opacity-50"
//                 disabled={isLoading || !input.trim()}
//               >
//                 <Send size={18} />
//               </button>

//               {/* Mic */}
//               <button
//                 onMouseDown={startRecording}
//                 onMouseUp={stopRecording}
//                 onTouchStart={startRecording}
//                 onTouchEnd={stopRecording}
//                 disabled={isLoading && !isRecording}
//                 className={`transition-all disabled:opacity-40 ${
//                   isRecording
//                     ? "text-red-500 scale-125 animate-pulse"
//                     : "text-primary hover:text-accent"
//                 }`}
//                 title="Hold to speak"
//               >
//                 {isLoading && !isRecording ? (
//                   <Loader2 size={18} className="animate-spin" />
//                 ) : isRecording ? (
//                   <MicOff size={18} />
//                 ) : (
//                   <Mic size={18} />
//                 )}
//               </button>
//             </div>

//             {isRecording && (
//               <p className="text-xs text-red-400 text-center mt-2 animate-pulse">
//                 🔴 Recording... release to send
//               </p>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AIChat;

import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Loader2,
  ShoppingCart,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import aiSuggestionApis from "../../api/ai-suggestion/ai-suggestion-apis";
import cartApis from "../../api/cart/cart-apis"; // ← adjust path if needed

const getSupportedMimeType = () => {
  const types = [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mp4",
    "audio/webm",
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || "";
};

const AIChat = () => {
  const navigate = useNavigate();

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
  const [isRecording, setIsRecording] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(null); // productId just added

  const scrollRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // ── Parse ACTION commands from AI reply ──────────────────────────
  const processReply = async (reply, products) => {
    const addToCartMatch = reply.match(/ACTION:ADD_TO_CART:([a-zA-Z0-9]+)/);
    const navigateMatch = reply.match(/ACTION:NAVIGATE:(\S+)/);
    const cleanReply = reply.replace(/ACTION:\S+/g, "").trim();

    // Add to cart via your existing cartApis
    if (addToCartMatch) {
      const productId = addToCartMatch[1];
      try {
        const [res, error] = await cartApis.addToCart({
          product: productId,
          quantity: 1,
        });
        if (res?.data?.success) {
          // Show green tick on the product card
          setCartSuccess(productId);
          setTimeout(() => setCartSuccess(null), 3000);

          // Add confirmation message
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              text: "✅ Done! Item added to your cart. Want to checkout or keep shopping?",
              products: [],
              actions: ["go_to_cart", "checkout"],
            },
          ]);
        }
      } catch (err) {
        console.error("Add to cart error:", err);
      }
    }

    // Navigate
    if (navigateMatch) {
      navigate(navigateMatch[1]);
    }

    return cleanReply;
  };

  // ── Send typed message ───────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText, products: [] },
    ]);
    setIsLoading(true);

    try {
      const [res, error] = await aiSuggestionApis.aiChatText(userText);
      const data = res?.data;

      if (data?.success) {
        const products = data.products || [];
        const cleanReply = await processReply(data.reply, products);

        setMessages((prev) => [
          ...prev,
          { role: "ai", text: cleanReply, products },
        ]);

        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(
            new SpeechSynthesisUtterance(cleanReply),
          );
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, something went wrong. Try again.",
          products: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Start mic recording ──────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied. Please allow mic permission.");
    }
  };

  // ── Stop mic & send audio ────────────────────────────────────────
  const stopRecording = async () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    setIsRecording(false);
    setIsLoading(true);

    mediaRecorder.onstop = async () => {
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());

      const mimeType = getSupportedMimeType();
      const ext = mimeType.includes("ogg")
        ? "ogg"
        : mimeType.includes("mp4")
          ? "mp4"
          : "webm";

      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      const formData = new FormData();
      formData.append("audio", blob, `recording.${ext}`);

      try {
        const [res, error] = await aiSuggestionApis.aiChatVoice(formData);
        const data = res?.data;

        if (data?.success) {
          const products = data.products || [];
          const cleanReply = await processReply(data.reply, products);

          setMessages((prev) => [
            ...prev,
            { role: "user", text: `🎤 ${data.transcript}`, products: [] },
            { role: "ai", text: cleanReply, products },
          ]);

          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(
              new SpeechSynthesisUtterance(cleanReply),
            );
          }
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Sorry, could not process your voice. Try again.",
            products: [],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    mediaRecorder.stop();
  };

  // ── Quick action buttons (go to cart / checkout) ─────────────────
  const handleQuickAction = (action) => {
    if (action === "go_to_cart") navigate("/cart");
    if (action === "checkout") navigate("/checkout");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-warm shadow-glow text-white z-50 transition-smooth hover:scale-110 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

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

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-background/50"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-secondary text-secondary-foreground rounded-tl-none shadow-soft"
                  }`}
                >
                  {m.text}
                </div>

                {/* Quick action buttons (go to cart / checkout) */}
                {m.actions?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {m.actions.includes("go_to_cart") && (
                      <button
                        onClick={() => handleQuickAction("go_to_cart")}
                        className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition"
                      >
                        🛒 View Cart
                      </button>
                    )}
                    {m.actions.includes("checkout") && (
                      <button
                        onClick={() => handleQuickAction("checkout")}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary text-white hover:opacity-90 transition"
                      >
                        ✅ Checkout
                      </button>
                    )}
                  </div>
                )}

                {/* Product cards */}
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
                          <div className="relative">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-24 w-full object-cover"
                            />
                            {/* Green tick when added to cart */}
                            {cartSuccess === p._id?.toString() && (
                              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                                <Check size={32} className="text-white" />
                              </div>
                            )}
                          </div>

                          <div className="p-2 space-y-1">
                            <p className="text-[10px] uppercase text-muted-foreground">
                              {p.origin || "product"}
                            </p>
                            <p className="text-xs font-medium line-clamp-1">
                              {p.name}
                            </p>
                            <p className="text-xs font-semibold text-primary">
                              £{p.price}
                            </p>

                            {/* Add to cart button on card */}
                            <button
                              onClick={async () => {
                                const [res] = await cartApis.addToCart({
                                  product: p._id,
                                  quantity: 1,
                                });
                                if (res?.data?.success) {
                                  setCartSuccess(p._id?.toString());
                                  setTimeout(() => setCartSuccess(null), 3000);
                                }
                              }}
                              className="w-full mt-1 text-[10px] py-1 rounded-full bg-primary text-white hover:opacity-90 transition flex items-center justify-center gap-1"
                            >
                              <ShoppingCart size={10} /> Add to Cart
                            </button>
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
                {isRecording ? "🔴 Recording..." : "Assistant is thinking..."}
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2 items-center bg-muted rounded-full px-4 py-2 border border-border focus-within:border-primary transition-smooth">
              <input
                className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about Ghana Jollof or Kivo..."
                disabled={isLoading}
              />

              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="text-primary hover:text-accent transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>

              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={isLoading && !isRecording}
                className={`transition-all disabled:opacity-40 ${
                  isRecording
                    ? "text-red-500 scale-125 animate-pulse"
                    : "text-primary hover:text-accent"
                }`}
                title="Hold to speak"
              >
                {isLoading && !isRecording ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isRecording ? (
                  <MicOff size={18} />
                ) : (
                  <Mic size={18} />
                )}
              </button>
            </div>

            {isRecording && (
              <p className="text-xs text-red-400 text-center mt-2 animate-pulse">
                🔴 Recording... release to send
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
