import type { FC } from 'hono/jsx';

type BackToGradeSelectButtonProps = {
  href: string;
  className?: string;
};

export const BackToGradeSelectButton: FC<BackToGradeSelectButtonProps> = ({
  href,
  className = '',
}) => (
  <a
    href={href}
    class={`inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)] ${className}`.trim()}
  >
    <span aria-hidden="true">←</span>
    <span>学年選択へ戻る</span>
  </a>
);
