'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

const MOCK_WORKS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  cover: `/images/cover_${(i % 12) + 1}.jpg`,
  title: [
    'Наномашины', 'Мир Зомби', 'Истинная красота', 'Следуйте за своим сердцем',
    'Таков закон', 'Выбери меня!', 'Игрок падшего дворянского рода',
    'Леди-малышка изменяет мир деньгами', 'Присцилла просит о замужестве',
    'План перерожденного наёмника',
  ][i],
  type: 'Манга',
  status: i % 3 === 0 ? 'Завершено' : 'Выходит',
  chapters: 40 + i * 12,
  author: 'Автор ' + (i + 1),
}));

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

export default function AdminWorksPage() {
  const [works, setWorks] = useState(MOCK_WORKS);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);

  const filtered = works.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setWorks(prev => prev.filter(w => w.id !== id));
    setDeleteId(null);
  };

  return (
    <>
      <Header />
      <main className="main">
        <section className="section admin-section">
          <div className="container">
            <AdminLayout>
              <div className="admin-page__head">
                <h2 className="profile-content__title">ПРОИЗВЕДЕНИЯ</h2>
                <div className="admin-page__head-actions">
                  <Link href="/admin/chapters/add" className="admin-btn admin-btn--ghost">
                    Добавить главу
                  </Link>
                  <Link href="/admin/works/add" className="admin-btn admin-btn--primary">
                    Добавить произведение
                  </Link>
                </div>
              </div>

              <div className="admin-search-wrap">
                <label className="admin-search">
                  <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                    <path d="M23.3333 23.3333L18.4372 18.4372M18.4372 18.4372C20.0206 16.8537 21 14.6662 21 12.25C21 7.41751 17.0825 3.5 12.25 3.5C7.41751 3.5 3.5 7.41751 3.5 12.25C3.5 17.0825 7.41751 21 12.25 21C14.6662 21 16.8537 20.0206 18.4372 18.4372Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    className="admin-search__input"
                    type="text"
                    placeholder="Поиск по названию..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </label>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-table__th admin-table__th--center">Обложка</th>
                      <th className="admin-table__th">Название</th>
                      <th className="admin-table__th admin-table__th--center">Тип</th>
                      <th className="admin-table__th admin-table__th--center">Статус</th>
                      <th className="admin-table__th admin-table__th--center">Глав</th>
                      <th className="admin-table__th">Автор</th>
                      <th className="admin-table__th admin-table__th--right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(work => (
                      <tr key={work.id} className="admin-table__row">
                        <td className="admin-table__td admin-table__td--center">
                          <div
                            className="admin-table__cover admin-table__cover--clickable"
                            onClick={() => setPreviewCover(work.cover)}
                            title="Открыть обложку"
                          >
                            <Image src={work.cover} alt={work.title} fill sizes="48px" style={{ objectFit: 'cover' }} />
                          </div>
                        </td>
                        <td className="admin-table__td admin-table__td--bold">{work.title}</td>
                        <td className="admin-table__td admin-table__td--muted admin-table__td--center">{work.type}</td>
                        <td className="admin-table__td admin-table__td--center">
                          <span className={`admin-badge ${work.status === 'Выходит' ? 'admin-badge--green' : 'admin-badge--purple'}`}>
                            {work.status}
                          </span>
                        </td>
                        <td className="admin-table__td admin-table__td--muted admin-table__td--center">{work.chapters}</td>
                        <td className="admin-table__td admin-table__td--muted">{work.author}</td>
                        <td className="admin-table__td admin-table__td--right">
                          <div className="admin-table__actions">
                            <Link href={`/admin/works/add?edit=${work.id}`} className="admin-btn admin-btn--sm admin-btn--ghost admin-btn--icon" title="Редактировать">
                              <PencilIcon />
                            </Link>
                            <button className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-btn--icon" onClick={() => setDeleteId(work.id)} title="Удалить">
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} className="admin-table__empty">Ничего не найдено</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AdminLayout>
          </div>
        </section>
      </main>
      <Footer />

      {deleteId !== null && (
        <div className="admin-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <p className="admin-modal__text">Удалить произведение?</p>
            <div className="admin-modal__btns">
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(deleteId)}>Удалить</button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteId(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {previewCover && (
        <div className="admin-overlay admin-cover-preview" onClick={() => setPreviewCover(null)}>
          <div className="admin-cover-preview__inner" onClick={e => e.stopPropagation()}>
            <img src={previewCover} alt="Обложка" className="admin-cover-preview__img" />
            <button className="admin-cover-preview__close" onClick={() => setPreviewCover(null)}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}
