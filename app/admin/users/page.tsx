'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

function BanIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M4.93 4.93L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function RestrictIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function UnbanIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

type Status = 'active' | 'banned' | 'restricted';

const STATUS_LABEL: Record<Status, string> = { active: 'Активен', banned: 'Заблокирован', restricted: 'Ограничен' };

const USERS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  avatar: i < 3 ? `/images/avatar${i + 1}.png` : '',
  username: ['Sempai_11','OtakuKing','MangaLover','DarkReader','SakuraChan','NightWolf','AniMax','ZeroOne','StarDust','ShadowByte','CrystalMoon','IronFist'][i],
  email: `user${i + 1}@example.com`,
  registered: `${10 + i}.0${(i % 9) + 1}.2024`,
  status: (i === 2 ? 'banned' : i === 5 ? 'restricted' : 'active') as Status,
}));

type Action = 'ban' | 'restrict' | 'unban';
const ACTION_LABEL: Record<Action, string> = { ban: 'заблокировать', restrict: 'ограничить', unban: 'разблокировать' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [confirm, setConfirm] = useState<{ id: number; action: Action } | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = users.filter(u =>
    (filter === 'all' || u.status === filter) &&
    (u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const apply = (id: number, action: Action) => {
    setUsers(prev => prev.map(u => u.id !== id ? u : { ...u, status: action === 'ban' ? 'banned' : action === 'restrict' ? 'restricted' : 'active' }));
    setConfirm(null);
  };

  return (
    <>
      <Header />
      <main className="main">
        <section className="section admin-section">
          <div className="container">
            <AdminLayout>
              <div className="admin-page__head">
                <h2 className="profile-content__title">ПОЛЬЗОВАТЕЛИ</h2>
                <span className="admin-counter">{users.length} аккаунтов</span>
              </div>

              <div className="admin-search-wrap">
                <label className="admin-search">
                  <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                    <path d="M23.3333 23.3333L18.4372 18.4372M18.4372 18.4372C20.0206 16.8537 21 14.6662 21 12.25C21 7.41751 17.0825 3.5 12.25 3.5C7.41751 3.5 3.5 7.41751 3.5 12.25C3.5 17.0825 7.41751 21 12.25 21C14.6662 21 16.8537 20.0206 18.4372 18.4372Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input className="admin-search__input" type="text" placeholder="Поиск по нику или email..." value={search} onChange={e => setSearch(e.target.value)} />
                </label>
                <div className="catalog-sort-wrapper" ref={filterRef}>
                  <button className="catalog-sort-btn" onClick={() => setFilterOpen(o => !o)}>
                    <span>{filter === 'all' ? 'Все' : STATUS_LABEL[filter]}</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {filterOpen && (
                    <ul className="catalog-sort-dropdown">
                      {(['all', 'active', 'restricted', 'banned'] as const).map(s => (
                        <li
                          key={s}
                          className={`catalog-sort-option${filter === s ? ' catalog-sort-option--active' : ''}`}
                          onClick={() => { setFilter(s); setFilterOpen(false); }}
                        >
                          {s === 'all' ? 'Все' : STATUS_LABEL[s]}
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
                      <th className="admin-table__th">Пользователь</th>
                      <th className="admin-table__th">Email</th>
                      <th className="admin-table__th">Регистрация</th>
                      <th className="admin-table__th">Статус</th>
                      <th className="admin-table__th admin-table__th--right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(user => (
                      <tr key={user.id} className="admin-table__row">
                        <td className="admin-table__td">
                          <div className="admin-user">
                            <div className="admin-user__avatar">
                              {user.avatar
                                ? <Image src={user.avatar} alt={user.username} fill sizes="40px" style={{ objectFit:'cover' }} />
                                : <span className="admin-user__initial">{user.username[0].toUpperCase()}</span>
                              }
                            </div>
                            <span className="admin-table__td--bold">{user.username}</span>
                          </div>
                        </td>
                        <td className="admin-table__td admin-table__td--muted">{user.email}</td>
                        <td className="admin-table__td admin-table__td--muted">{user.registered}</td>
                        <td className="admin-table__td">
                          <span className={`admin-badge admin-badge--${user.status}`}>{STATUS_LABEL[user.status]}</span>
                        </td>
                        <td className="admin-table__td admin-table__td--right">
                          <div className="admin-table__actions">
                            {user.status !== 'banned' && (
                              <button className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-btn--icon" title="Заблокировать" onClick={() => setConfirm({ id: user.id, action: 'ban' })}><BanIcon /></button>
                            )}
                            {user.status === 'active' && (
                              <button className="admin-btn admin-btn--sm admin-btn--warn-ghost admin-btn--icon" title="Ограничить" onClick={() => setConfirm({ id: user.id, action: 'restrict' })}><RestrictIcon /></button>
                            )}
                            {user.status !== 'active' && (
                              <button className="admin-btn admin-btn--sm admin-btn--ghost admin-btn--icon" title="Разблокировать" onClick={() => setConfirm({ id: user.id, action: 'unban' })}><UnbanIcon /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={5} className="admin-table__empty">Пользователи не найдены</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AdminLayout>
          </div>
        </section>
      </main>
      <Footer />

      {confirm && (
        <div className="admin-overlay" onClick={() => setConfirm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <p className="admin-modal__text">Вы уверены, что хотите <strong>{ACTION_LABEL[confirm.action]}</strong> пользователя?</p>
            <div className="admin-modal__btns">
              <button className={`admin-btn ${confirm.action === 'unban' ? 'admin-btn--primary' : 'admin-btn--danger'}`} onClick={() => apply(confirm.id, confirm.action)}>Подтвердить</button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setConfirm(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
