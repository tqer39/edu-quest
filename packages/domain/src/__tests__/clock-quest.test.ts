import { describe, expect, it } from 'vitest';
import { type ClockGrade, getGradeDescription } from '../clock-quest';

describe('ClockQuest', () => {
  describe('getGradeDescription', () => {
    it('returns correct description for grade 1', () => {
      expect(getGradeDescription(1 as ClockGrade)).toBe(
        '小学1年生: ちょうどの時刻を読んでみよう'
      );
    });

    it('returns correct description for grade 2', () => {
      expect(getGradeDescription(2 as ClockGrade)).toBe(
        '小学2年生: 半の時刻にもチャレンジ'
      );
    });

    it('returns correct description for grade 3', () => {
      expect(getGradeDescription(3 as ClockGrade)).toBe(
        '小学3年生: 15分単位で時間感覚を鍛えよう'
      );
    });

    it('returns correct description for grade 4', () => {
      expect(getGradeDescription(4 as ClockGrade)).toBe(
        '小学4年生: 5分ごとの読み取りを練習'
      );
    });

    it('returns correct description for grade 5', () => {
      expect(getGradeDescription(5 as ClockGrade)).toBe(
        '小学5年生: 細かい時間も正確に読もう'
      );
    });

    it('returns correct description for grade 6', () => {
      expect(getGradeDescription(6 as ClockGrade)).toBe(
        '小学6年生: 1分単位の時刻で総仕上げ'
      );
    });

    it('handles all grades from 1 to 6', () => {
      const grades: ClockGrade[] = [1, 2, 3, 4, 5, 6];
      grades.forEach((grade) => {
        const description = getGradeDescription(grade);
        expect(description).toBeTruthy();
        expect(description).toContain(`小学${grade}年生`);
      });
    });
  });
});
