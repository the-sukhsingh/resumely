'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Bot, User, Loader2, Trash2, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Id } from '../../../convex/_generated/dataModel';
import Markdown from 'react-markdown';

export default function ChatPanel({ versionId }: { versionId: Id<'resumeVersions'> }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const history = useQuery(api.chatHistory.getChatHistoryByVersion, { resumeVersionId: versionId });
  const messages = history ? [...history].reverse() : [];

  const sendMessage = useAction(api.resumeVersions.chat);
  const clearHistory = useMutation(api.chatHistory.clearChatHistory);

  const suggestions = [
    'Rewrite my summary to sound more senior and concise.',
    'Add keywords for a Product Manager role in fintech.',
    'Improve this bullet: "Led migrations for legacy systems".',
    'Check ATS compatibility for this resume section.',
    'Quantify impact for my last two roles.',
    'Make my project descriptions more action-oriented.'
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    try {
      await sendMessage({ versionId, message: text });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    if (e.shiftKey) return;
    e.preventDefault();
    void handleSend();
  };

  async function handleClear() {
    await clearHistory({ resumeVersionId: versionId });
  }

  function handleSuggestion(text: string) {
    setInput(text);
    textareaRef.current?.focus();
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive absolute top-1 right-2 p-1 cursor-pointer z-10"
            onClick={handleClear}
            title="Clear conversation"
          >
                <svg viewBox="0 0 24 24" className="size-full" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"/><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/><g id="SVGRepo_iconCarrier"> <path d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z" className="fill-[#000000] dark:fill-[#ffffff]"/> <path d="M9.42543 11.4815C9.83759 11.4381 10.2051 11.7547 10.2463 12.1885L10.7463 17.4517C10.7875 17.8855 10.4868 18.2724 10.0747 18.3158C9.66253 18.3592 9.29499 18.0426 9.25378 17.6088L8.75378 12.3456C8.71256 11.9118 9.01327 11.5249 9.42543 11.4815Z" className="fill-[#000000] dark:fill-[#ffffff]" fillRule="evenodd" clipRule="evenodd"/> <path d="M14.5747 11.4815C14.9868 11.5249 15.2875 11.9118 15.2463 12.3456L14.7463 17.6088C14.7051 18.0426 14.3376 18.3592 13.9254 18.3158C13.5133 18.2724 13.2126 17.8855 13.2538 17.4517L13.7538 12.1885C13.795 11.7547 14.1625 11.4381 14.5747 11.4815Z" className="fill-[#000000] dark:fill-[#ffffff]" fillRule="evenodd" clipRule="evenodd"/> <path opacity="0.3" d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12405C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001Z" className="fill-[#000000] dark:fill-[#ffffff]"/> </g></svg>
          </Button>
        )}

      {/* Messages */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="relative overflow-hidden rounded-3xl border bg-background p-6 sm:p-8">
              <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-muted/70 blur-3xl" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground/80">
                    <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                    Resume Copilot
                  </div>
                  <span className="text-xs text-muted-foreground">Powered by your resume data</span>
                </div>
                <div className="mt-4 flex items-start gap-4">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold tracking-tight">Shape your resume like a hiring manager</p>
                    <p className="text-sm text-muted-foreground max-w-136">
                      Ask for focused rewrites, keyword alignment, and measurable impact. Start with a prompt below or type your own.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Try one</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestions.map((text) => (
                      <Button
                        key={text}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-auto justify-start whitespace-normal rounded-full border-muted-foreground/20 bg-background px-4 py-2 text-left text-xs text-foreground/90 hover:bg-muted/60"
                        onClick={() => handleSuggestion(text)}
                      >
                        {text}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg._id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'}`}>
                {msg.role === 'assistant'
                  ? <Bot className="h-3.5 w-3.5 text-primary" />
                  : <User className="h-3.5 w-3.5" />}
              </div>
              <div className={`rounded-2xl px-3 py-2 text-sm max-w-[85%] ${msg.role === 'assistant' ? 'bg-muted rounded-tl-md' : 'bg-primary text-primary-foreground rounded-br-md'}`}>
                <Markdown>{
                  msg.role === 'assistant' ? msg.content : msg.content.slice(0, 300) + "..."
                  }</Markdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2">
              <div className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center bg-primary/10">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 text-sm flex items-center gap-1.5 text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-accent/70">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask, search, or make anything..."
            className="flex-1 resize-none bg-transparent text-sm focus:outline-none disabled:opacity-50 placeholder:text-muted-foreground min-h-20 max-h-30 leading-5 px-3 py-2"
          />
          <Button
            size="icon"
            className="h-8 w-8 shrink-0 rounded-lg"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
