"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Send, Trash2, HeartPulse, LogOut, ChevronDown,
  Menu, X, AlertTriangle, Bot, User as UserIcon, MessageSquare,
  FileDown, ImagePlus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale, type AppLocale } from "@/contexts/LocaleContext";
import { api } from "@/lib/api";
import { downloadChatPdf } from "@/lib/exportChatPdf";
import { MODES, type ChatMode } from "@/lib/modes";
import { ChatMarkdown } from "@/components/ChatMarkdown";

type Msg = {
  role: "user" | "assistant";
  content: string;
  crisis?: boolean;
  fallback?: boolean;
  knowledgeDb?: boolean;
};
type ConvSummary = { _id: string; title: string; mode: string; updatedAt: string };

function relativeTime(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ChatPage() {
  const { state, logout } = useAuth();
  const { locale, setLocale, t, supported } = useLocale();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("general");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConvSummary[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  const [attachBusy, setAttachBusy] = useState(false);
  const [attachHint, setAttachHint] = useState<string | null>(null);
  /** Larger composer text after OCR until send or new chat */
  const [inputOcrSized, setInputOcrSized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!state.loading && !state.user) {
      router.push("/login?callbackUrl=/chat");
    }
  }, [state.loading, state.user, router]);

  const fetchConversations = useCallback(async () => {
    if (!state.user) return;
    try {
      const data = await api.get<ConvSummary[]>("/api/conversations");
      setConversations(data);
    } catch { /* ignore */ }
  }, [state.user]);

  useEffect(() => { void fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  }

  async function loadConversation(id: string) {
    try {
      const conv = await api.get<ConvSummary & { messages: Msg[] }>(`/api/conversations/${id}`);
      setActiveConvId(id);
      setMode((conv.mode as ChatMode) ?? "general");
      setMessages(conv.messages);
      setSidebarOpen(false);
    } catch { /* ignore */ }
  }

  function newChat() {
    setActiveConvId(null);
    setMessages([]);
    setInput("");
    setInputOcrSized(false);
    setSidebarOpen(false);
    textareaRef.current?.focus();
  }

  async function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.delete(`/api/conversations/${id}`);
      if (activeConvId === id) newChat();
      setConversations((prev) => prev.filter((c) => c._id !== id));
    } catch { /* ignore */ }
  }

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setInputOcrSized(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const data = await api.post<{
        reply: string;
        crisis: boolean;
        usedFallback: boolean;
        usedKnowledgeDb: boolean;
        conversationId: string | null;
      }>("/api/chat", { messages: next, mode, locale, conversationId: activeConvId });

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply,
          crisis: data.crisis,
          fallback: data.usedFallback,
          knowledgeDb: data.usedKnowledgeDb,
        },
      ]);
      if (data.conversationId) {
        setActiveConvId(data.conversationId);
        void fetchConversations();
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: err instanceof Error ? err.message : "Error — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, mode, locale, activeConvId, fetchConversations]);

  function exportPdf() {
    const rows = messages.filter((m) => m.role === "user" || m.role === "assistant");
    if (rows.length === 0) return;
    downloadChatPdf(rows, `HealthBot-${mode}`);
  }

  async function onImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setAttachBusy(true);
    setAttachHint(null);
    try {
      const form = new FormData();
      form.append("image", file);
      const ocrRes = await api.postForm<{ text: string }>(
        `/api/ocr?locale=${encodeURIComponent(locale)}`,
        form,
      );
      if (ocrRes.text) {
        setInput((prev) => (prev ? `${prev}\n\n` : "") + ocrRes.text.trim());
        setInputOcrSized(true);
        requestAnimationFrame(() => {
          const el = textareaRef.current;
          if (!el) return;
          el.style.height = "auto";
          el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
        });
      } else {
        setAttachHint(t("ocr_failed"));
      }
    } catch {
      setAttachHint(t("ocr_failed"));
    } finally {
      setAttachBusy(false);
    }
  }

  // Show loading screen while checking auth
  if (state.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex gap-1.5">
          <div className="typing-dot h-3 w-3 rounded-full bg-teal-400" />
          <div className="typing-dot h-3 w-3 rounded-full bg-teal-400" />
          <div className="typing-dot h-3 w-3 rounded-full bg-teal-400" />
        </div>
      </div>
    );
  }

  const currentMode = MODES.find((m) => m.id === mode);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] transition-transform duration-200 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
              <HeartPulse className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-[var(--foreground)]">HealthBot</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1 text-[var(--muted)] hover:bg-slate-200 dark:hover:bg-slate-700 md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 pt-3">
          <button onClick={newChat} className="flex w-full items-center gap-2.5 rounded-xl bg-teal-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700">
            <Plus className="h-4 w-4" /> {t("new_conversation")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {conversations.length === 0 ? (
            <p className="px-2 text-xs text-[var(--muted)]">{t("no_saved")}</p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((c) => (
                <li key={c._id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => void loadConversation(c._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        void loadConversation(c._id);
                      }
                    }}
                    className={`group flex w-full cursor-pointer items-start justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-200 dark:hover:bg-slate-700 ${activeConvId === c._id ? "bg-slate-200 dark:bg-slate-700" : ""}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[var(--foreground)]">{c.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">{relativeTime(c.updatedAt)}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Delete conversation ${c.title}`}
                      onClick={(e) => void deleteConversation(c._id, e)}
                      className="ml-2 mt-0.5 flex-shrink-0 rounded p-1 text-[var(--muted)] opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-[var(--border)] px-4 py-3">
          {state.user && (
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2.5">
                {state.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={state.user.image} alt="" className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">{state.user.name ?? "User"}</p>
                  <p className="truncate text-xs text-[var(--muted)]">{state.user.email}</p>
                </div>
              </div>
              <button onClick={() => { logout(); router.push("/"); }} title="Sign out"
                className="ml-2 rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-slate-200 hover:text-red-500 dark:hover:bg-slate-700">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-shrink-0 items-center gap-3 border-b border-[var(--border)] bg-white/80 px-4 py-3 backdrop-blur-sm dark:bg-slate-900/80">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-2">
            <div className="hidden h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-teal-600 md:flex">
              <HeartPulse className="h-4 w-4 text-white" />
            </div>
            <span className="hidden truncate text-sm font-semibold text-[var(--foreground)] md:block">{t("chat_title")}</span>
          </div>
          <div className="relative flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-white px-3 py-2 dark:bg-slate-800">
            <Bot className="h-4 w-4 text-teal-600" />
            <select value={mode} onChange={(e) => setMode(e.target.value as ChatMode)}
              className="app-select appearance-none max-w-[min(100%,11rem)] cursor-pointer bg-transparent pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30">
              {MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-[var(--muted)]" />
          </div>
          <div className="relative flex items-center gap-1 rounded-xl border border-[var(--border)] bg-white px-3 py-2 dark:bg-slate-800">
            <select value={locale} onChange={(e) => setLocale(e.target.value as AppLocale)}
              className="app-select appearance-none cursor-pointer bg-transparent pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30">
              {supported.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-[var(--muted)]" />
          </div>
          <button
            type="button"
            title={t("export_pdf")}
            onClick={exportPdf}
            disabled={messages.length === 0}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] transition hover:bg-slate-50 disabled:opacity-40 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <FileDown className="h-4 w-4" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-900/40">
                  <MessageSquare className="h-8 w-8 text-teal-600" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[var(--foreground)]">{t("how_help")}</h2>
                <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">{t("chat_sub")}</p>
                <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">{t("mode_hint_prefix")} {currentMode?.label} — {currentMode?.hint}</p>
                <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {["I've had a fever for 2 days. What should I watch for?","What vaccines do I need at 30 years old?","I've been feeling anxious lately. Where do I start?","Is it safe to take ibuprofen with blood pressure meds?"].map((q) => (
                    <button key={q} onClick={() => { setInput(q); textareaRef.current?.focus(); }}
                      className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-left text-sm text-[var(--foreground)] shadow-sm transition hover:border-teal-400 hover:bg-teal-50/50 dark:bg-slate-800 dark:hover:bg-slate-700">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-teal-600" : msg.crisis ? "bg-red-100" : "bg-slate-100 dark:bg-slate-700"}`}>
                  {msg.role === "user" ? <UserIcon className="h-4 w-4 text-white" /> : msg.crisis ? <AlertTriangle className="h-4 w-4 text-red-600" /> : <HeartPulse className="h-4 w-4 text-teal-600" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "rounded-tr-sm bg-teal-600 text-white" : msg.crisis ? "rounded-tl-sm border border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200" : "rounded-tl-sm border border-[var(--border)] bg-white text-[var(--foreground)] dark:bg-slate-800"}`}>
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <ChatMarkdown
                      content={msg.content}
                      variant={msg.crisis ? "crisis" : "assistant"}
                    />
                  )}
                  {msg.fallback && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                      {msg.knowledgeDb
                        ? "📚 AI unavailable — matched answer from knowledge database"
                        : "⚡ AI unavailable — using built-in health knowledge"}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <HeartPulse className="h-4 w-4 text-teal-600" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[var(--border)] bg-white px-4 py-3 dark:bg-slate-800">
                  <div className="typing-dot h-2 w-2 rounded-full bg-teal-400" />
                  <div className="typing-dot h-2 w-2 rounded-full bg-teal-400" />
                  <div className="typing-dot h-2 w-2 rounded-full bg-teal-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        <div className="flex-shrink-0 border-t border-[var(--border)] bg-white/90 px-4 py-4 backdrop-blur-sm dark:bg-slate-900/90">
          <div className="mx-auto max-w-3xl">
            {(attachBusy || attachHint) && (
              <p className="mb-2 text-xs text-[var(--muted)]">
                {attachBusy ? t("image_analyzing") : attachHint}
              </p>
            )}
            <div className="flex items-end gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm focus-within:border-teal-500/50 focus-within:ring-2 focus-within:ring-teal-500/20 dark:bg-slate-800">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onImageSelected(e)}
              />
              <button
                type="button"
                title={t("image_ocr")}
                disabled={attachBusy}
                onClick={() => fileInputRef.current?.click()}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] transition hover:bg-slate-50 disabled:opacity-40 dark:hover:bg-slate-700"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
              <textarea ref={textareaRef} rows={1}
                placeholder={t("input_placeholder")}
                value={input} onChange={handleInputChange}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
                className={`max-h-52 min-h-[28px] flex-1 resize-none bg-transparent leading-relaxed text-[var(--foreground)] placeholder:text-slate-400 focus:outline-none ${inputOcrSized ? "text-base sm:text-[17px]" : "text-sm"}`} />
              <button type="button" onClick={() => void send()} disabled={loading || !input.trim()}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-40">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-[var(--muted)]">
              {t("footer_hint")} <span className="text-amber-600">{t("edu_only")}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
