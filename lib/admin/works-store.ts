import { useSyncExternalStore } from 'react';
import { ADMIN_WORKS, type AdminWork } from './mock-data';

/* Общий стор произведений и корзины на время сессии (бэкенда нет).
   Список и корзина живут в одном месте, поэтому удаление на странице
   «Произведения» и восстановление на странице «Корзина» видят одни данные.
   Состояние в памяти: при полной перезагрузке страницы оно сбрасывается. */

export interface TrashedWork extends AdminWork {
  deletedAt: number;
}

// Через сколько корзина окончательно удаляет запись.
export const TRASH_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

let works: AdminWork[] = [...ADMIN_WORKS];
let trash: TrashedWork[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const worksStore = {
  getWorks: () => works,
  getTrash: () => trash,

  // Удаление = перенос в корзину с отметкой времени.
  remove(id: number) {
    const target = works.find(w => w.id === id);
    if (!target) return;
    works = works.filter(w => w.id !== id);
    trash = [{ ...target, deletedAt: Date.now() }, ...trash];
    emit();
  },

  // Возврат из корзины обратно в список (по возрастанию id).
  restore(id: number) {
    const target = trash.find(t => t.id === id);
    if (!target) return;
    trash = trash.filter(t => t.id !== id);
    const { deletedAt: _deletedAt, ...work } = target;
    works = [...works, work].sort((a, b) => a.id - b.id);
    emit();
  },

  // Окончательное удаление одной записи из корзины.
  purge(id: number) {
    trash = trash.filter(t => t.id !== id);
    emit();
  },

  // Чистка записей, чей 7-дневный срок истёк (вызывается при заходе в корзину).
  purgeExpired() {
    const now = Date.now();
    const kept = trash.filter(t => now - t.deletedAt < TRASH_MS);
    if (kept.length !== trash.length) {
      trash = kept;
      emit();
    }
  },
};

export function useWorks(): AdminWork[] {
  return useSyncExternalStore(subscribe, worksStore.getWorks, worksStore.getWorks);
}

export function useTrash(): TrashedWork[] {
  return useSyncExternalStore(subscribe, worksStore.getTrash, worksStore.getTrash);
}
