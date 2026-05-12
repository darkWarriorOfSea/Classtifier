import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, IconButton, TextField, CircularProgress, Avatar } from '@mui/material';
import { Send, SmartToy, AutoAwesome, Mic, Add } from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';
import { getGeminiResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot: React.FC = () => {
  const { messages, addMessage, isLoading, setLoading } = useAppStore();
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    addMessage(userMessage, 'user');
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    const aiResponse = await getGeminiResponse(userMessage, history);
    addMessage(aiResponse, 'assistant');
    setLoading(false);
  };

  const suggestions = [
    "Summarize my next class",
    "How is my attendance?",
    "Tips for exams",
    "Schedule for tomorrow"
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Classtifier AI</Typography>
        <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>Powered by Gemini ✨</Typography>
      </Box>

      <Box 
        ref={scrollRef}
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          pb: 2,
          px: 1
        }}
      >
        {messages.length === 0 && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                <SmartToy sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary">How can I help you today?</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
              {suggestions.map((s) => (
                <Card 
                  key={s}
                  onClick={() => setInput(s)}
                  sx={{ 
                    cursor: 'pointer', 
                    p: 1.5, 
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{s}</Typography>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              <Box sx={{
                p: 2,
                borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                bgcolor: m.role === 'user' ? 'primary.main' : 'background.paper',
                color: m.role === 'user' ? 'white' : 'text.primary',
                boxShadow: m.role === 'user' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
                border: m.role === 'user' ? 'none' : '1px solid #E2E8F0',
              }}>
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <CircularProgress size={16} thickness={6} />
            <Typography variant="caption" color="text.secondary">AI is thinking...</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, pb: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          bgcolor: 'background.paper', 
          p: 0.5, 
          borderRadius: 4,
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
        }}>
          <IconButton size="small"><Add /></IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask anything..."
            variant="standard"
            slotProps={{ input: { disableUnderline: true, sx: { px: 1, py: 1, fontSize: '0.9rem' } } as any }}
          />
          <IconButton 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Send sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chatbot;
