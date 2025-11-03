import { getCookie, setCookie } from 'hono/cookie';
import type { Context } from 'hono';

// Cookie の名前
const GRADE_COOKIE_NAME = 'eduquest_selected_grade';

// Cookie の有効期限（30日）
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * 学年情報を Cookie に保存
 */
export const setSelectedGrade = (c: Context, gradeId: string): void => {
  setCookie(c, GRADE_COOKIE_NAME, gradeId, {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: c.req.url.startsWith('https://'),
    sameSite: 'Lax',
  });
};

/**
 * Cookie から学年情報を取得
 */
export const getSelectedGrade = (c: Context): string | undefined => {
  return getCookie(c, GRADE_COOKIE_NAME);
};

/**
 * 学年 Cookie をクリア
 */
export const clearSelectedGrade = (c: Context): void => {
  setCookie(c, GRADE_COOKIE_NAME, '', {
    path: '/',
    maxAge: 0,
  });
};
