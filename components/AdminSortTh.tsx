'use client';

import type { SortDirection } from '@/lib/admin/table-sort';

/* Заголовок сортируемой колонки: клик вызывает onSort(sortKey), стрелка
   показывает активную колонку и направление. Используется всеми таблицами
   админки, чтобы поведение и вид сортировки были одинаковыми. */

interface AdminSortThProps<K extends string> {
  label: string;
  sortKey: K;
  activeKey: K | null;
  direction: SortDirection;
  onSort: (key: K) => void;
  align?: 'left' | 'center' | 'right';
}

export default function AdminSortTh<K extends string>({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  align = 'left',
}: AdminSortThProps<K>) {
  const active = activeKey === sortKey;
  const alignClass =
    align === 'right' ? ' admin-table__th--right' : align === 'center' ? ' admin-table__th--center' : '';

  return (
    <th
      className={`admin-table__th admin-table__th--sortable${alignClass}`}
      onClick={() => onSort(sortKey)}
      aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span className="admin-table__th-inner">
        {label}
        <span
          className={`admin-table__sort${active ? ' admin-table__sort--active' : ''}${
            active && direction === 'desc' ? ' admin-table__sort--desc' : ''
          }`}
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </th>
  );
}
