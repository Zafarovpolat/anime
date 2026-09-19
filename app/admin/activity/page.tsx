'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import AdminSortTh from '@/components/AdminSortTh';
import { useState, useRef, useEffect } from 'react';
import { useTableSort } from '@/lib/admin/table-sort';

/* Тип недавнего действия для журнала админки. */
type ActivityType = 'register' | 'chapter' | 'report' | 'restrict' | 'delete' | 'ban';
const TYPE_LABEL: Record<ActivityType, string> = {
  register: 'Регистрация',
  chapter: 'Новая глава',
  report: 'Жалоба',
  restrict: 'Ограничение',
  delete: 'Удаление',
  ban: 'Блокировка',
};
const TYPE_BADGE: Record<ActivityType, string> = {
  register: 'admin-badge--green',
  chapter: 'admin-badge--purple',
  report: 'admin-badge--warn',
  restrict: 'admin-badge--warn',
  delete: 'admin-badge--banned',
  ban: 'admin-badge--banned',
};

interface Activity {
  id: number;
  type: ActivityType;
  description: string;
  date: string;
}

const TYPES_ORDER: ActivityType[] = ['register', 'chapter', 'report', 'restrict', 'delete', 'ban'];
const DESCR: Record<ActivityType, string[]> = {
  register: ['Зарегистрирован NightWolf', 'Зарегистрирован ZeroOne', 'Зарегистрирован NeonByte'],
  chapter: ['Добавлена глава 42 «Наномашины»', 'Добавлена глава 7 «Мир Зомби»'],
  report: ['Жалоба на комментарий OtakuKing', 'Жалоба на пользователя IronFist'],
  restrict: ['Ограничен SakuraChan', 'Ограничен StarDust'],
  delete: ['Удалён комментарий #128', 'Удалено произведение «Таков закон»'],
  ban: ['Заблокирован MangaLover', 'Заблокирован VoidWalker'],
};

// Журнал: 30 записей, чтобы селектор количества имел смысл (10 / 25 / 50 / 100).
const ACTIVITY: Activity[] = Array.from({ length: 30 }, (_, i) => {
  const type = TYPES_ORDER[i % TYPES_ORDER.length];
  const variants = DESCR[type];
  const day = ((i * 3) % 28) + 1;
  const month = (i % 9) + 1;
  return {
    id: i + 1,
    type,
    description: variants[i % variants.length],
    date: `${String(day).padStart(2, '0')}.0${month}.2024`,
  };
});

// Сколько записей журнал сохраняет (по ТЗ: 10/30/60 тысяч).
const COUNTS = [10000, 30000, 60000];
const fmtCount = (n: number) => n.toLocaleString('ru-RU');

type ActivitySortKey = 'type' | 'description' | 'date';
const getActivityValue = (a: Activity, key: ActivitySortKey): string => key === 'type' ? TYPE_LABEL[a.type] : a[key];

export default function AdminActivityPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all');
  const [typeOpen, setTypeOpen] = useState(false);
  const [count, setCount] = useState(30000);
  const [countOpen, setCountOpen] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
      if (countRef.current && !countRef.current.contains(e.target as Node)) setCountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = ACTIVITY.filter(a =>
    (typeFilter === 'all' || a.type === typeFilter) &&
    (a.description.toLowerCase().includes(search.toLowerCase()) ||
      TYPE_LABEL[a.type].toLowerCase().includes(search.toLowerCase()))
  );
  const { sort, toggle, sorted } = useTableSort<Activity, ActivitySortKey>(filtered, getActivityValue);
  const visible = sorted.slice(0, count);

  return (
    <>
      <Header />
      <main className="main">
        <section className="section admin-section">
          <div className="container">
            <AdminLayout>
              <div className="admin-page__head">
                <h2 className="profile-content__title">НЕДАВНИЕ ДЕЙСТВИЯ</h2>
                <span className="admin-counter">хранится до {fmtCount(count)} записей</span>
              </div>

              <div className="admin-search-wrap">
                <label className="admin-search">
                  <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                    <path d="M23.3333 23.3333L18.4372 18.4372M18.4372 18.4372C20.0206 16.8537 21 14.6662 21 12.25C21 7.41751 17.0825 3.5 12.25 3.5C7.41751 3.5 3.5 7.41751 3.5 12.25C3.5 17.0825 7.41751 21 12.25 21C14.6662 21 16.8537 20.0206 18.4372 18.4372Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    className="admin-search__input"
                    type="text"
                    placeholder="Поиск по действию или типу..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </label>
                <div className="catalog-sort-wrapper" ref={typeRef}>
                  <button className="catalog-sort-btn" onClick={() => setTypeOpen(o => !o)}>
                    <span>{typeFilter === 'all' ? 'Все типы' : `Только: ${TYPE_LABEL[typeFilter].toLowerCase()}`}</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {typeOpen && (
                    <ul className="catalog-sort-dropdown">
                      <li
                        className={`catalog-sort-option${typeFilter === 'all' ? ' catalog-sort-option--active' : ''}`}
                        onClick={() => { setTypeFilter('all'); setTypeOpen(false); }}
                      >
                        Все типы
                      </li>
                      {TYPES_ORDER.map(t => (
                        <li
                          key={t}
                          className={`catalog-sort-option${typeFilter === t ? ' catalog-sort-option--active' : ''}`}
                          onClick={() => { setTypeFilter(t); setTypeOpen(false); }}
                        >
                          Только: {TYPE_LABEL[t].toLowerCase()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="catalog-sort-wrapper" ref={countRef}>
                  <button className="catalog-sort-btn" onClick={() => setCountOpen(o => !o)}>
                    <span>Хранить: {fmtCount(count)}</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {countOpen && (
                    <ul className="catalog-sort-dropdown">
                      {COUNTS.map(c => (
                        <li
                          key={c}
                          className={`catalog-sort-option${count === c ? ' catalog-sort-option--active' : ''}`}
                          onClick={() => { setCount(c); setCountOpen(false); }}
                        >
                          {fmtCount(c)} записей
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <AdminSortTh label="Тип" sortKey="type" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Действие" sortKey="description" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Дата" sortKey="date" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(item => (
                      <tr key={item.id} className="admin-table__row">
                        <td className="admin-table__td">
                          <span className={`admin-badge ${TYPE_BADGE[item.type]}`}>{TYPE_LABEL[item.type]}</span>
                        </td>
                        <td className="admin-table__td">{item.description}</td>
                        <td className="admin-table__td admin-table__td--muted">{item.date}</td>
                      </tr>
                    ))}
                    {visible.length === 0 && (
                      <tr><td colSpan={3} className="admin-table__empty">Действия не найдены</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AdminLayout>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
