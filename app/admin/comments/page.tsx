'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

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

export default function AdminCommentsPage() {
  const [comments, setComments] = useState(COMMENTS);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewComment, setViewComment] = useState<Comment | null>(null);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [banTarget, setBanTarget] = useState<{ id: number; username: string } | null>(null);

  const filtered = comments.filter(c =>
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.text.toLowerCase().includes(search.toLowerCase()) ||
    c.work.toLowerCase().includes(search.toLowerCase())
  );

  const remove = (id: number) => {
    setComments(prev => prev.filter(c => c.id !== id));
    setDeleteId(null);
  };

  const banForProfanity = (username: string) => {
    setBannedUsers(prev => prev.includes(username) ? prev : [...prev, username]);
    setBanTarget(null);
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
                    placeholder="Поиск по автору, тексту или произведению..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </label>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-table__th">Пользователь</th>
                      <th className="admin-table__th">Комментарий</th>
                      <th className="admin-table__th">Произведение</th>
                      <th className="admin-table__th">Дата</th>
                      <th className="admin-table__th admin-table__th--right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(comment => {
                      const flagged = isFlagged(comment.text);
                      const banned = bannedUsers.includes(comment.username);
                      return (
                      <tr
                        key={comment.id}
                        className={`admin-table__row admin-table__row--clickable${flagged ? ' admin-table__row--flagged' : ''}`}
                        onClick={() => setViewComment(comment)}
                      >
                        <td className="admin-table__td admin-table__td--bold">
                          {comment.username}
                          {banned && <span className="admin-badge admin-badge--banned" style={{ marginLeft: 8 }}>Заблокирован</span>}
                        </td>
                        <td className="admin-table__td admin-table__td--muted admin-table__td--clamp">
                          {comment.text}
                          {flagged && <span className="admin-badge admin-badge--banned" style={{ marginLeft: 8 }}>Нецензурно</span>}
                        </td>
                        <td className="admin-table__td admin-table__td--muted">{comment.work}</td>
                        <td className="admin-table__td admin-table__td--muted">{comment.date}</td>
                        <td className="admin-table__td admin-table__td--right">
                          <div className="admin-table__actions">
                            {flagged && !banned && (
                              <button
                                className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-btn--icon"
                                onClick={e => { e.stopPropagation(); setBanTarget({ id: comment.id, username: comment.username }); }}
                                title="Забанить за нецензурную лексику"
                              >
                                <BanIcon />
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
                    {filtered.length === 0 && (
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

      {banTarget && (
        <div className="admin-overlay" onClick={() => setBanTarget(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <p className="admin-modal__text">Заблокировать пользователя <strong>{banTarget.username}</strong> за нецензурную лексику?</p>
            <div className="admin-modal__btns">
              <button className="admin-btn admin-btn--danger" onClick={() => banForProfanity(banTarget.username)}>Заблокировать</button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setBanTarget(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
