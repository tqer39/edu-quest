import type { FC } from 'hono/jsx';

export type DictionaryLinkProps = {
  href?: string;
  current?: boolean;
  class?: string;
};

const baseClasses =
  'inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] px-3 py-2 text-xs font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]';
const defaultClasses =
  'bg-white text-[var(--mq-ink)] hover:-translate-y-0.5 hover:bg-[var(--mq-surface)]';
const activeClasses =
  'bg-[var(--mq-primary-soft)] border-[var(--mq-primary)] text-[var(--mq-primary-strong)]';

export const DictionaryLink: FC<DictionaryLinkProps> = ({
  href = '/kanji/dictionary',
  current = false,
  class: className,
}) => {
  const classes = [
    baseClasses,
    current ? activeClasses : defaultClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a href={href} class={classes} aria-current={current ? 'page' : undefined}>
      <span aria-hidden="true">📚</span>
      <span>辞書</span>
    </a>
  );
};
