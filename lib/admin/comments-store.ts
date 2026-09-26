import { useSyncExternalStore } from 'react';

/* Общий стор комментариев и их корзины на время сессии (бэкенда нет).
   Список комментариев и корзина живут в одном месте, поэтому удаление на
   странице «Комментарии» и восстановление на странице «Корзина» видят одни
   данные. Состояние в памяти: при полной перезагрузке страницы сбрасывается. */

export type Comment = { id: number; username: string; text: string; work: string; date: string };

export interface TrashedComment extends Comment {
  deletedAt: number;
}

// Через сколько корзина окончательно удаляет комментарий (те же 7 дней, что у произведений).
export const COMMENT_TRASH_MS = 7 * 24 * 60 * 60 * 1000;

const INITIAL_COMMENTS: Comment[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  username: ['Sempai_11','OtakuKing','MangaLover','DarkReader','SakuraChan','NightWolf','AniMax','ZeroOne','StarDust','ShadowByte','CrystalMoon','IronFist','VoidWalker','NeonByte'][i],
  text: [
    'Надеюсь я дождусь до финала данного шедевра.',
    'Лучшая манга что я читал в этом году!',
    'Глава вышла раньше ожидаемого, спасибо!',
    'Перевод топовый, продолжайте в том же духе.',
    'Когда будет следующая глава?',
    'Сюжет становится всё интереснее и интереснее.',
    'Главный герой просто невероятный персонаж.',
    'Арт в этой главе просто потрясающий!',
    'Автор совсем дурак, испортил такую историю.',
    'Спасибо переводчику за быстрый выпуск.',
    'Это был неожиданный поворот сюжета.',
    'Читаю с самого начала, не разочарован.',
    'Когда выйдет новая глава?',
    'Эта арка лучшая во всей манге.',
  ][i],
  work: ['НАНОМАШИНЫ', 'Демон с нулевым рангом', 'Леди-малышка', 'Я — охотник', 'Выбери меня!', 'Наследник клана', 'НАНОМАШИНЫ', 'Тёмный охотник', 'Я стала дочерью', 'Леди-малышка', 'Выбери меня!', 'Демон', 'НАНОМАШИНЫ', 'Тёмный охотник'][i],
  date: `${10 + i}.0${(i % 9) + 1}.2024`,
}));

let comments: Comment[] = [...INITIAL_COMMENTS];
let trash: TrashedComment[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const commentsStore = {
  getComments: () => comments,
  getTrash: () => trash,

  // Удаление = перенос в корзину с отметкой времени.
  remove(id: number) {
    const target = comments.find(c => c.id === id);
    if (!target) return;
    comments = comments.filter(c => c.id !== id);
    trash = [{ ...target, deletedAt: Date.now() }, ...trash];
    emit();
  },

  // Возврат из корзины обратно в список (по возрастанию id).
  restore(id: number) {
    const target = trash.find(t => t.id === id);
    if (!target) return;
    trash = trash.filter(t => t.id !== id);
    const { deletedAt: _deletedAt, ...comment } = target;
    comments = [...comments, comment].sort((a, b) => a.id - b.id);
    emit();
  },

  // Окончательное удаление одного комментария из корзины.
  purge(id: number) {
    trash = trash.filter(t => t.id !== id);
    emit();
  },

  // Чистка записей, чей 7-дневный срок истёк (вызывается при заходе в корзину).
  purgeExpired() {
    const now = Date.now();
    const kept = trash.filter(t => now - t.deletedAt < COMMENT_TRASH_MS);
    if (kept.length !== trash.length) {
      trash = kept;
      emit();
    }
  },
};

export function useComments(): Comment[] {
  return useSyncExternalStore(subscribe, commentsStore.getComments, commentsStore.getComments);
}

export function useCommentsTrash(): TrashedComment[] {
  return useSyncExternalStore(subscribe, commentsStore.getTrash, commentsStore.getTrash);
}
