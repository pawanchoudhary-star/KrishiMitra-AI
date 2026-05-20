import { Mic } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const toggleListening = () => {
    if (isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapka browser voice input support nahi karta hai.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Hindi recognition, can be dynamic
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      navigate(`/chat?q=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      alert("Aawaz theek se sunai nahi di. Kripya dobara koshish karein.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <button 
      className={`voice-fab ${isListening ? 'listening' : ''}`} 
      onClick={toggleListening}
      aria-label="Voice Assistant"
      style={{ 
        animation: isListening ? 'pulse-ring 1s infinite' : 'pulse-ring 2s infinite',
        transform: isListening ? 'scale(1.1)' : 'scale(1)'
      }}
    >
      <Mic size={28} color="white" />
    </button>
  );
}
