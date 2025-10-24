import type { FC } from 'hono/jsx';

type AnalogClockProps = {
  hours: number; // 1-12
  minutes: number; // 0-59
};

export const AnalogClock: FC<AnalogClockProps> = ({ hours, minutes }) => {
  // 時針の角度を計算（12時の位置を0度とする）
  // 1時間で30度、1分で0.5度
  const hourAngle = ((hours % 12) * 30 + minutes * 0.5) % 360;

  // 分針の角度を計算
  // 1分で6度
  const minuteAngle = (minutes * 6) % 360;

  return (
    <svg
      viewBox="0 0 200 200"
      class="w-full max-w-sm"
      role="img"
      aria-label="アナログ時計"
    >
      <title>アナログ時計</title>
      {/* 時計の外枠 */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="white"
        stroke="var(--mq-primary-strong)"
        stroke-width="4"
      />

      {/* 時刻の目盛り */}
      {/* biome-ignore lint/suspicious/noArrayIndexKey: Static clock face, never reorders */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 100 + 85 * Math.sin(angle);
        const y1 = 100 - 85 * Math.cos(angle);
        const x2 = 100 + 75 * Math.sin(angle);
        const y2 = 100 - 75 * Math.cos(angle);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--mq-primary)"
            stroke-width="3"
            stroke-linecap="round"
          />
        );
      })}

      {/* 数字 */}
      {/* biome-ignore lint/suspicious/noArrayIndexKey: Static clock face, never reorders */}
      {Array.from({ length: 12 }).map((_, i) => {
        const num = i === 0 ? 12 : i;
        const angle = (i * 30 * Math.PI) / 180;
        const x = 100 + 65 * Math.sin(angle);
        const y = 100 - 65 * Math.cos(angle);

        return (
          <text
            key={i}
            x={x}
            y={y}
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="16"
            font-weight="bold"
            fill="var(--mq-ink)"
          >
            {num}
          </text>
        );
      })}

      {/* 時針 */}
      <line
        x1="100"
        y1="100"
        x2={100 + 45 * Math.sin((hourAngle * Math.PI) / 180)}
        y2={100 - 45 * Math.cos((hourAngle * Math.PI) / 180)}
        stroke="var(--mq-ink)"
        stroke-width="6"
        stroke-linecap="round"
      />

      {/* 分針 */}
      <line
        x1="100"
        y1="100"
        x2={100 + 65 * Math.sin((minuteAngle * Math.PI) / 180)}
        y2={100 - 65 * Math.cos((minuteAngle * Math.PI) / 180)}
        stroke="var(--mq-primary-strong)"
        stroke-width="4"
        stroke-linecap="round"
      />

      {/* 中心の円 */}
      <circle cx="100" cy="100" r="6" fill="var(--mq-ink)" />
    </svg>
  );
};
