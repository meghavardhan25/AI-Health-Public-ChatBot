import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Variant = "assistant" | "crisis";

const linkClass: Record<Variant, string> = {
  assistant:
    "font-medium text-teal-700 underline decoration-teal-600/40 underline-offset-2 hover:text-teal-800 dark:text-teal-300 dark:decoration-teal-400/40 dark:hover:text-teal-200",
  crisis:
    "font-medium text-red-800 underline decoration-red-400/50 underline-offset-2 hover:text-red-900 dark:text-red-200 dark:hover:text-red-100",
};

export function ChatMarkdown({
  content,
  variant = "assistant",
}: {
  content: string;
  variant?: Variant;
}) {
  const lc = linkClass[variant];

  const components: Components = {
    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
    h1: ({ children }) => (
      <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h3>
    ),
    h2: ({ children }) => (
      <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h3>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-3 text-sm font-semibold first:mt-0">{children}</h4>
    ),
    ul: ({ children }) => (
      <ul className="mb-3 list-outside list-disc space-y-1.5 pl-5 last:mb-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-3 list-outside list-decimal space-y-1.5 pl-5 last:mb-0">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed [&>p]:mb-0">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={lc}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="my-3 border-l-2 border-[var(--border)] pl-3 text-[var(--muted)]">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-4 border-[var(--border)]" />,
    code: ({ className, children }) => {
      if (!className) {
        return (
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.9em] dark:bg-slate-700">
            {children}
          </code>
        );
      }
      return (
        <code className={`font-mono text-[0.85em] ${className}`}>{children}</code>
      );
    },
    pre: ({ children }) => (
      <pre className="my-3 overflow-x-auto rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
        {children}
      </pre>
    ),
  };

  return (
    <div className="text-sm leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
