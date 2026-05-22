import { api } from '@/services/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SYSTEM_PROMPT =
  'You are MediScan AI Assistant. You help patients understand their medical reports. You can explain lab values, what abnormal results mean, suggest lifestyle changes, and recommend specialist types. Never diagnose, always recommend consulting a physician. Be warm, clear, and compassionate. Format responses with markdown when helpful.';

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
const useDirectAnthropic = import.meta.env.VITE_USE_DIRECT_ANTHROPIC === 'true';
const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

export const chatService = {
  async sendMessage(messages: ChatMessage[]) {
    if (useDirectAnthropic && anthropicApiKey) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 800,
          system: SYSTEM_PROMPT,
          messages: messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          content?: Array<{ type: string; text?: string }>;
        };
        const text = data.content?.find((block) => block.type === 'text')?.text;
        if (text) return text;
      }
    }

    try {
      const { data } = await api.post<{ content: string }>('/assistant/chat', {
        systemPrompt: SYSTEM_PROMPT,
        model: ANTHROPIC_MODEL,
        messages,
      });
      return data.content;
    } catch {
      const latest = messages[messages.length - 1]?.content ?? '';
      return `I can help with that. Based on your message: "${latest}", please share your recent value and unit so I can explain it clearly. I cannot diagnose, but I can suggest what to discuss with your doctor.`;
    }
  },
};

