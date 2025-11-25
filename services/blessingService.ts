const aphorisms = [
  '万法由心生，心静则世界澄明。',
  '放下执念，万物自得其所。',
  '因缘如网，善念即是光明之线。',
  '行住坐卧，皆可修行；一呼一吸，皆是禅意。',
  '慈悲为本，智慧为门，勇猛精进。',
  '念念不住，念念皆空；心心相印，心心自在。',
];

export const generateBlessing = (wish: string): string => {
  const trimmed = wish.trim();
  const blessing = aphorisms[Math.floor(Math.random() * aphorisms.length)];
  return [
    trimmed ? `听到你的心愿：「${trimmed}」。` : '心愿未语，已闻心声。',
    blessing,
    '愿你诸事顺遂，身心清凉。'
  ].join(' ');
};
