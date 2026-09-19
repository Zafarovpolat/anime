import { useMemo, useState } from 'react';

/* Переиспользуемая сортировка таблиц админки.
   Клик по заголовку колонки переключает asc → desc → asc. Функцию доступа к
   значению колонки нужно объявлять на уровне модуля (вне компонента), чтобы её
   ссылка была стабильной и хук не пересортировывал список на каждый рендер. */

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string> {
  key: K | null;
  direction: SortDirection;
}

export function useTableSort<T, K extends string>(
  rows: readonly T[],
  getValue: (row: T, key: K) => string | number,
  initial?: { key: K; direction?: SortDirection },
) {
  const [sort, setSort] = useState<SortState<K>>({
    key: initial?.key ?? null,
    direction: initial?.direction ?? 'asc',
  });

  const toggle = (key: K) =>
    setSort(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );

  const sorted = useMemo(() => {
    if (!sort.key) return rows.slice();
    const key = sort.key;
    const factor = sort.direction === 'asc' ? 1 : -1;
    return rows.slice().sort((a, b) => {
      const av = getValue(a, key);
      const bv = getValue(b, key);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
      return String(av).localeCompare(String(bv), 'ru') * factor;
    });
  }, [rows, sort, getValue]);

  return { sort, toggle, sorted };
}
