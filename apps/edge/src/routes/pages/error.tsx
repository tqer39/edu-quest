import type { FC } from 'hono/jsx';
import { BACK_TO_TOP_LABEL } from '../components/back-to-top-link';

type ErrorPageProps = {
  title: string;
  message: string;
  details?: string;
  action?: { href: string; label: string };
};

const ErrorPageLayout: FC<ErrorPageProps> = ({
  title,
  message,
  details,
  action = { href: '/', label: BACK_TO_TOP_LABEL },
}) => (
  <div class="flex min-h-screen flex-col items-center justify-center bg-[var(--mq-bg)] px-6 py-16">
    <div class="w-full max-w-xl space-y-6 rounded-3xl border border-[var(--mq-outline)] bg-white/90 p-10 text-center shadow-xl backdrop-blur">
      <div class="text-6xl">🛠️</div>
      <h1 class="text-3xl font-extrabold tracking-tight text-[var(--mq-ink)]">
        {title}
      </h1>
      <p class="text-sm leading-relaxed text-[#5e718a] sm:text-base">
        {message}
      </p>
      {details ? (
        <p class="rounded-2xl bg-[var(--mq-primary-soft)] px-4 py-3 text-left text-xs text-[var(--mq-primary-strong)]">
          {details}
        </p>
      ) : null}
      <a
        href={action.href}
        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--mq-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--mq-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary-strong)]"
      >
        {action.label}
      </a>
    </div>
  </div>
);

export const NotFoundPage: FC = () => (
  <ErrorPageLayout
    title="ページが見つかりませんでした"
    message="お探しのページは削除されたか、移動した可能性があります。URL をご確認のうえ、トップページから再度アクセスしてください。"
  />
);

export const ServerErrorPage: FC<{ requestId?: string }> = ({ requestId }) => (
  <ErrorPageLayout
    title="エラーが発生しました"
    message="申し訳ありません。ページの表示中に問題が発生しました。時間をおいて再度お試しください。"
    details={
      requestId
        ? `サポートにお問い合わせの際は ID: ${requestId} をお伝えください。`
        : undefined
    }
  />
);
