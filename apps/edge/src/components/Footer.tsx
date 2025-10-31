import type { FC } from 'hono/jsx';

export const Footer: FC = () => (
  <nav class="rounded-3xl border border-[rgba(148,163,184,0.25)] bg-white/90 p-6 shadow-sm">
    <h2 class="text-sm font-semibold text-[#1f2937]">関連リンク</h2>
    <ul class="mt-3 flex flex-wrap gap-4 text-sm text-[#3b82f6]">
      <li>
        <a class="transition hover:text-[#1d4ed8]" href="/">
          ホーム
        </a>
      </li>
      <li>
        <a class="transition hover:text-[#1d4ed8]" href="/parents">
          保護者の方へ
        </a>
      </li>
      <li>
        <a
          class="transition hover:text-[#1d4ed8]"
          href="https://github.com/tqer39/edu-quest"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repository
        </a>
      </li>
      <li>
        <a class="transition hover:text-[#1d4ed8]" href="/privacy">
          プライバシーポリシー（公開予定）
        </a>
      </li>
    </ul>
  </nav>
);
