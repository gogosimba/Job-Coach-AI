import { useState, useRef, useEffect } from 'react';

const AudioWaveform = ({ isActive }) => {
  return (
    <div
      className={`flex items-center space-x-1 h-6 ${
        isActive ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full ${
            isActive ? 'animate-sound-wave' : 'h-1'
          }`}
          style={{
            height: isActive ? `${Math.random() * 12 + 4}px` : '4px',
            animationDelay: `${i * 0.1}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default function Chat({
  role,
  onBack,
  language = 'en',
  languageData,
  roleTranslations,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptConfidence, setTranscriptConfidence] = useState(0);
  const [voiceMode, setVoiceMode] = useState(false);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] =
    useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] =
    useState(false);
  const [speechVoices, setSpeechVoices] = useState([]);
  const [conversationActive, setConversationActive] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const syntheticPauseRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    setSpeechSynthesisSupported(!!synth);

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setSpeechVoices(availableVoices);
    };

    if (synth) {
      loadVoices();

      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechRecognitionSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // For continuous listening during conversation
      recognitionRef.current.interimResults = true; // Show interim results for better feedback
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'sv-SE';

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        let isFinal = false;
        let finalConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            currentTranscript += transcript + ' ';
            isFinal = true;
            finalConfidence = event.results[i][0].confidence;
          } else {
            setInterimTranscript(transcript);
          }
        }

        if (isFinal) {
          setTranscriptConfidence(finalConfidence);
          setInterimTranscript('');

          const finalTranscript = currentTranscript.trim();
          setInput(finalTranscript);

          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (
              finalTranscript.length > 2 &&
              !isSpeaking &&
              conversationActive
            ) {
              handleSubmit(null, finalTranscript);
            }
          }, 1500); // 1.5 second silence indicates end of speech
        }
      };

      recognitionRef.current.onend = () => {
        if (conversationActive && !isSpeaking) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Recognition already started');
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);

        if (event.error === 'no-speech') {
          return;
        }
        setIsListening(false);
        setConversationActive(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      if (syntheticPauseRef.current) {
        clearTimeout(syntheticPauseRef.current);
      }

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      if (synth) {
        synth.cancel();
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [language]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'sv-SE';
    }
  }, [language]);

  useEffect(() => {
    const translatedRole =
      roleTranslations && roleTranslations[role]
        ? roleTranslations[role][language]
        : role;

    const welcomeMsg = languageData[language].welcomeMessage
      .replace('{role}', language === 'en' ? role : '')
      .replace('{roleTranslated}', language === 'sv' ? translatedRole : '');

    setMessages([
      {
        from: 'bot',
        text: welcomeMsg,
      },
    ]);
  }, [role, language, roleTranslations, languageData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [role]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (
      voiceMode &&
      lastMessage &&
      lastMessage.from === 'bot' &&
      conversationActive
    ) {
      speakText(lastMessage.text);
    }
  }, [messages, voiceMode, conversationActive]);

  const toggleConversation = () => {
    if (!speechRecognitionSupported || !speechSynthesisSupported) return;

    const newState = !conversationActive;
    setConversationActive(newState);

    if (newState) {
      setVoiceMode(true);
      startListening();
    } else {
      stopListening();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }
  };

  const startListening = () => {
    if (!speechRecognitionSupported) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error('Could not start speech recognition', e);
    }
  };

  const stopListening = () => {
    if (!speechRecognitionSupported) return;

    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.log('Recognition already stopped');
    }
    setIsListening(false);
    clearTimeout(silenceTimerRef.current);
  };

  const speakText = (text) => {
    if (!speechSynthesisSupported) return;

    const synth = window.speechSynthesis;

    synth.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : 'sv-SE';

    const langPrefix = language === 'en' ? 'en' : 'sv';
    const voiceForLanguage = speechVoices.find((voice) =>
      voice.lang.startsWith(langPrefix)
    );

    if (voiceForLanguage) {
      utterance.voice = voiceForLanguage;
    }

    utterance.onend = () => {
      setIsSpeaking(false);

      if (conversationActive && speechRecognitionSupported) {
        setTimeout(() => {
          startListening();
        }, 300);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synth.speak(utterance);
  };

  async function handleSubmit(e, voiceInput = null) {
    e?.preventDefault();

    const textToSend = voiceInput || input;

    if (!textToSend.trim() || loading) return;

    const userMessage = { from: 'user', text: textToSend.trim() };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setInterimTranscript('');
    setLoading(true);

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Recognition already stopped');
      }
      setIsListening(false);
    }

    const translatedRole =
      roleTranslations && roleTranslations[role]
        ? roleTranslations[role][language]
        : role;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const apiMessages = [
      {
        role: 'system',
        content: `You are an HR interviewer named Emma conducting a job interview for a ${translatedRole} position. ${
          language === 'sv' ? 'Respond in Swedish.' : 'Respond in English.'
        } Be professional but friendly, ask relevant interview questions, and provide constructive feedback. Follow a realistic interview flow. If the user says "start", begin with a common interview question for this role. Keep responses concise but helpful and always stay in character as an interviewer.`,
      },
      ...currentMessages.slice(-8).map((msg) => ({
        // Send last N messages for context
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
    ];

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: apiMessages,
            max_tokens: 300,
            temperature: 0.7,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: { message: 'Unknown API error' } }));
        throw new Error(
          `API error: ${response.status} - ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      const botText = data.choices[0].message.content.trim();

      setMessages((prev) => [...prev, { from: 'bot', text: botText }]);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text: languageData[language].errorMessage },
        ]);
        console.error('Error:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col h-[32rem] bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden'>
      {/* Header with back button and voice toggle */}
      <div className='p-4 border-b border-slate-200 dark:border-slate-700 flex items-center'>
        <button
          onClick={onBack}
          className='p-1 mr-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors'
        >
          <span className='block p-1'>←</span>
        </button>
        <h2 className='text-xl font-semibold text-slate-800 dark:text-slate-200 flex-grow'>
          {roleTranslations[role] && roleTranslations[role][language]
            ? roleTranslations[role][language]
            : role}{' '}
          {languageData[language].interviewPractice}
        </h2>

        {/* Voice mode toggle with improved indicator */}
        <div className='flex items-center'>
          <div
            className={`mr-2 px-1 py-0.5 rounded text-xs ${
              isSpeaking
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'hidden'
            }`}
          >
            {isSpeaking ? '🔊' : ''}
          </div>

          <button
            onClick={toggleConversation}
            disabled={!speechSynthesisSupported || !speechRecognitionSupported}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
              conversationActive
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
            } ${
              !speechSynthesisSupported || !speechRecognitionSupported
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-indigo-500'
            }`}
            title={
              speechSynthesisSupported && speechRecognitionSupported
                ? undefined
                : languageData[language].voiceUnavailable
            }
          >
            {conversationActive ? (
              <>
                <span>🎙️</span>
                <span className='hidden sm:inline'>
                  {languageData[language].voiceInteraction}
                </span>
              </>
            ) : (
              <>
                <span>💬</span>
                <span className='hidden sm:inline'>
                  {languageData[language].textInteraction}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div className='flex-grow overflow-y-auto p-4 space-y-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.from === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-3/4 rounded-lg px-4 py-2 ${
                message.from === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className='flex justify-start'>
            <div className='bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-4 py-2 max-w-3/4'>
              <div className='flex space-x-2'>
                <div
                  className='w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce'
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className='w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce'
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className='w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce'
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Show interim transcript in conversation mode */}
        {isListening && interimTranscript && (
          <div className='flex justify-end'>
            <div className='max-w-3/4 rounded-lg px-4 py-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 opacity-75'>
              {interimTranscript}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input form with enhanced voice UI */}
      <form
        onSubmit={handleSubmit}
        className='p-4 border-t border-slate-200 dark:border-slate-700'
      >
        <div className='flex items-center space-x-2'>
          {/* Voice visualization and mic button */}
          {speechRecognitionSupported && (
            <button
              type='button'
              onClick={startListening}
              disabled={conversationActive || loading}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
              } ${
                conversationActive || loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {isListening ? '◼' : '🎙️'}
              {/* Confidence indicator when listening */}
              {isListening && (
                <span
                  className='absolute bottom-0 right-0 w-3 h-3 rounded-full'
                  style={{
                    backgroundColor:
                      transcriptConfidence > 0.8
                        ? '#10B981'
                        : transcriptConfidence > 0.5
                        ? '#F59E0B'
                        : '#EF4444',
                  }}
                />
              )}
            </button>
          )}

          {/* Audio waveform visualization - only in voice mode */}
          {conversationActive && (
            <div className='hidden sm:flex items-center h-10 px-2'>
              <AudioWaveform isActive={isListening && !isSpeaking} />
              {isSpeaking && (
                <div className='text-indigo-600 dark:text-indigo-400 animate-pulse'>
                  🔊
                </div>
              )}
            </div>
          )}

          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              if (conversationActive && isListening) {
                try {
                  recognitionRef.current.stop();
                } catch (e) {
                  console.log('Recognition already stopped');
                }
              }
            }}
            ref={inputRef}
            placeholder={
              isListening
                ? languageData[language].listeningText
                : isSpeaking
                ? '🔊 ' + languageData[language].inputPlaceholder
                : languageData[language].inputPlaceholder
            }
            className={`flex-grow rounded-lg border ${
              isListening
                ? 'border-red-300 dark:border-red-700'
                : isSpeaking
                ? 'border-green-300 dark:border-green-700'
                : 'border-slate-300 dark:border-slate-600'
            } px-4 py-2 
              bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
              focus:outline-none focus:ring-2 ${
                isListening
                  ? 'focus:ring-red-500'
                  : isSpeaking
                  ? 'focus:ring-green-500'
                  : 'focus:ring-indigo-500'
              }`}
            disabled={conversationActive && isListening}
          />
          <button
            type='submit'
            disabled={(!input.trim() && !conversationActive) || loading}
            className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 
                      disabled:bg-indigo-400 disabled:cursor-not-allowed
                      transition-colors duration-200'
          >
            {languageData[language].sendButton}
          </button>
        </div>

        {/* Voice mode indicator */}
        {conversationActive && (
          <div className='mt-2 text-center text-xs text-slate-500 dark:text-slate-400'>
            {isListening
              ? '🎙️ ' + languageData[language].listeningText
              : isSpeaking
              ? '🔊 Speaking...'
              : 'Voice conversation mode active'}
          </div>
        )}
      </form>
    </div>
  );
}
