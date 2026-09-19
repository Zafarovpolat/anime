'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import AdminSortTh from '@/components/AdminSortTh';
import { useState } from 'react';
import { useTableSort } from '@/lib/admin/table-sort';

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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

/* Упрощённый словарь-заглушка для демонстрации автомодерации (без бэкенда — проверка на фронте) */
const FLAGGED_WORDS = ['дурак', 'идиот', 'кретин', 'мразь', 'сволочь', 'тупица'];
const isFlagged = (text: string) => FLAGGED_WORDS.some(w => text.toLowerCase().includes(w));

type Comment = { id: number; username: string; text: string; work: string; date: string };

const COMMENTS: Comment[] = Array.from({ length: 14 }, (_, i) => ({
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

type ModAction = 'ban' | 'restrict';
const MOD_LABEL: Record<ModAction, string> = { ban: 'заблокировать', restrict: 'ограничить' };
const MOD_STATUS: Record<ModAction, string> = { ban: 'Заблокирован', restrict: 'Ограничен' };

type CommentSortKey = 'username' | 'text' | 'work' | 'date';
const getCommentValue = (c: Comment, key: CommentSortKey): string => c[key];

export default function AdminCommentsPage() {
  const [comments, setComments] = useState(COMMENTS);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewComment, setViewComment] = useState<Comment | null>(null);
  // username -> применённая мера ('ban' | 'restrict'). Хранит модерацию прямо со страницы комментариев.
  const [moderated, setModerated] = useState<Record<string, ModAction>>({});
  const [modTarget, setModTarget] = useState<{ username: string; action: ModAction } | null>(null);
  const [reason, setReason] = useState('');

  const filtered = comments.filter(c =>
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.text.toLowerCase().includes(search.toLowerCase()) ||
    c.work.toLowerCase().includes(search.toLowerCase())
  );
  const { sort, toggle, sorted } = useTableSort<Comment, CommentSortKey>(filtered, getCommentValue);

  const remove = (id: number) => {
    setComments(prev => prev.filter(c => c.id !== id));
    setDeleteId(null);
  };

  const openMod = (username: string, action: ModAction) => {
    setReason('');
    setModTarget({ username, action });
  };

  const applyMod = () => {
    if (!modTarget) return;
    setModerated(prev => ({ ...prev, [modTarget.username]: modTarget.action }));
    setModTarget(null);
  };

  return (
    <>
      <Header />
      <main className="main">
        <section className="section admin-section">
          <div className="container">
            <AdminLayout>
              <div className="admin-page__head">
                <h2 className="profile-content__title">КОММЕНТАРИИ</h2>
                <span className="admin-counter">{comments.length} комментариев</span>
              </div>

              <div className="admin-search-wrap">
                <label className="admin-search">
                  <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                    <path d="M23.3333 23.3333L18.4372 18.4372M18.4372 18.4372C20.0206 16.8537 21 14.6662 21 12.25C21 7.41751 17.0825 3.5 12.25 3.5C7.41751 3.5 3.5 7.41751 3.5 12.25C3.5 17.0825 7.41751 21 12.25 21C14.6662 21 16.8537 20.0206 18.4372 18.4372Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    className="admin-search__input"
                    type="text"
                    placeholder="Поиск по пользователю, тексту или произведению..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </label>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <AdminSortTh label="Пользователь" sortKey="username" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Комментарий" sortKey="text" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Произведение" sortKey="work" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Дата" sortKey="date" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <th className="admin-table__th admin-table__th--right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(comment => {
                      const flagged = isFlagged(comment.text);
                      const mod = moderated[comment.username];
                      return (
                      <tr
                        key={comment.id}
                        className={`admin-table__row admin-table__row--clickable${flagged ? ' admin-table__row--flagged' : ''}`}
                        onClick={() => setViewComment(comment)}
                      >
                        <td className="admin-table__td admin-table__td--bold">
                          {comment.username}
                          {mod && <span className="admin-badge admin-badge--banned" style={{ marginLeft: 8 }}>{MOD_STATUS[mod]}</span>}
                        </td>
                        <td className="admin-table__td admin-table__td--muted admin-table__td--clamp">
                          {comment.text}
                          {flagged && <span className="admin-badge admin-badge--banned" style={{ marginLeft: 8 }}>Нецензурно</span>}
                        </td>
                        <td className="admin-table__td admin-table__td--muted">{comment.work}</td>
                        <td className="admin-table__td admin-table__td--muted">{comment.date}</td>
                        <td className="admin-table__td admin-table__td--right">
                          <div className="admin-table__actions">
                            {mod !== 'ban' && (
                              <button
                                className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-btn--icon"
                                onClick={e => { e.stopPropagation(); openMod(comment.username, 'ban'); }}
                                title="Заблокировать пользователя"
                              >
                                <BanIcon />
                              </button>
                            )}
                            {!mod && (
                              <button
                                className="admin-btn admin-btn--sm admin-btn--warn-ghost admin-btn--icon"
                                onClick={e => { e.stopPropagation(); openMod(comment.username, 'restrict'); }}
                                title="Ограничить пользователя"
                              >
                                <RestrictIcon />
                              </button>
                            )}
                            <button
                              className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-btn--icon"
                              onClick={e => { e.stopPropagation(); setDeleteId(comment.id); }}
                              title="Удалить"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                    {sorted.length === 0 && (
                      <tr><td colSpan={5} className="admin-table__empty">Комментарии не найдены</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AdminLayout>
          </div>
        </section>
      </main>
      <Footer />

      {viewComment && (
        <div className="admin-overlay" onClick={() => setViewComment(null)}>
          <div className="admin-modal admin-modal--comment" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__comment-meta">
              <span className="admin-modal__comment-user">{viewComment.username}</span>
              <span className="admin-modal__comment-dot">·</span>
              <span className="admin-modal__comment-work">{viewComment.work}</span>
              <span className="admin-modal__comment-dot">·</span>
              <span className="admin-modal__comment-date">{viewComment.date}</span>
            </div>
            <p className="admin-modal__comment-text">{viewComment.text}</p>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="admin-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <p className="admin-modal__text">Удалить комментарий?</p>
            <div className="admin-modal__btns">
              <button className="admin-btn admin-btn--danger" onClick={() => remove(deleteId)}>Удалить</button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteId(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {modTarget && (
        <div className="admin-overlay" onClick={() => setModTarget(null)}>
          <div className="admin-modal admin-modal--form" onClick={e => e.stopPropagation()}>
            <p className="admin-modal__text">Вы уверены, что хотите <strong>{MOD_LABEL[modTarget.action]}</strong> пользователя <strong>{modTarget.username}</strong>?</p>
            <div className="admin-modal__field">
              <label className="admin-modal__label">Причина {modTarget.action === 'ban' ? 'блокировки' : 'ограничения'}</label>
              <textarea
                className="admin-textarea admin-textarea--sm"
                rows={3}
                placeholder="Опишите причину..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                autoFocus
              />
            </div>
            <div className="admin-modal__btns">
              <button className="admin-btn admin-btn--danger" onClick={applyMod}>Подтвердить</button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setModTarget(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
