import type { FC } from 'hono/jsx';

type BackToTopLinkProps = {
  href?: string;
  variant?: 'outlined' | 'text';
  class?: string;
};

export const BACK_TO_TOP_LABEL = '← トップに戻る';

const variantClasses: Record<NonNullable<BackToTopLinkProps['variant']>, string> = {
  outlined:
    'inline-flex items-center gap-2 rounded-2xl border border-[var(--mq-outline)] bg-white px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]',
  text:
    'inline-flex items-center gap-1 text-sm font-semibold text-[var(--mq-primary-strong)] transition hover:underline',
};

export const BackToTopLink: FC<BackToTopLinkProps> = ({
  href = '/',
  variant = 'outlined',
  class: className,
}) => {
  const classes = [variantClasses[variant], className].filter(Boolean).join(' ');

  return (
    <a href={href} class={classes}>
      {BACK_TO_TOP_LABEL}
    </a>
  );
};
