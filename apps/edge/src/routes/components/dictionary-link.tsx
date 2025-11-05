import type { FC } from 'hono/jsx';

export type DictionaryLinkProps = {
  gradeParam?: string;
  active?: 'kanji' | 'radical';
  class?: string;
};

export const DictionaryLink: FC<DictionaryLinkProps> = ({
  gradeParam,
  active,
  class: className,
}) => {
  const resolvedGradeParam = gradeParam ?? 'elem-1';
  const kanjiDictionaryHref = `/kanji/dictionary?grade=${encodeURIComponent(
    resolvedGradeParam
  )}`;
  const radicalDictionaryHref = `/kanji/dictionary/radicals?grade=${encodeURIComponent(
    resolvedGradeParam
  )}`;
  const baseButtonClasses =
    'dictionary-dropdown-button inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]';
  const inactiveButtonClasses =
    'border-[var(--mq-outline)] bg-white text-[var(--mq-ink)] hover:-translate-y-0.5 hover:bg-[var(--mq-surface)]';
  const activeButtonClasses =
    'border-[var(--mq-primary)] bg-[var(--mq-primary-soft)] text-[var(--mq-primary-strong)]';
  const menuItemClasses =
    'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--mq-ink)] transition hover:bg-[var(--mq-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]';
  const menuItemActiveClasses =
    'bg-[var(--mq-primary-soft)] text-[var(--mq-primary-strong)]';

  const buttonClasses = [
    baseButtonClasses,
    active ? activeButtonClasses : inactiveButtonClasses,
  ]
    .filter(Boolean)
    .join(' ');

  const rootClasses = [
    'dictionary-dropdown',
    'relative',
    'inline-block',
    'flex-shrink-0',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div class={rootClasses}>
      <button
        type="button"
        class={buttonClasses}
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span aria-hidden="true">📚</span>
        <span>辞書</span>
        <svg
          class="dictionary-dropdown-icon h-3 w-3 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        class="dictionary-dropdown-menu absolute right-0 mt-2 hidden w-48 origin-top-right rounded-3xl border border-[var(--mq-outline)] bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
      >
        <a
          href={kanjiDictionaryHref}
          class={`${menuItemClasses} ${
            active === 'kanji' ? menuItemActiveClasses : ''
          }`}
          role="menuitem"
          aria-current={active === 'kanji' ? 'page' : undefined}
        >
          <span aria-hidden="true">🈶</span>
          <span>漢字辞書</span>
        </a>
        <a
          href={radicalDictionaryHref}
          class={`${menuItemClasses} ${
            active === 'radical' ? menuItemActiveClasses : ''
          }`}
          role="menuitem"
          aria-current={active === 'radical' ? 'page' : undefined}
        >
          <span aria-hidden="true">🈚</span>
          <span>部首辞書</span>
        </a>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (() => {
              const root = document.currentScript?.closest('.dictionary-dropdown');
              if (!root) {
                return;
              }

              const button = root.querySelector('.dictionary-dropdown-button');
              const menu = root.querySelector('.dictionary-dropdown-menu');
              const icon = root.querySelector('.dictionary-dropdown-icon');

              if (!(button instanceof HTMLElement) || !(menu instanceof HTMLElement) || !(icon instanceof SVGElement)) {
                return;
              }

              let isOpen = false;

              const openMenu = () => {
                if (isOpen) {
                  return;
                }
                isOpen = true;
                menu.classList.remove('hidden');
                button.setAttribute('aria-expanded', 'true');
                icon.style.transform = 'rotate(180deg)';
              };

              const closeMenu = () => {
                if (!isOpen) {
                  return;
                }
                isOpen = false;
                menu.classList.add('hidden');
                button.setAttribute('aria-expanded', 'false');
                icon.style.transform = 'rotate(0deg)';
              };

              const toggleMenu = () => {
                if (isOpen) {
                  closeMenu();
                } else {
                  openMenu();
                }
              };

              const focusFirstItem = () => {
                const firstItem = menu.querySelector('a');
                if (firstItem instanceof HTMLElement) {
                  firstItem.focus();
                }
              };

              button.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleMenu();
              });

              button.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  if (!isOpen) {
                    openMenu();
                  }
                  focusFirstItem();
                }
                if (event.key === 'Escape') {
                  closeMenu();
                }
              });

              document.addEventListener('click', (event) => {
                if (isOpen && !root.contains(event.target as Node)) {
                  closeMenu();
                }
              });

              document.addEventListener('keydown', (event) => {
                if (!isOpen) {
                  return;
                }
                if (event.key === 'Escape') {
                  event.preventDefault();
                  closeMenu();
                  button.focus();
                }
              });

              menu.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                  closeMenu();
                });
              });
            })();
          `,
        }}
      />
    </div>
  );
};
