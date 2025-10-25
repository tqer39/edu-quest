export type KanjiGradeId =
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'grade-4'
  | 'grade-5'
  | 'grade-6';

export type KanjiQuestionType =
  | 'reading-single'
  | 'reading-multi'
  | 'word-fill'
  | 'sentence-fill';

export type KanjiSelectionType = 'single' | 'multi';

export type GradeMeta = {
  id: KanjiGradeId;
  label: string;
  description: string;
};

export type QuestionTypeMeta = {
  id: KanjiQuestionType;
  label: string;
  description: string;
  selectionType: KanjiSelectionType;
};

type KanjiQuestionDefinition = {
  id: string;
  gradeId: KanjiGradeId;
  type: KanjiQuestionType;
  selectionType: KanjiSelectionType;
  kanji: string;
  prompt: string;
  choices: readonly string[];
  correctAnswers: readonly string[];
  display: {
    heading?: string;
    mainKanji?: string;
    word?: string;
    wordWithBlank?: string;
    wordKana?: string;
    sentence?: string;
    sentenceWithBlank?: string;
    sentenceKana?: string;
    note?: string;
  };
  explanation?: string;
};

export type KanjiQuestionView = {
  id: string;
  gradeId: KanjiGradeId;
  type: KanjiQuestionType;
  selectionType: KanjiSelectionType;
  kanji: string;
  prompt: string;
  choices: readonly string[];
  display: KanjiQuestionDefinition['display'];
};

export type GenerateKanjiQuestionInput = {
  gradeId?: string | null;
  allowedTypes?: readonly KanjiQuestionType[] | null;
  excludeIds?: readonly string[] | null;
};

export type CheckKanjiAnswerInput = {
  questionId: string;
  selections: readonly string[];
};

export type CheckKanjiAnswerResult = {
  ok: boolean;
  correctAnswers: readonly string[];
  explanation?: string;
};

const shuffle = <T,>(items: readonly T[]): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const kanjiGrades: readonly GradeMeta[] = [
  { id: 'grade-1', label: '小1', description: '小学1年生で習う漢字' },
  { id: 'grade-2', label: '小2', description: '小学2年生で習う漢字' },
  { id: 'grade-3', label: '小3', description: '小学3年生で習う漢字' },
  { id: 'grade-4', label: '小4', description: '小学4年生で習う漢字' },
  { id: 'grade-5', label: '小5', description: '小学5年生で習う漢字' },
  { id: 'grade-6', label: '小6', description: '小学6年生で習う漢字' },
] as const;

export const kanjiQuestionTypes: readonly QuestionTypeMeta[] = [
  {
    id: 'reading-single',
    label: 'なんのよみ？',
    description: 'ひとつの読みをえらぶクイズ',
    selectionType: 'single',
  },
  {
    id: 'reading-multi',
    label: 'よみをぜんぶあてよう',
    description: '複数ある読みをすべて選ぶクイズ',
    selectionType: 'multi',
  },
  {
    id: 'word-fill',
    label: 'ことばのあなあき',
    description: 'ことばの□に入る漢字を選ぼう',
    selectionType: 'single',
  },
  {
    id: 'sentence-fill',
    label: 'ぶんしょうのあなあき',
    description: '文章の□に入る漢字を選ぼう',
    selectionType: 'single',
  },
] as const;

const definitions: readonly KanjiQuestionDefinition[] = [
  // Grade 1
  {
    id: 'g1-reading-yama',
    gradeId: 'grade-1',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '山',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['やま', 'かわ', 'そら', 'はな'],
    correctAnswers: ['やま'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '山',
      note: '山のぼりの「やま」だよ',
    },
    explanation: '「山」は「やま」と読みます。',
  },
  {
    id: 'g1-reading-hana',
    gradeId: 'grade-1',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '花',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['はな', 'き', 'みず', 'ほし'],
    correctAnswers: ['はな'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '花',
      note: 'さくときの「はな」だよ',
    },
    explanation: '「花」は「はな」と読みます。',
  },
  {
    id: 'g1-readingmulti-tsuki',
    gradeId: 'grade-1',
    type: 'reading-multi',
    selectionType: 'multi',
    kanji: '月',
    prompt: '「月」のよみをすべてえらぼう',
    choices: ['つき', 'げつ', 'がつ', 'ほし'],
    correctAnswers: ['つき', 'げつ', 'がつ'],
    display: {
      heading: 'よみをぜんぶあてよう',
      mainKanji: '月',
      note: '曜日のよみも思い出そう',
    },
    explanation: '「月」は「つき」「げつ」「がつ」と読みます。',
  },
  {
    id: 'g1-word-okaasan',
    gradeId: 'grade-1',
    type: 'word-fill',
    selectionType: 'single',
    kanji: '母',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['母', '父', '雨', '木'],
    correctAnswers: ['母'],
    display: {
      heading: 'ことばのあなあき',
      wordWithBlank: 'お□さん',
      word: 'お母さん',
      wordKana: 'おかあさん',
    },
    explanation: '「お母さん」の「かあ」は「母」の漢字を使います。',
  },
  {
    id: 'g1-sentence-ame',
    gradeId: 'grade-1',
    type: 'sentence-fill',
    selectionType: 'single',
    kanji: '雨',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['雨', '雪', '風', '星'],
    correctAnswers: ['雨'],
    display: {
      heading: 'ぶんしょうのあなあき',
      sentenceWithBlank: 'あしたは□がふります。',
      sentence: 'あしたは雨がふります。',
      sentenceKana: 'あしたはあめがふります。',
    },
    explanation: '雨がふるときの漢字は「雨」です。',
  },
  // Grade 2
  {
    id: 'g2-reading-umi',
    gradeId: 'grade-2',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '海',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['うみ', 'やま', 'かわ', 'そら'],
    correctAnswers: ['うみ'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '海',
      note: '海でおよぐときの漢字',
    },
    explanation: '「海」は「うみ」と読みます。',
  },
  {
    id: 'g2-reading-tori',
    gradeId: 'grade-2',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '鳥',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['とり', 'いぬ', 'さかな', 'むし'],
    correctAnswers: ['とり'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '鳥',
      note: '空をとぶ動物の漢字',
    },
    explanation: '「鳥」は「とり」と読みます。',
  },
  {
    id: 'g2-readingmulti-ba',
    gradeId: 'grade-2',
    type: 'reading-multi',
    selectionType: 'multi',
    kanji: '場',
    prompt: '「場」のよみをすべてえらぼう',
    choices: ['ば', 'じょう', 'ちょう', 'は'],
    correctAnswers: ['ば', 'じょう'],
    display: {
      heading: 'よみをぜんぶあてよう',
      mainKanji: '場',
      note: '場所や会場の漢字',
    },
    explanation: '「場」は「ば」「じょう」と読みます。',
  },
  {
    id: 'g2-word-koen',
    gradeId: 'grade-2',
    type: 'word-fill',
    selectionType: 'single',
    kanji: '園',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['園', '公', '校', '森'],
    correctAnswers: ['園'],
    display: {
      heading: 'ことばのあなあき',
      wordWithBlank: '公□であそぶ',
      word: '公園であそぶ',
      wordKana: 'こうえんであそぶ',
    },
    explanation: '「公園」は「公」と「園」を組み合わせた言葉です。',
  },
  {
    id: 'g2-sentence-hiru',
    gradeId: 'grade-2',
    type: 'sentence-fill',
    selectionType: 'single',
    kanji: '昼',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['昼', '夜', '朝', '夕'],
    correctAnswers: ['昼'],
    display: {
      heading: 'ぶんしょうのあなあき',
      sentenceWithBlank: '□ごはんをたべる。',
      sentence: '昼ごはんをたべる。',
      sentenceKana: 'ひるごはんをたべる。',
    },
    explanation: 'おひるの時間をあらわす漢字は「昼」です。',
  },
  // Grade 3
  {
    id: 'g3-reading-kyo',
    gradeId: 'grade-3',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '京',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['きょう', 'けん', 'しん', 'とう'],
    correctAnswers: ['きょう'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '京',
      note: '東京都の「京」だよ',
    },
    explanation: '「京」は「きょう」と読みます。',
  },
  {
    id: 'g3-reading-haku',
    gradeId: 'grade-3',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '博',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['はく', 'ばく', 'はち', 'ぼ'],
    correctAnswers: ['はく'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '博',
      note: '博物館の「博」だよ',
    },
    explanation: '「博」は「はく」と読みます。',
  },
  {
    id: 'g3-readingmulti-shi',
    gradeId: 'grade-3',
    type: 'reading-multi',
    selectionType: 'multi',
    kanji: '市',
    prompt: '「市」のよみをすべてえらぼう',
    choices: ['し', 'いち', 'まち', 'むら'],
    correctAnswers: ['し', 'いち', 'まち'],
    display: {
      heading: 'よみをぜんぶあてよう',
      mainKanji: '市',
      note: '市役所や市場を思い出そう',
    },
    explanation: '「市」は「し」「いち」「まち」と読みます。',
  },
  {
    id: 'g3-word-shizen',
    gradeId: 'grade-3',
    type: 'word-fill',
    selectionType: 'single',
    kanji: '然',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['然', '燃', '善', '線'],
    correctAnswers: ['然'],
    display: {
      heading: 'ことばのあなあき',
      wordWithBlank: '自□をたいせつにする',
      word: '自然をたいせつにする',
      wordKana: 'しぜんをたいせつにする',
    },
    explanation: '「自然」は「自」と「然」でできています。',
  },
  {
    id: 'g3-sentence-kagaku',
    gradeId: 'grade-3',
    type: 'sentence-fill',
    selectionType: 'single',
    kanji: '科',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['科', '課', '芽', '列'],
    correctAnswers: ['科'],
    display: {
      heading: 'ぶんしょうのあなあき',
      sentenceWithBlank: '□学のじっけんをする。',
      sentence: '科学のじっけんをする。',
      sentenceKana: 'かがくのじっけんをする。',
    },
    explanation: '「科学」は「科」と「学」をあわせた言葉です。',
  },
  // Grade 4
  {
    id: 'g4-reading-kan',
    gradeId: 'grade-4',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '漢',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['かん', 'けん', 'はん', 'なん'],
    correctAnswers: ['かん'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '漢',
      note: '漢字の「漢」だよ',
    },
    explanation: '「漢」は「かん」と読みます。',
  },
  {
    id: 'g4-reading-ken',
    gradeId: 'grade-4',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '険',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['けん', 'げん', 'こん', 'けい'],
    correctAnswers: ['けん'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '険',
      note: '危険の「けん」だよ',
    },
    explanation: '「険」は「けん」と読みます。',
  },
  {
    id: 'g4-readingmulti-setsu',
    gradeId: 'grade-4',
    type: 'reading-multi',
    selectionType: 'multi',
    kanji: '節',
    prompt: '「節」のよみをすべてえらぼう',
    choices: ['せつ', 'ふし', 'ほし', 'せん'],
    correctAnswers: ['せつ', 'ふし'],
    display: {
      heading: 'よみをぜんぶあてよう',
      mainKanji: '節',
      note: '季節や竹の節を思い出そう',
    },
    explanation: '「節」は「せつ」「ふし」と読みます。',
  },
  {
    id: 'g4-word-kansha',
    gradeId: 'grade-4',
    type: 'word-fill',
    selectionType: 'single',
    kanji: '謝',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['謝', '射', '捨', '舎'],
    correctAnswers: ['謝'],
    display: {
      heading: 'ことばのあなあき',
      wordWithBlank: '感□の気持ちを伝える',
      word: '感謝の気持ちを伝える',
      wordKana: 'かんしゃのきもちをつたえる',
    },
    explanation: 'ありがとうの気持ちを表す漢字は「謝」です。',
  },
  {
    id: 'g4-sentence-setsumei',
    gradeId: 'grade-4',
    type: 'sentence-fill',
    selectionType: 'single',
    kanji: '説',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['説', '設', '雪', '節'],
    correctAnswers: ['説'],
    display: {
      heading: 'ぶんしょうのあなあき',
      sentenceWithBlank: 'ルールを□明する。',
      sentence: 'ルールを説明する。',
      sentenceKana: 'るーるをせつめいする。',
    },
    explanation: '説明するときの漢字は「説」です。',
  },
  // Grade 5
  {
    id: 'g5-reading-gi',
    gradeId: 'grade-5',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '義',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['ぎ', 'ぎょ', 'き', 'ぎん'],
    correctAnswers: ['ぎ'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '義',
      note: '正義の「ぎ」だよ',
    },
    explanation: '「義」は「ぎ」と読みます。',
  },
  {
    id: 'g5-reading-kin',
    gradeId: 'grade-5',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '勤',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['きん', 'ぎん', 'どう', 'しん'],
    correctAnswers: ['きん'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '勤',
      note: '勤務の「きん」だよ',
    },
    explanation: '「勤」は「きん」と読みます。',
  },
  {
    id: 'g5-readingmulti-jutsu',
    gradeId: 'grade-5',
    type: 'reading-multi',
    selectionType: 'multi',
    kanji: '述',
    prompt: '「述」のよみをすべてえらぼう',
    choices: ['じゅつ', 'の', 'と', 'しゅつ'],
    correctAnswers: ['じゅつ', 'の'],
    display: {
      heading: 'よみをぜんぶあてよう',
      mainKanji: '述',
      note: '述べる・記述の漢字',
    },
    explanation: '「述」は「じゅつ」「の（べる）」と読みます。',
  },
  {
    id: 'g5-word-jissai',
    gradeId: 'grade-5',
    type: 'word-fill',
    selectionType: 'single',
    kanji: '実',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['実', '真', '察', '審'],
    correctAnswers: ['実'],
    display: {
      heading: 'ことばのあなあき',
      wordWithBlank: '□際にためしてみる',
      word: '実際にためしてみる',
      wordKana: 'じっさいにためしてみる',
    },
    explanation: 'ほんとうに行うことを表す漢字は「実」です。',
  },
  {
    id: 'g5-sentence-hatten',
    gradeId: 'grade-5',
    type: 'sentence-fill',
    selectionType: 'single',
    kanji: '展',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['展', '転', '店', '殿'],
    correctAnswers: ['展'],
    display: {
      heading: 'ぶんしょうのあなあき',
      sentenceWithBlank: '町の未来を□望する。',
      sentence: '町の未来を展望する。',
      sentenceKana: 'まちのみらいをてんぼうする。',
    },
    explanation: '未来を見わたすことを「展望」といいます。',
  },
  // Grade 6
  {
    id: 'g6-reading-kyu',
    gradeId: 'grade-6',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '究',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['きゅう', 'きょう', 'くう', 'きゅ'],
    correctAnswers: ['きゅう'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '究',
      note: '研究の「きゅう」だよ',
    },
    explanation: '「究」は「きゅう」と読みます。',
  },
  {
    id: 'g6-reading-sen',
    gradeId: 'grade-6',
    type: 'reading-single',
    selectionType: 'single',
    kanji: '線',
    prompt: 'この漢字の読みを1つえらぼう',
    choices: ['せん', 'しん', 'せい', 'せつ'],
    correctAnswers: ['せん'],
    display: {
      heading: 'なんのよみ？',
      mainKanji: '線',
      note: '直線の「せん」だよ',
    },
    explanation: '「線」は「せん」と読みます。',
  },
  {
    id: 'g6-readingmulti-ou',
    gradeId: 'grade-6',
    type: 'reading-multi',
    selectionType: 'multi',
    kanji: '応',
    prompt: '「応」のよみをすべてえらぼう',
    choices: ['おう', 'こた', 'いん', 'お'],
    correctAnswers: ['おう', 'こた'],
    display: {
      heading: 'よみをぜんぶあてよう',
      mainKanji: '応',
      note: '応援・応えるで使う漢字',
    },
    explanation: '「応」は「おう」「こた（える）」と読みます。',
  },
  {
    id: 'g6-word-kaikaku',
    gradeId: 'grade-6',
    type: 'word-fill',
    selectionType: 'single',
    kanji: '革',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['革', '格', '客', '各'],
    correctAnswers: ['革'],
    display: {
      heading: 'ことばのあなあき',
      wordWithBlank: '改□を進める',
      word: '改革を進める',
      wordKana: 'かいかくをすすめる',
    },
    explanation: 'あたらしく改めるときに使う漢字は「革」です。',
  },
  {
    id: 'g6-sentence-kaihatsu',
    gradeId: 'grade-6',
    type: 'sentence-fill',
    selectionType: 'single',
    kanji: '開',
    prompt: '□にあてはまる漢字を1つえらぼう',
    choices: ['開', '改', '界', '海'],
    correctAnswers: ['開'],
    display: {
      heading: 'ぶんしょうのあなあき',
      sentenceWithBlank: '新しい薬を□発する。',
      sentence: '新しい薬を開発する。',
      sentenceKana: 'あたらしいくすりをかいはつする。',
    },
    explanation: 'ものごとをひらいて進める意味の漢字は「開」です。',
  },
] as const;

const definitionMap = new Map(definitions.map((def) => [def.id, def] as const));

const resolveGrade = (gradeId?: string | null): KanjiGradeId => {
  if (!gradeId) return 'grade-1';
  const found = kanjiGrades.find((grade) => grade.id === gradeId);
  return found ? found.id : 'grade-1';
};

const filterDefinitions = (
  params: GenerateKanjiQuestionInput
): KanjiQuestionDefinition[] => {
  const grade = resolveGrade(params.gradeId);
  const allowedTypeSet = params.allowedTypes
    ? new Set(params.allowedTypes)
    : null;
  const excluded = params.excludeIds ? new Set(params.excludeIds) : null;
  const pool = definitions.filter((def) => {
    if (def.gradeId !== grade) return false;
    if (allowedTypeSet && !allowedTypeSet.has(def.type)) return false;
    if (excluded?.has(def.id)) return false;
    return true;
  });
  if (pool.length > 0) return pool;
  // fallback: ignore exclusions if pool empty
  const fallback = definitions.filter((def) => {
    if (def.gradeId !== grade) return false;
    if (allowedTypeSet && !allowedTypeSet.has(def.type)) return false;
    return true;
  });
  return fallback.length > 0
    ? fallback
    : definitions.filter((def) =>
        allowedTypeSet ? allowedTypeSet.has(def.type) : true
      );
};

export const generateKanjiQuestion = (
  params: GenerateKanjiQuestionInput = {}
): KanjiQuestionView => {
  const pool = filterDefinitions(params);
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const choices = shuffle(picked.choices);
  return {
    id: picked.id,
    gradeId: picked.gradeId,
    type: picked.type,
    selectionType: picked.selectionType,
    kanji: picked.kanji,
    prompt: picked.prompt,
    choices,
    display: picked.display,
  };
};

export const checkKanjiAnswer = (
  input: CheckKanjiAnswerInput
): CheckKanjiAnswerResult => {
  const definition = definitionMap.get(input.questionId);
  if (!definition) {
    return {
      ok: false,
      correctAnswers: [],
    };
  }
  const normalizedSelections = new Set(
    (input.selections ?? []).map((choice) => String(choice))
  );
  const normalizedCorrect = new Set(
    definition.correctAnswers.map((choice) => String(choice))
  );
  const isCorrect =
    normalizedSelections.size === normalizedCorrect.size &&
    [...normalizedCorrect].every((answer) => normalizedSelections.has(answer));
  return {
    ok: isCorrect,
    correctAnswers: definition.correctAnswers,
    explanation: definition.explanation,
  };
};

export const getKanjiGradeTypeMap = () => {
  const map = new Map<KanjiGradeId, Set<KanjiQuestionType>>();
  for (const def of definitions) {
    if (!map.has(def.gradeId)) {
      map.set(def.gradeId, new Set());
    }
    map.get(def.gradeId)?.add(def.type);
  }
  const entries: Record<string, KanjiQuestionType[]> = {};
  for (const grade of kanjiGrades) {
    const set = map.get(grade.id);
    entries[grade.id] = set ? [...set] : [];
  }
  return entries;
};
