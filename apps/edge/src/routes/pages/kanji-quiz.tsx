import type { FC } from 'hono/jsx';
import type { CurrentUser } from '../../application/session/current-user';
import type { KanjiQuestion } from '@edu-quest/domain';

type KanjiQuizProps = {
  currentUser: CurrentUser | null;
  question: KanjiQuestion;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  grade: number;
};

export const KanjiQuiz: FC<KanjiQuizProps> = ({
  currentUser: _currentUser,
  question,
  questionNumber,
  totalQuestions,
  score,
  grade,
}) => {
  return (
    <div
      class="flex min-h-screen w-full flex-col gap-10 px-4 py-8 sm:px-8 lg:px-16 xl:px-24"
      style="--mq-primary: #9B87D4; --mq-primary-strong: #7B5FBD; --mq-primary-soft: #E8E1F5; --mq-accent: #C5B5E8; --mq-outline: rgba(155, 135, 212, 0.45); --mq-ink: #2c3e50; --mq-surface: rgba(255, 255, 255, 0.95);"
    >
      {/* ナビゲーション */}
      <nav class="flex flex-col gap-3 rounded-3xl border border-[var(--mq-outline)] bg-[var(--mq-surface)] px-6 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--mq-primary-soft)] text-base">
            ✏️
          </span>
          <span class="text-lg font-semibold tracking-tight text-[var(--mq-ink)]">
            KanjiQuest 小学{grade}年生
          </span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm font-semibold text-[var(--mq-ink)]">
            問題 {questionNumber} / {totalQuestions}
          </span>
          <span class="text-sm font-semibold text-[var(--mq-primary-strong)]">
            正解数: {score}
          </span>
        </div>
      </nav>

      {/* クイズコンテンツ */}
      <div class="flex flex-col items-center gap-8">
        <div class="w-full max-w-2xl rounded-3xl border border-[var(--mq-outline)] bg-white p-8 shadow-xl">
          <h2
            class="mb-8 text-center text-2xl font-bold text-[var(--mq-ink)]"
            dangerouslySetInnerHTML={{ __html: question.questionText }}
          />

          {/* 漢字表示 */}
          <div class="mb-8 flex justify-center">
            <div class="rounded-3xl border-4 border-[var(--mq-primary)] bg-[var(--mq-primary-soft)] p-8">
              <span class="text-8xl font-bold text-[var(--mq-ink)]">
                {question.character}
              </span>
            </div>
          </div>

          {/* 選択肢 */}
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {question.choices.map((choice, index) => (
              <form
                method="POST"
                action="/kanji/quiz"
                key={`${choice}-${index}`}
              >
                <input type="hidden" name="answer" value={choice} />
                <button
                  type="submit"
                  class="w-full rounded-2xl border-2 border-[var(--mq-outline)] bg-white px-6 py-4 text-2xl font-bold text-[var(--mq-ink)] shadow-md transition hover:-translate-y-1 hover:border-[var(--mq-primary)] hover:bg-[var(--mq-primary-soft)] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-primary)]"
                >
                  {choice}
                </button>
              </form>
            ))}
          </div>
        </div>

        {/* ヒント */}
        <div class="rounded-3xl border border-[var(--mq-outline)] bg-white p-4 text-center text-sm text-[#5e718a]">
          💡 小学{grade}年生で習う漢字の読み方を答えましょう
        </div>
      </div>
    </div>
  );
};
