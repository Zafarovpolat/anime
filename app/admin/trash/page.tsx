'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import AdminSortTh from '@/components/AdminSortTh';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTrash, worksStore, TRASH_MS, type TrashedWork } from '@/lib/admin/works-store';
import { useCommentsTrash, commentsStore, COMMENT_TRASH_MS, type TrashedComment } from '@/lib/admin/comments-store';
import { useTableSort } from '@/lib/admin/table-sort';

const DAY_MS = 24 * 60 * 60 * 1000;

function RestoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 12A9 9 0 1 0 6 5.3M3 4V9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

type TrashSortKey = 'title' | 'type' | 'deletedAt';
const getWorkValue = (t: TrashedWork, key: TrashSortKey): string | number =>
  key === 'deletedAt' ? t.deletedAt : t[key];

type CommentTrashSortKey = 'username' | 'text' | 'deletedAt';
const getCommentValue = (t: TrashedComment, key: CommentTrashSortKey): string | number =>
  key === 'deletedAt' ? t.deletedAt : t[key];

const formatDate = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
};
const daysLeft = (deletedAt: number, ttl: number) => Math.max(0, Math.ceil((deletedAt + ttl - Date.now()) / DAY_MS));

export default function AdminTrashPage() {
  const works = useTrash();
  const comments = useCommentsTrash();
  // purge = { kind, id } — что подтверждаем к окончательному удалению.
  const [purge, setPurge] = useState<{ kind: 'work' | 'comment'; id: number } | null>(null);

  // При заходе в корзину убираем записи, чей 7-дневный срок истёк.
  useEffect(() => {
    worksStore.purgeExpired();
    commentsStore.purgeExpired();
  }, []);

  const worksSort = useTableSort<TrashedWork, TrashSortKey>(works, getWorkValue);
  const commentsSort = useTableSort<TrashedComment, CommentTrashSortKey>(comments, getCommentValue);

  const total = works.length + comments.length;

  return (
    <>
      <Header />
      <main className="main">
        <section className="section admin-section">
          <div className="container">
            <AdminLayout>
              <div className="admin-page__head">
                <h2 className="profile-content__title">КОРЗИНА</h2>
                <span className="admin-counter">{total} в корзине · хранится 7 дней</span>
              </div>

              <h3 className="admin-subhead">Произведения · {works.length}</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-table__th admin-table__th--center">Обложка</th>
                      <AdminSortTh label="Название" sortKey="title" activeKey={worksSort.sort.key} direction={worksSort.sort.direction} onSort={worksSort.toggle} />
                      <AdminSortTh label="Тип" sortKey="type" activeKey={worksSort.sort.key} direction={worksSort.sort.direction} onSort={worksSort.toggle} align="center" />
                      <AdminSortTh label="Удалено" sortKey="deletedAt" activeKey={worksSort.sort.key} direction={worksSort.sort.direction} onSort={worksSort.toggle} />
                      <th className="admin-table__th">Осталось</th>
                      <th className="admin-table__th admin-table__th--right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {worksSort.sorted.map(work => (
                      <tr key={work.id} className="admin-table__row">
                        <td className="admin-table__td admin-table__td--center">
                          <div className="admin-table__cover">
                            <Image src={work.cover} alt={work.title} fill sizes="48px" style={{ objectFit: 'cover' }} />
                          </div>
                        </td>
                        <td className="admin-table__td admin-table__td--bold">{work.title}</td>
                        <td className="admin-table__td admin-table__td--muted admin-table__td--center">{work.type}</td>
                        <td className="admin-table__td admin-table__td--muted">{formatDate(work.deletedAt)}</td>
                        <td className="admin-table__td">
                          <span className="admin-badge admin-badge--warn">{daysLeft(work.deletedAt, TRASH_MS)} дн.</span>
                        </td>
                        <td className="admin-table__td admin-table__td--right">
                          <div className="admin-table__actions">
                            <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => worksStore.restore(work.id)} title="Восстановить">
                              <RestoreIcon />
                              Восстановить
                            </button>
                            <button className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-btn--icon" onClick={() => setPurge({ kind: 'work', id: work.id })} title="Удалить навсегда">
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {worksSort.sorted.length === 0 && (
                      <tr><td colSpan={6} className="admin-table__empty">Здесь пусто</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <h3 className="admin-subhead">Комментарии · {comments.length}</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <AdminSortTh label="Пользователь" sortKey="username" activeKey={commentsSort.sort.key} direction={commentsSort.sort.direction} onSort={commentsSort.toggle} />
                      <AdminSortTh label="Комментарий" sortKey="text" activeKey={commentsSort.sort.key} direction={commentsSort.sort.direction} onSort={commentsSort.toggle} />
                      <AdminSortTh label="Удалено" sortKey="deletedAt" activeKey={commentsSort.sort.key} direction={commentsSort.sort.direction} onSort={commentsSort.toggle} />
                      <th className="admin-table__th">Осталось</th>
                      <th className="admin-table__th admin-table__th--right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentsSort.sorted.map(comment => (
                      <tr key={comment.id} className="admin-table__row">
                        <td className="admin-table__td admin-table__td--bold">{comment.username}</td>
                        <td className="admin-table__td admin-table__td--muted admin-table__td--clamp">{comment.text}</td>
                        <td className="admin-table__td admin-table__td--muted">{formatDate(comment.deletedAt)}</td>
                        <td className="admin-table__td">
                          <span className="admin-badge admin-badge--warn">{daysLeft(comment.deletedAt, COMMENT_TRASH_MS)} дн.</span>
                        </td>
                        <td className="admin-table__td admin-table__td--right">
                          <div className="admin-table__actions">
                            <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => commentsStore.restore(comment.id)} title="Восстановить">
                              <RestoreIcon />
                              Восстановить
                            </button>
                            <button className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-btn--icon" onClick={() => setPurge({ kind: 'comment', id: comment.id })} title="Удалить навсегда">
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {commentsSort.sorted.length === 0 && (
                      <tr><td colSpan={5} className="admin-table__empty">Здесь пусто</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AdminLayout>
          </div>
        </section>
      </main>
      <Footer />

      {purge !== null && (
        <div className="admin-overlay" onClick={() => setPurge(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <p className="admin-modal__text">
              {purge.kind === 'work'
                ? 'Удалить произведение навсегда? Это действие нельзя отменить.'
                : 'Удалить комментарий навсегда? Это действие нельзя отменить.'}
            </p>
            <div className="admin-modal__btns">
              <button
                className="admin-btn admin-btn--danger"
                onClick={() => {
                  if (purge.kind === 'work') worksStore.purge(purge.id);
                  else commentsStore.purge(purge.id);
                  setPurge(null);
                }}
              >
                Удалить навсегда
              </button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setPurge(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
