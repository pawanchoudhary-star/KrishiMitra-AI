import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Bot, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

export default function Chatbot() {
  const { lang } = useLanguage();
  const chatEndRef = useRef(null);
  const location = useLocation();

  // Suggestion chips based on language
  const suggestions = lang === 'hi' ? [
    { text: '🌾 फसल के रोग और उनका इलाज', label: '🌾 फसल रोग' },
    { text: '🌦️ आज का मौसम और कृषि सलाह', label: '🌦️ मौसम सलाह' },
    { text: '💰 ताजा मंडी भाव कैसे देखें?', label: '💰 मंडी भाव' },
    { text: '📋 मुख्य सरकारी कृषि योजनाएं', label: '📋 सरकारी योजनाएं' }
  ] : [
    { text: '🌾 Crop diseases and their cure', label: '🌾 Crop Diseases' },
    { text: '🌦️ Today\'s weather and farming advice', label: '🌦️ Weather Advice' },
    { text: '💰 How to check latest Mandi prices?', label: '💰 Mandi Prices' },
    { text: '📋 Key government schemes for farmers', label: '📋 Govt Schemes' }
  ];

  const defaultWelcome = lang === 'hi' 
    ? 'Namaste! Main KrishiMitra AI hu. Fasal ke rog, mausam, mandi bhav ya sarkari yojnao ke bare me kuchhein.'
    : 'Namaste! I am KrishiMitra AI. Ask me about crop care, weather, mandi rates, or government schemes.';

  const [messages, setMessages] = useState([
    { role: 'model', text: defaultWelcome }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If voice query is passed via URL, send it immediately
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q');
    if (initialQuery) {
      handleSend(initialQuery);
      // Remove query param to prevent resending on reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || isLoading) return;
    
    const userMsg = textToSend.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Send chat request to our local backend proxy server
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: messages,
          userMsg: userMsg
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `Server returned error status ${res.status}`);
      }

      const data = await res.json();
      const responseText = data.text;
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      let errorMsg = error?.message || "Unknown error";
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `Maaf karna, ek error aayi hai: ${errorMsg}. Kripya check karein ki backend server chalu hai ya nahi.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: '-20px', padding: '20px', background: 'var(--bg-color)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
          <Link to="/" style={{ color: 'var(--text-dark)' }}>
            <ArrowLeft size={28} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '22px', 
              background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
            }}>
              <Bot size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 className="page-title" style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>KrishiMitra AI</h1>
                <Sparkles size={16} color="var(--accent-yellow)" style={{ animation: 'bounce 2s infinite' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                <span className="text-sm" style={{ color: 'var(--primary-green-dark)', fontWeight: '600', fontSize: '12px' }}>Online & Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: '8px',
              animation: 'fadeIn 0.3s ease-out forwards'
            }}>
              {msg.role === 'model' && (
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '16px', 
                  background: 'var(--bg-color)', 
                  border: '1.5px solid var(--primary-green)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--primary-green-dark)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}>
                  <Bot size={18} />
                </div>
              )}
              <div style={{ 
                maxWidth: '80%', 
                padding: '12px 18px', 
                borderRadius: '20px', 
                background: msg.role === 'user' 
                  ? 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%)' 
                  : 'white',
                color: msg.role === 'user' ? 'white' : 'var(--text-dark)',
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 2px 10px rgba(0,0,0,0.05)',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '20px',
                borderBottomLeftRadius: msg.role === 'model' ? '4px' : '20px',
                fontSize: '15px',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Suggestion Chips */}
          {messages.length === 1 && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px', 
              marginTop: '10px', 
              padding: '12px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '20px',
              border: '1px solid var(--glass-border)'
            }}>
              <span className="text-sm" style={{ fontWeight: '600', color: 'var(--primary-green-dark)', fontSize: '13px' }}>
                {lang === 'hi' ? 'त्वरित प्रश्न पूछें:' : 'Ask a quick question:'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {suggestions.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(chip.text)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '16px',
                      border: '1.5px solid var(--primary-green-light)',
                      background: 'white',
                      color: 'var(--primary-green-dark)',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'var(--primary-green-light)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = 'var(--primary-green-dark)';
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', background: 'white', maxWidth: '80px', borderRadius: '20px', borderBottomLeftRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
               <span style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'var(--primary-green)', animation: 'pulse 1s infinite' }}></span>
               <span style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'var(--primary-green)', animation: 'pulse 1s infinite 0.2s' }}></span>
               <span style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'var(--primary-green)', animation: 'pulse 1s infinite 0.4s' }}></span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          background: 'white', 
          padding: '8px 12px 8px 18px', 
          borderRadius: '30px', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)', 
          border: '1.5px solid var(--glass-border)',
          marginBottom: '80px',
          alignItems: 'center'
        }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder={lang === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 'Type your query here...'}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', padding: '8px 0', color: 'var(--text-dark)' }}
          />
          <button 
            onClick={() => handleSend()} 
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '21px', 
              background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%)', 
              border: 'none', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
              transition: 'transform 0.1s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Send size={18} style={{ marginLeft: '2px' }} />
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
