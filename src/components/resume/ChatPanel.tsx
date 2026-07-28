'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Loader2, Trash2, ArrowUp, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Id } from '../../../convex/_generated/dataModel';
import Markdown from 'react-markdown';
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
} from '@/components/ui/message-scroller';
import {
  Message,
  MessageContent,
} from '@/components/ui/message';
import {
  Bubble,
  BubbleContent,
} from '@/components/ui/bubble';
import { cn } from '@/lib/utils';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { KEY_ENTER_COMMAND, KEY_BACKSPACE_COMMAND, COMMAND_PRIORITY_HIGH, CLEAR_EDITOR_COMMAND, $getRoot, $createParagraphNode, $createTextNode, LexicalEditor, DecoratorNode, NodeKey, SerializedLexicalNode, EditorConfig, LexicalNode, $isElementNode, $getSelection, $isRangeSelection } from 'lexical';

export type SerializedSectionBadgeNode = SerializedLexicalNode & {
  sectionId: string;
  sectionName: string;
};

export class SectionBadgeNode extends DecoratorNode<React.ReactNode> {
  __sectionId: string;
  __sectionName: string;

  static getType(): string {
    return 'section-badge';
  }

  static clone(node: SectionBadgeNode): SectionBadgeNode {
    return new SectionBadgeNode(node.__sectionId, node.__sectionName, node.__key);
  }

  static importJSON(serializedNode: SerializedSectionBadgeNode): SectionBadgeNode {
    return new SectionBadgeNode(serializedNode.sectionId, serializedNode.sectionName);
  }

  exportJSON(): SerializedSectionBadgeNode {
    return {
      type: 'section-badge',
      version: 1,
      sectionId: this.__sectionId,
      sectionName: this.__sectionName,
    };
  }

  constructor(sectionId: string, sectionName: string, key?: NodeKey) {
    super(key);
    this.__sectionId = sectionId;
    this.__sectionName = sectionName;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.verticalAlign = 'middle';
    return span;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): boolean {
    return true;
  }

  getTextContent(): string {
    return "";
  }

  decorate(): React.ReactNode {
    return <InlineBadge sectionId={this.__sectionId} sectionName={this.__sectionName} />;
  }
}

const ChatPanelContext = React.createContext<{
  badgeSelected: boolean;
  setBadgeSelected: (val: boolean) => void;
  setFocusedSection: (val: string | null) => void;
  removeBadgeNode: () => void;
} | null>(null);

function InlineBadge({ sectionId, sectionName }: { sectionId: string; sectionName: string }) {
  const context = React.useContext(ChatPanelContext);
  if (!context) return null;
  const { badgeSelected, setBadgeSelected, setFocusedSection, removeBadgeNode } = context;

  return (
    <span
      contentEditable={false}
      className={cn(
        "inline-flex items-center gap-1 border rounded-md px-2 py-0.5 text-xs font-semibold select-none shrink-0 transition-all duration-300 ease-in-out mr-2 align-middle",
        badgeSelected
          ? "bg-destructive/10 text-destructive border-destructive shadow-sm"
          : "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20"
      )}
    >
      @{sectionName}
      <span className={cn(
        "overflow-hidden flex items-center transition-all duration-300 ease-in-out",
        badgeSelected ? "w-2 opacity-100 ml-1" : "w-0 opacity-0"
      )}>
        <button
          type="button"
          onClick={() => {
            setFocusedSection(null);
            setBadgeSelected(false);
            removeBadgeNode();
          }}
          className="text-destructive"
        >
          <X size={10} />
        </button>
      </span>
    </span>
  );
}

const initialConfig = {
  namespace: 'ChatEditor',
  theme: {},
  nodes: [SectionBadgeNode],
  onError: (error: Error) => {
    console.error(error);
  },
};

function SubmitOnEnterPlugin({
  onSubmit,
  menuOpen,
  onSelectHighlighted,
}: {
  onSubmit: (text?: string) => void;
  menuOpen: boolean;
  onSelectHighlighted: () => void;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        if (event && !event.shiftKey) {
          event.preventDefault();
          if (menuOpen) {
            onSelectHighlighted();
            return true;
          }
          const text = editor.getEditorState().read(() => $getRoot().getTextContent()).trim();
          if (text.length >= 3) {
            onSubmit(text);
          }
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, onSubmit, menuOpen, onSelectHighlighted]);
  return null;
}

function MenuNavigationPlugin({
  menuOpen,
  onArrowUp,
  onArrowDown,
  onEscape,
}: {
  menuOpen: boolean;
  onArrowUp: () => void;
  onArrowDown: () => void;
  onEscape: () => void;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!menuOpen) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        onArrowDown();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        onArrowUp();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }
    };
    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (rootElement) {
        rootElement.addEventListener('keydown', handleKeyDown, true);
      }
      if (prevRootElement) {
        prevRootElement.removeEventListener('keydown', handleKeyDown, true);
      }
    });
  }, [editor, menuOpen, onArrowDown, onArrowUp, onEscape]);
  return null;
}

function KeyboardBackspacePlugin({
  focusedSection,
  badgeSelected,
  setBadgeSelected,
  onRemoveSection,
}: {
  focusedSection: string | null;
  badgeSelected: boolean;
  setBadgeSelected: (selected: boolean) => void;
  onRemoveSection: () => void;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event: KeyboardEvent) => {
        if (!focusedSection) return false;
        const selection = $getSelection();
        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const anchor = selection.anchor;
          
          let isRightOfBadge = false;
          
          if (anchor.type === 'text') {
            const anchorNode = anchor.getNode();
            const offset = anchor.offset;
            if (offset === 0) {
              const prevSibling = anchorNode.getPreviousSibling();
              if (prevSibling instanceof SectionBadgeNode) {
                isRightOfBadge = true;
              }
            }
          } else if (anchor.type === 'element') {
            const anchorNode = anchor.getNode();
            const offset = anchor.offset;
            if ($isElementNode(anchorNode)) {
              const prevNode = anchorNode.getChildAtIndex(offset - 1);
              if (prevNode instanceof SectionBadgeNode) {
                isRightOfBadge = true;
              }
            }
          }
          
          if (isRightOfBadge) {
            event.preventDefault();
            if (!badgeSelected) {
              setBadgeSelected(true);
            } else {
              onRemoveSection();
            }
            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, focusedSection, badgeSelected, setBadgeSelected, onRemoveSection]);
  return null;
}

function EditorRefPlugin({ editorRef }: { editorRef: React.MutableRefObject<LexicalEditor | null> }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editorRef.current = editor;
    return () => {
      editorRef.current = null;
    };
  }, [editor, editorRef]);
  return null;
}

function ScrollToEndTrigger({ loading }: { loading: boolean }) {
  const { scrollToEnd } = useMessageScroller();
  useEffect(() => {
    if (loading) {
      scrollToEnd({ behavior: 'smooth' });
    }
  }, [loading, scrollToEnd]);
  return null;
}

export default function ChatPanel({ versionId }: { versionId: Id<'resumeVersions'> }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<LexicalEditor | null>(null);

  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const [badgeSelected, setBadgeSelected] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const removeBadgeNode = () => {
    if (editorRef.current) {
      editorRef.current.update(() => {
        const root = $getRoot();
        const nodes = root.getChildren();
        for (const node of nodes) {
          if (node instanceof SectionBadgeNode) {
            node.remove();
          }
          if ($isElementNode(node)) {
            for (const child of node.getChildren()) {
              if (child instanceof SectionBadgeNode) {
                child.remove();
              }
            }
          }
        }
      });
    }
  };

  const sections = [
    { id: "personalInfo", name: "Personal Info" },
    { id: "summary", name: "Summary" },
    { id: "experience", name: "Experience" },
    { id: "education", name: "Education" },
    { id: "skills", name: "Skills" },
    { id: "projects", name: "Projects" },
    { id: "certifications", name: "Certifications" },
    { id: "achievements", name: "Achievements" },
  ];

  const match = input.match(/@(\w*)$/);
  const query = match ? match[1] : "";
  const filteredSections = sections.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  // Scroll active item into view
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      const activeEl = menuRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center' });
      }
    }
  }, [selectedIndex, menuOpen]);

  // Clamp selectedIndex when filteredSections size changes
  useEffect(() => {
    if (selectedIndex >= filteredSections.length) {
      setSelectedIndex(0);
    }
  }, [filteredSections.length, selectedIndex]);

  const history = useQuery(api.chatHistory.getChatHistoryByVersion, { resumeVersionId: versionId });
  const messages = history ? [...history].reverse() : [];

  const sendMessage = useAction(api.resumeVersions.chat);
  const clearHistory = useMutation(api.chatHistory.clearChatHistory);
  const deleteMessage = useMutation(api.chatHistory.deleteChatMessage);
  const undoEdits = useMutation(api.chatHistory.undoMessageEdits);

  const suggestions = [
    'Write cover letter for this resume.',
    'Rewrite my summary to sound more senior and concise.',
    'Add keywords for a Product Manager role in fintech.',
    'Improve this bullet: "Led migrations for legacy systems".',
    'Check ATS compatibility for this resume section.',
    'Quantify impact for my last two roles.',
    'Make my project descriptions more action-oriented.'
  ];

  async function handleSend(customText?: string) {
    const text = (customText !== undefined ? customText : input).trim();
    if (!text && !focusedSection) return;
    if (text.length > 0 && text.length < 3) return;
    if (loading) return;
    setInput('');
    if (editorRef.current) {
      editorRef.current.update(() => {
        const root = $getRoot();
        root.clear();
        const p = $createParagraphNode();
        root.append(p);
      });
    }
    setLoading(true);
    const sectionToFocus = focusedSection;
    setFocusedSection(null);
    setBadgeSelected(false);
    try {
      await sendMessage({ versionId, message: text, focusSection: sectionToFocus || undefined });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    await clearHistory({ resumeVersionId: versionId });
  }

  const selectSection = (section: typeof sections[0]) => {
    setBadgeSelected(false);
    setMenuOpen(false);
    if (editorRef.current) {
      editorRef.current.update(() => {
        const root = $getRoot();
        
        // Remove existing badge nodes first
        const nodes = root.getChildren();
        for (const node of nodes) {
          if (node instanceof SectionBadgeNode) {
            node.remove();
          }
          if ($isElementNode(node)) {
            for (const child of node.getChildren()) {
              if (child instanceof SectionBadgeNode) {
                child.remove();
              }
            }
          }
        }

        const text = root.getTextContent();
        const match = text.match(/@\w*$/);
        if (match) {
          const index = text.lastIndexOf(match[0]);
          const newText = text.substring(0, index);
          root.clear();
          const p = $createParagraphNode();
          p.append($createTextNode(newText));
          const badgeNode = new SectionBadgeNode(section.id, section.name);
          p.append(badgeNode);
          
          // Create a trailing empty text node and select it to position the cursor
          const textNode = $createTextNode("");
          p.append(textNode);
          root.append(p);
          
          textNode.select();
        }
      });
      setTimeout(() => {
        editorRef.current?.focus();
      }, 50);
    }
  };

  function handleSuggestion(text: string) {
    setInput(text);
    setBadgeSelected(false);
    if (editorRef.current) {
      editorRef.current.update(() => {
        const root = $getRoot();
        root.clear();
        const p = $createParagraphNode();
        p.append($createTextNode(text));
        root.append(p);
      });
      editorRef.current.focus();
    }
  }

  async function handleDeleteMessage(messageId: Id<'chatHistory'>) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteMessage({ messageId });
    } catch (e) {
      console.error('Failed to delete message:', e);
    }
  }

  async function handleUndo(messageId: Id<'chatHistory'>) {
    if (!confirm('Are you sure you want to undo the changes made by this message?')) return;
    try {
      await undoEdits({ messageId });
    } catch (e) {
      console.error('Failed to undo changes:', e);
    }
  }

  return (
    <ChatPanelContext.Provider
      value={{
        badgeSelected,
        setBadgeSelected,
        setFocusedSection,
        removeBadgeNode,
      }}
    >
      <div className="h-full flex flex-col relative">
      {/* Header */}
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive absolute top-1 right-1 p-1 cursor-pointer z-10"
            onClick={handleClear}
            title="Clear conversation"
          >
                <svg viewBox="0 0 24 24" className="size-full" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"/><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/><g id="SVGRepo_iconCarrier"> <path d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z" className="fill-[#000000] dark:fill-[#ffffff]"/> <path d="M9.42543 11.4815C9.83759 11.4381 10.2051 11.7547 10.2463 12.1885L10.7463 17.4517C10.7875 17.8855 10.4868 18.2724 10.0747 18.3158C9.66253 18.3592 9.29499 18.0426 9.25378 17.6088L8.75378 12.3456C8.71256 11.9118 9.01327 11.5249 9.42543 11.4815Z" className="fill-[#000000] dark:fill-[#ffffff]" fillRule="evenodd" clipRule="evenodd"/> <path d="M14.5747 11.4815C14.9868 11.5249 15.2875 11.9118 15.2463 12.3456L14.7463 17.6088C14.7051 18.0426 14.3376 18.3592 13.9254 18.3158C13.5133 18.2724 13.2126 17.8855 13.2538 17.4517L13.7538 12.1885C13.795 11.7547 14.1625 11.4381 14.5747 11.4815Z" className="fill-[#000000] dark:fill-[#ffffff]" fillRule="evenodd" clipRule="evenodd"/> <path opacity="0.3" d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12405C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001Z" className="fill-[#000000] dark:fill-[#ffffff]"/> </g></svg>
          </Button>
        )}

      {/* Messages */}
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent className="gap-4 pt-10">
              <ScrollToEndTrigger loading={loading} />
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
                <MessageScrollerItem
                  key={msg._id}
                  messageId={msg._id}
                  scrollAnchor={msg.role === 'user'}
                >
                  <Message align={msg.role === 'user' ? 'end' : 'start'} className={cn(
                          msg.role === 'assistant' && "w-full max-w-full"
                        )}>
                    <MessageContent className={cn(
                          msg.role === 'assistant' && "w-full max-w-full"
                        )}>
                      <div
                        data-slot="bubble-wrapper"
                        className={`flex items-center gap-2 w-full max-w-[85%] group-data-[align=end]/message:self-end ${msg.role === 'user' ? 'flex-row-reverse' : 'max-w-full'}`}
                      >
                        <Bubble variant={msg.role === 'user' ? 'default' : 'muted'} className={cn(
                          msg.role === 'assistant' && "w-full max-w-full", "text-pretty"
                        )}>
                          <BubbleContent>
                            {msg.role === 'user' && msg.focusSection && (
                              <span className="inline-flex items-center gap-1 mb-2 border rounded-md px-2 py-0.5 text-xs font-semibold select-none bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
                                @{msg.focusSection}
                              </span>
                            )}
                            <Markdown>
                              {msg.role === 'assistant' ? msg.content : msg.content.slice(0, 300) + "..."}
                            </Markdown>
                          </BubbleContent>
                        </Bubble>

                        <div className="flex items-center gap-0.5 opacity-0 group-hover/message:opacity-100 transition-opacity duration-150 shrink-0">
                          {msg.role === 'assistant' && msg.undoSnapshot && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted p-0"
                              onClick={() => handleUndo(msg._id)}
                              title="Undo edits made by this response"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => deleteMessage({ messageId: msg._id })}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}

              {loading && (
                <MessageScrollerItem messageId="loading">
                  <Message align="start">
                    <MessageContent>
                      <Bubble variant="muted">
                        <BubbleContent className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

        {/* Input */}
        <div className="border-t bg-[#202020]/5 dark:bg-[#202020]/20 relative">
          {menuOpen && filteredSections.length > 0 && (
            <div ref={menuRef} className="absolute bottom-full left-2 right-2 mb-2 bg-popover border text-popover-foreground rounded-xl shadow-xl overflow-hidden scrollbar-none scroll-fade-y z-50 animate-in slide-in-from-bottom-2 duration-150 p-1 flex flex-col gap-0.5 max-h-48 overflow-y-auto py-1 overscroll-none">
              {filteredSections.map((section, idx) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => selectSection(section)}
                  data-active={idx === selectedIndex}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                    idx === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 text-foreground/90"
                  )}
                >
                  <span className="text-muted-foreground">@</span>
                  {section.name}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 p-2">
            <div className="flex-1 relative flex items-start border rounded-lg px-3 py-2 bg-background focus-within:ring-1 focus-within:ring-primary min-h-12">
              <div className="flex-1 relative self-stretch min-h-[24px]">
                <LexicalComposer initialConfig={initialConfig}>
                  <PlainTextPlugin
                    contentEditable={
                      <ContentEditable className="bg-transparent text-sm focus:outline-none disabled:opacity-50 min-h-[24px] max-h-30 leading-5 py-0.5 overflow-y-auto outline-none  w-full lexical-editor-container scrollbar-none pr-4" />
                    }
                    placeholder={
                      <div className="absolute top-1 left-0 text-muted-foreground text-sm pointer-events-none select-none">
                        Ask, search, or make anything...
                      </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <OnChangePlugin
                    onChange={(editorState) => {
                      editorState.read(() => {
                        const root = $getRoot();
                        const text = root.getTextContent();
                        setInput(text);
                        if (text.length > 0) {
                          setBadgeSelected(false);
                        }
                        
                        // Sync focusedSection status with the presence of SectionBadgeNode in the editor
                        let foundSection: string | null = null;
                        const nodes = root.getChildren();
                        for (const node of nodes) {
                          if (node instanceof SectionBadgeNode) {
                            foundSection = node.__sectionId;
                            break;
                          }
                          if ($isElementNode(node)) {
                            for (const child of node.getChildren()) {
                              if (child instanceof SectionBadgeNode) {
                                foundSection = child.__sectionId;
                                break;
                              }
                            }
                          }
                        }
                        
                        if (foundSection !== focusedSection) {
                          setFocusedSection(foundSection);
                          if (!foundSection) {
                            setBadgeSelected(false);
                          }
                        }

                        const match = text.match(/@(\w*)$/);
                        if (match) {
                          setMenuOpen(true);
                        } else {
                          setMenuOpen(false);
                        }
                      });
                    }}
                  />
                  <SubmitOnEnterPlugin
                    onSubmit={handleSend}
                    menuOpen={menuOpen}
                    onSelectHighlighted={() => {
                      if (filteredSections[selectedIndex]) {
                        selectSection(filteredSections[selectedIndex]);
                      }
                    }}
                  />
                  <MenuNavigationPlugin
                    menuOpen={menuOpen}
                    onArrowUp={() => {
                      setSelectedIndex((prev) => (prev - 1 + filteredSections.length) % filteredSections.length);
                    }}
                    onArrowDown={() => {
                      setSelectedIndex((prev) => (prev + 1) % filteredSections.length);
                    }}
                    onEscape={() => {
                      setMenuOpen(false);
                    }}
                  />
                  <KeyboardBackspacePlugin
                    focusedSection={focusedSection}
                    badgeSelected={badgeSelected}
                    setBadgeSelected={setBadgeSelected}
                    onRemoveSection={() => {
                      setFocusedSection(null);
                      setBadgeSelected(false);
                      removeBadgeNode();
                    }}
                  />
                  <EditorRefPlugin editorRef={editorRef} />
                  <HistoryPlugin />
                </LexicalComposer>
              </div>
            </div>
            <Button
              size="icon"
              className="h-8 w-8 shrink-0 rounded-md mb-2 mr-2 absolute right-1 bottom-1"
              onClick={() => handleSend()}
              disabled={loading || (!input.trim() && !focusedSection) || (input.trim().length > 0 && input.trim().length < 3)}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </ChatPanelContext.Provider>
  );
}
