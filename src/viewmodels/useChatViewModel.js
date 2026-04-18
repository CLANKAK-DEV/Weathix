import { useCallback, useEffect, useRef, useState } from 'react';
import { getWeatherAIResponse, getDailyUsage } from '../services/nvidiaAIService';
import { botMessage, errorMessage, userMessage } from '../models/ChatMessageModel';

const GREETING = botMessage(
  "Hi! I'm your AI Weather Assistant. Ask me anything about the weather conditions, forecasts, or get weather tips!"
);

export function useChatViewModel(weather) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(getDailyUsage());
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const ask = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || loading) return;

    setMessages((m) => [...m, userMessage(trimmed)]);
    setLoading(true);
    try {
      const result = await getWeatherAIResponse(trimmed, weather);
      if (result.error) setMessages((m) => [...m, errorMessage(result.error)]);
      else setMessages((m) => [...m, botMessage(result.response)]);
      setUsage(getDailyUsage());
    } catch {
      setMessages((m) => [...m, errorMessage('Sorry, something went wrong. Please try again.')]);
    } finally {
      setLoading(false);
    }
  }, [loading, weather]);

  const submit = useCallback(async (e) => {
    e?.preventDefault?.();
    const text = input;
    setInput('');
    await ask(text);
  }, [input, ask]);

  const toggleOpen = useCallback(() => setOpen((v) => !v), []);

  return {
    open,
    toggleOpen,
    messages,
    input,
    setInput,
    loading,
    usage,
    listRef,
    submit,
    ask,
  };
}
