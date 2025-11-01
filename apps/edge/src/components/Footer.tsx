import type { FC } from 'hono/jsx';

export const Footer: FC = () => (
  <footer class="mt-auto w-full bg-[var(--mq-surface)] px-4 py-8 backdrop-blur sm:px-8 lg:px-16 xl:px-24">
    <div class="mx-auto max-w-7xl">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 space-y-8">
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-[var(--mq-ink)]">サービス</h3>
          <div class="flex flex-col gap-1 text-sm">
            <a
              class="text-[#5e718a] transition hover:text-[var(--mq-primary-strong)]"
              href="/parents"
            >
              保護者の方へ
            </a>
            <span class="text-[#9ca3af]">利用規約（準備中）</span>
            <span class="text-[#9ca3af]">料金（準備中）</span>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-[var(--mq-ink)]">サポート</h3>
          <div class="flex flex-col gap-1 text-sm">
            <span class="text-[#9ca3af]">お問い合わせ（準備中）</span>
            <span class="text-[#9ca3af]">プライバシーポリシー（準備中）</span>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-[var(--mq-ink)]">開発</h3>
          <div class="flex flex-col gap-1 text-sm">
            <a
              class="inline-flex items-center gap-2 text-[#5e718a] transition hover:text-[var(--mq-primary-strong)]"
              href="https://github.com/tqer39/edu-quest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                aria-hidden="true"
                class="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-[var(--mq-ink)]">EduQuest</h3>
          <p class="text-sm text-[#5e718a]">小学生向けの学習プラットフォーム</p>
        </div>
      </div>

      <div class="mt-16">
        <p class="text-center text-xs text-[#5e718a]">
          © 2025 EduQuest. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
