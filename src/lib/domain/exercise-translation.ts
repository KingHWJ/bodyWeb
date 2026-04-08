type ExerciseNameParts = {
  primary: string;
  secondary: string | null;
  plainText: string;
};

const EXERCISE_TRANSLATION_MAP: Record<string, string> = {
  "bench-press": "卧推",
  squat: "深蹲",
  deadlift: "硬拉",
  "pull-ups": "引体向上",
  "romanian-deadlift": "罗马尼亚硬拉",
  "incline-dumbbell-bench-press": "上斜哑铃卧推",
  "lat-pulldown": "高位下拉",
};

const PHRASE_TRANSLATION_ENTRIES: Array<[string[], string]> = [
  [["ab", "wheel", "rollout"], "健腹轮"],
  [["behind", "the", "neck"], "颈后"],
  [["behind", "the", "back"], "背后"],
  [["close", "grip"], "窄握"],
  [["wide", "grip"], "宽握"],
  [["reverse", "grip"], "反握"],
  [["neutral", "grip"], "中立握"],
  [["one", "arm"], "单臂"],
  [["single", "leg"], "单腿"],
  [["split", "squat"], "分腿蹲"],
  [["front", "squat"], "前蹲"],
  [["box", "squat"], "箱式深蹲"],
  [["goblet", "squat"], "高脚杯深蹲"],
  [["belt", "squat"], "腰带深蹲"],
  [["hack", "squat"], "哈克深蹲"],
  [["sumo", "squat"], "相扑深蹲"],
  [["sissy", "squat"], "西西深蹲"],
  [["pin", "squat"], "钉架深蹲"],
  [["pause", "squat"], "暂停深蹲"],
  [["paused", "bench", "press"], "暂停卧推"],
  [["pause", "deadlift"], "暂停硬拉"],
  [["paused", "bench"], "暂停卧推"],
  [["bench", "press"], "卧推"],
  [["chest", "press"], "推胸"],
  [["shoulder", "press"], "肩推"],
  [["military", "press"], "军用推举"],
  [["landmine", "press"], "地雷杆推举"],
  [["viking", "press"], "维京推举"],
  [["log", "press"], "原木推举"],
  [["floor", "press"], "地板卧推"],
  [["push", "press"], "借力推举"],
  [["push", "jerk"], "借力挺举"],
  [["split", "jerk"], "分腿挺举"],
  [["power", "clean"], "力量翻举"],
  [["power", "snatch"], "力量抓举"],
  [["hang", "clean"], "悬垂翻举"],
  [["hang", "snatch"], "悬垂抓举"],
  [["clean", "and", "jerk"], "挺举"],
  [["clean", "and", "press"], "翻举推举"],
  [["pull", "ups"], "引体向上"],
  [["push", "ups"], "俯卧撑"],
  [["chin", "ups"], "反手引体向上"],
  [["muscle", "ups"], "双力臂"],
  [["handstand", "push", "ups"], "倒立俯卧撑"],
  [["pike", "push", "up"], "折刀俯卧撑"],
  [["diamond", "push", "ups"], "钻石俯卧撑"],
  [["bench", "dips"], "凳上臂屈伸"],
  [["leg", "extension"], "腿屈伸"],
  [["leg", "curl"], "腿弯举"],
  [["calf", "raise"], "提踵"],
  [["hip", "thrust"], "臀推"],
  [["glute", "bridge"], "臀桥"],
  [["good", "morning"], "早安式"],
  [["face", "pull"], "面拉"],
  [["upright", "row"], "直立划船"],
  [["bent", "over", "row"], "俯身划船"],
  [["pendlay", "row"], "潘德雷划船"],
  [["t", "bar", "row"], "T 杠划船"],
  [["yates", "row"], "耶茨划船"],
  [["seated", "cable", "row"], "坐姿绳索划船"],
  [["dumbbell", "row"], "哑铃划船"],
  [["hammer", "curl"], "锤式弯举"],
  [["preacher", "curl"], "牧师凳弯举"],
  [["strict", "curl"], "严格弯举"],
  [["barbell", "curl"], "杠铃弯举"],
  [["dumbbell", "curl"], "哑铃弯举"],
  [["tricep", "extension"], "三头屈伸"],
  [["tricep", "pushdown"], "三头下压"],
  [["lateral", "raise"], "侧平举"],
  [["front", "raise"], "前平举"],
  [["reverse", "fly"], "反向飞鸟"],
  [["leg", "raise"], "抬腿"],
  [["sit", "ups"], "仰卧起坐"],
  [["crunches"], "卷腹"],
  [["deadlift"], "硬拉"],
  [["pull", "up"], "引体向上"],
  [["push", "up"], "俯卧撑"],
  [["curl"], "弯举"],
  [["row"], "划船"],
  [["press"], "推举"],
  [["squat"], "深蹲"],
  [["lunge"], "弓步蹲"],
  [["dip"], "臂屈伸"],
  [["dips"], "双杠臂屈伸"],
  [["fly"], "飞鸟"],
  [["pullover"], "上拉"],
  [["snatch"], "抓举"],
  [["clean"], "翻举"],
  [["thruster"], "推蹲"],
  [["barbell"], "杠铃"],
  [["dumbbell"], "哑铃"],
  [["cable"], "绳索"],
  [["machine"], "器械"],
  [["smith", "machine"], "史密斯机"],
  [["incline"], "上斜"],
  [["decline"], "下斜"],
  [["front"], "前"],
  [["reverse"], "反向"],
  [["seated"], "坐姿"],
  [["standing"], "站姿"],
  [["walking"], "行走"],
  [["lying"], "仰卧"],
  [["overhead"], "过顶"],
];

function titleizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function translateExerciseSlugToZhCn(slug: string): string | null {
  if (EXERCISE_TRANSLATION_MAP[slug]) {
    return EXERCISE_TRANSLATION_MAP[slug];
  }

  const tokens = slug.split("-").filter(Boolean);
  if (tokens.length === 0) {
    return null;
  }

  const translatedSegments: string[] = [];
  let index = 0;

  while (index < tokens.length) {
    const match = PHRASE_TRANSLATION_ENTRIES.find(([phraseTokens]) =>
      phraseTokens.every((token, phraseIndex) => tokens[index + phraseIndex] === token),
    );

    if (match) {
      translatedSegments.push(match[1]);
      index += match[0].length;
      continue;
    }

    translatedSegments.push(titleizeToken(tokens[index]));
    index += 1;
  }

  return joinLocalizedSegments(translatedSegments);
}

export function buildExerciseNameParts(slug: string): ExerciseNameParts {
  const englishName = titleizeSlug(slug);
  const chineseName = translateExerciseSlugToZhCn(slug);

  if (!chineseName || chineseName === englishName) {
    return {
      primary: englishName,
      secondary: null,
      plainText: englishName,
    };
  }

  return {
    primary: chineseName,
    secondary: englishName,
    plainText: `${chineseName}（${englishName}）`,
  };
}

export function translateEnglishExerciseNameToZhCn(name: string): string | null {
  return translateExerciseSlugToZhCn(slugifyEnglishName(name));
}

export function buildExerciseNamePartsFromEnglishName(name: string): ExerciseNameParts {
  const chineseName = translateEnglishExerciseNameToZhCn(name);

  if (!chineseName || chineseName === name) {
    return {
      primary: name,
      secondary: null,
      plainText: name,
    };
  }

  return {
    primary: chineseName,
    secondary: name,
    plainText: `${chineseName}（${name}）`,
  };
}

export function buildExerciseDisplayName(slug: string): string {
  return buildExerciseNameParts(slug).plainText;
}

export function toDisplayExerciseName(slug: string): string {
  return buildExerciseNameParts(slug).primary;
}

export function buildComparisonDisplayName(leftSlug: string, rightSlug: string): string {
  return `${buildExerciseDisplayName(leftSlug)} vs ${buildExerciseDisplayName(rightSlug)}`;
}

function titleizeToken(token: string) {
  const tokenMap: Record<string, string> = {
    arnold: "Arnold",
    jm: "JM",
    ez: "EZ",
    t: "T",
    z: "Z",
  };

  return tokenMap[token] ?? token.charAt(0).toUpperCase() + token.slice(1);
}

function joinLocalizedSegments(segments: string[]) {
  return segments.reduce((result, segment) => {
    if (result.length === 0) {
      return segment;
    }

    const previousChar = result.at(-1) ?? "";
    const nextChar = segment.charAt(0);
    if (isAsciiLetter(previousChar) && isAsciiLetter(nextChar)) {
      return `${result} ${segment}`;
    }

    return `${result}${segment}`;
  }, "");
}

function isAsciiLetter(value: string) {
  return /^[A-Za-z]$/.test(value);
}

function slugifyEnglishName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export type { ExerciseNameParts };
