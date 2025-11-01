import type { FC } from 'hono/jsx';

type QuestHeaderProps = {
  icon: string;
  title: string;
  description: string;
  subtitle?: string;
};

export const QuestHeader: FC<QuestHeaderProps> = ({
  icon,
  title,
  description,
  subtitle,
}) => (
  <header class="flex flex-col items-center gap-6 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-r from-[var(--mq-primary-soft)] via-white to-[var(--mq-accent)] p-12 text-center text-[var(--mq-ink)] shadow-xl">
    <span class="text-6xl">{icon}</span>
    <div class="space-y-4">
      <h1 class="text-3xl font-extrabold sm:text-4xl">{title}</h1>
      <p class="max-w-xl text-sm sm:text-base text-[#4f6076]">
        {description}
        {subtitle && (
          <>
            <br />
            {subtitle}
          </>
        )}
      </p>
    </div>
  </header>
);

type GradeCardProps = {
  gradeNumber?: number;
  label?: string;
  stars?: string;
  description: string;
  highlight?: string;
  href: string;
  disabled?: boolean;
};

export const GradeCard: FC<GradeCardProps> = ({
  gradeNumber,
  label,
  stars,
  description,
  highlight,
  href,
  disabled = false,
}) => {
  const cardContent = (
    <>
      <div class="text-2xl font-bold text-[var(--mq-ink)]">
        {label || `小学${gradeNumber}年生`}
      </div>
      {stars && (
        <div class="text-lg text-[var(--mq-primary-strong)]">{stars}</div>
      )}
      <div class="text-sm text-[#5e718a]">{description}</div>
      {highlight && (
        <div class="text-xs font-semibold uppercase tracking-wide text-[var(--mq-primary-strong)]">
          {highlight}
        </div>
      )}
      {disabled && (
        <div class="mt-2 inline-flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
          🔒 準備中
        </div>
      )}
    </>
  );

  if (disabled) {
    return (
      <div class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-gray-100 p-6 text-left opacity-50">
        {cardContent}
      </div>
    );
  }

  return (
    <a
      href={href}
      class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-gradient-to-br from-white to-[var(--mq-primary-soft)] p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
    >
      {cardContent}
    </a>
  );
};

type GradeSelectionProps = {
  title?: string;
  children: any;
};

export const GradeSelection: FC<GradeSelectionProps> = ({
  title = '学年を選んでください',
  children,
}) => (
  <section class="space-y-6">
    <h2 class="text-xl font-bold text-[var(--mq-ink)]">{title}</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  </section>
);

type FeatureListItem = {
  icon?: string;
  label?: string;
  description: string;
};

type FeaturesProps = {
  title: string;
  items: FeatureListItem[];
};

export const Features: FC<FeaturesProps> = ({ title, items }) => (
  <section class="rounded-3xl border border-[var(--mq-outline)] bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-xl font-bold text-[var(--mq-ink)]">{title}</h2>
    <ul class="space-y-2 text-sm text-[#5e718a]">
      {items.map((item, index) => (
        <li key={index}>
          {item.icon || '✓'} {item.label && <strong>{item.label}</strong>}{' '}
          {item.description}
        </li>
      ))}
    </ul>
  </section>
);
