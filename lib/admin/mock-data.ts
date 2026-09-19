/* Единый mock-источник данных админки.
   Раньше произведения жили массивом прямо в app/admin/works/page.tsx, из-за чего
   форма редактирования не могла подставить данные (открывалась пустой). Теперь и
   список, и форма, и выбор главы читают один источник. Бэкенда нет — данные
   держатся в памяти на время сессии. */

export interface AdminWork {
  id: number;
  cover: string;
  title: string;
  type: string;
  status: string;
  chapters: number;
  author: string;
  publisher: string;
  year: string;
  description: string;
  genres: string[];
}

const TITLES = [
  'Наномашины', 'Мир Зомби', 'Истинная красота', 'Следуйте за своим сердцем',
  'Таков закон', 'Выбери меня!', 'Игрок падшего дворянского рода',
  'Леди-малышка изменяет мир деньгами', 'Присцилла просит о замужестве',
  'План перерожденного наёмника',
];
const TYPES = ['Манга', 'Манхва', 'Маньхуа', 'Руманга'];
const PUBLISHERS = ['Shueisha', 'Kakao', 'Naver', 'Kodansha', 'Bilibili'];
const STATUSES = ['Выходит', 'Завершено', 'Анонс', 'Заморожено'];

export const ADMIN_WORKS: AdminWork[] = TITLES.map((title, i) => ({
  id: i + 1,
  cover: `/images/cover_${(i % 12) + 1}.jpg`,
  title,
  type: TYPES[i % TYPES.length],
  status: STATUSES[i % STATUSES.length],
  chapters: 40 + i * 12,
  author: 'Автор ' + (i + 1),
  publisher: PUBLISHERS[i % PUBLISHERS.length],
  year: String(2024 - (i % 6)),
  description: 'Краткое описание произведения «' + title + '» для демонстрации.',
  genres: i % 2 === 0 ? ['Фэнтези', 'Приключения'] : ['Драма', 'Романтика'],
}));

export const WORK_TYPES = TYPES;
export const WORK_STATUSES = STATUSES;
