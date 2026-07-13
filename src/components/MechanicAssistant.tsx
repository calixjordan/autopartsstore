"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Wrench, X, Send, ShieldCheck, ChevronRight, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: { label: string; action: () => void }[];
  recommendations?: { name: string; link: string }[];
}

export function MechanicAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize conversations
  useEffect(() => {
    if (!isOpen || messages.length > 0) return;

    setMessages([
      {
        id: "msg-1",
        sender: "bot",
        text: "Namaste! I'm Amit, your certified AutoPartsINDIA support mechanic. I can help diagnose vehicle issues and recommend the exact spare parts you need. To begin, select your car brand:",
        options: [
          { label: "Maruti Suzuki", action: () => handleSelectBrand("Maruti Suzuki") },
          { label: "Tata Motors", action: () => handleSelectBrand("Tata Motors") },
          { label: "Hyundai", action: () => handleSelectBrand("Hyundai") },
          { label: "Honda / Toyota", action: () => handleSelectBrand("Honda / Toyota") },
        ],
      },
    ]);
  }, [isOpen, messages.length]);

  // Scroll chat bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!mounted) return null;

  const handleSelectBrand = (brand: string) => {
    const userMsg: Message = { id: `usr-${Date.now()}`, sender: "user", text: brand };
    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: `Understood! ${brand} vehicles are engineered for reliable service. What symptom or issue are you experiencing with your vehicle?`,
      options: [
        {
          label: "Squeaking / grinding noise during braking",
          action: () => handleSelectSymptom("Brakes Noise", "Squeaking brakes indicate worn brake pads or scored disc rotors. It is critical to replace them immediately to prevent calliper damage.", [
            { name: "Shop Genuine Brake Pads", link: "/?search=brake&explore=true" },
            { name: "Compare Rotors & Calipers", link: "/?category=Brakes&explore=true" },
          ]),
        },
        {
          label: "Heavy vibrations or knocking under hood",
          action: () => handleSelectSymptom("Engine Vibration", "Engine vibrations under load are typically caused by misfiring spark plugs, dirty air filters, or worn engine mounts.", [
            { name: "Shop Spark Plugs & Filters", link: "/?search=filter&explore=true" },
            { name: "Explore Engine Lubricants", link: "/?category=Engine&explore=true" },
          ]),
        },
        {
          label: "Clutch pedal feels spongy or slips",
          action: () => handleSelectSymptom("Clutch Slip", "Spongy feel or high slipping points indicates worn clutch plates or pressure plates, requiring a full clutch kit replacement.", [
            { name: "View Transmission Spare Parts", link: "/?category=Transmission&explore=true" },
          ]),
        },
        {
          label: "AC blowing warm air / weak cooling",
          action: () => handleSelectSymptom("AC Cabin Filter", "Weak AC cooling is frequently caused by a clogged cabin AC filter blocking airflow, or low refrigerant levels.", [
            { name: "Shop Cabin AC Air Filters", link: "/?search=cabin&explore=true" },
            { name: "Explore Cooling Components", link: "/?category=Cooling&explore=true" },
          ]),
        },
      ],
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleSelectSymptom = (symptom: string, diagnostic: string, recommendations: { name: string; link: string }[]) => {
    const userMsg: Message = { id: `usr-${Date.now()}`, sender: "user", text: symptom };
    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: `🔧 Diagnostic Report: ${diagnostic}\n\nBased on your model compatibility rules, here are the certified spare parts suggested for repair:`,
      recommendations,
      options: [
        { label: "Restart Diagnostic", action: () => setMessages([]) },
      ],
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleCustomTextSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMsg: Message = { id: `usr-${Date.now()}`, sender: "user", text: userText };
    setInputValue("");

    // Simulate standard response
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: `Thanks for the details! To get the most accurate fitment diagnostics, please use the selector pathways above to isolate the symptom, or call our 24/7 support line at 1800-419-7575 to connect directly with a senior mechanic.`,
        options: [
          { label: "Go to Main Diagnostic", action: () => setMessages([]) },
        ],
      };
      setMessages((prev) => [...prev, userMsg, botMsg]);
    }, 800);

    setMessages((prev) => [...prev, userMsg]);
  };

  return (
    <>
      {/* Floating Wrench Assistant FAB */}
      <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 to-amber-500 hover:from-brand-500 hover:to-orange-400 flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.65)] hover:scale-105 transition-all duration-300 group"
          aria-label="Toggle certified mechanic support chat"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <Wrench className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-300" />}
          
          {/* Glowing pulse ring */}
          <span className="absolute inset-0 rounded-full border-2 border-brand-400/40 animate-ping scale-110 opacity-70 pointer-events-none" />
        </button>
      </div>

      {/* Mechanic Consultation Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm px-4 sm:px-0">
          <div className="bg-dark-900 border border-dark-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[480px] animate-fade-in relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 to-orange-500" />
            
            {/* Header */}
            <div className="bg-dark-950 px-5 py-4 border-b border-dark-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                  <Wrench className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-white text-xs font-black flex items-center gap-1.5">
                    Mechanic Consultant
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </h3>
                  <p className="text-[9px] text-dark-400 font-bold uppercase tracking-wider">Verified Support Officer</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-dark-800 text-dark-450 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-brand-500 text-white rounded-tr-none font-medium"
                        : "bg-dark-850 border border-dark-750 text-dark-100 rounded-tl-none"
                    }`}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i} className="mt-1 first:mt-0">{line}</p>
                    ))}

                    {/* Recommendations Links */}
                    {msg.recommendations && (
                      <div className="mt-3 space-y-2 border-t border-dark-750/50 pt-2.5">
                        {msg.recommendations.map((rec) => (
                          <button
                            key={rec.name}
                            onClick={() => {
                              router.push(rec.link);
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-between bg-dark-900 border border-brand-500/20 hover:border-brand-500/40 text-brand-400 hover:text-brand-300 rounded-xl px-3 py-2 text-[10px] font-bold text-left transition-all"
                          >
                            <span>{rec.name}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Options List */}
                  {msg.options && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={opt.action}
                          className="bg-dark-950 border border-dark-700 hover:border-brand-500 text-white hover:text-brand-400 rounded-xl px-3 py-1.5 text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          {opt.label}
                          <ChevronRight className="w-3 h-3 text-dark-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleCustomTextSend} className="border-t border-dark-800 p-3 bg-dark-950/40 flex gap-2">
              <input
                type="text"
                placeholder="Describe your car issue..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-dark-900 border border-dark-750 focus:border-brand-500 rounded-xl px-4 py-2 text-xs text-white placeholder-dark-450 flex-1 outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-8.5 h-8.5 rounded-xl bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white flex-shrink-0 shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
