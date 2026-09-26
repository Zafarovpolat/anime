'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import AdminSortTh from '@/components/AdminSortTh';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { WORK_TYPES, WORK_STATUSES, type AdminWork } from '@/lib/admin/mock-data';
import { useWorks, worksStore } from '@/lib/admin/works-store';
import { useTableSort } from '@/lib/admin/table-sort';

type WorkSortKey = 'title' | 'type' | 'status' | 'chapters' | 'author' | 'publisher';

const getWorkValue = (w: AdminWork, key: WorkSortKey): string | number =>
  key === 'chapters' ? w.chapters : w[key];

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

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function AdminWorksPage() {
  const works = useWorks();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [typeOpen, setTypeOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = works.filter(w =>
    (typeFilter === 'all' || w.type === typeFilter) &&
    (statusFilter === 'all' || w.status === statusFilter) &&
    (w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.author.toLowerCase().includes(search.toLowerCase()) ||
      w.publisher.toLowerCase().includes(search.toLowerCase()))
  );
  const { sort, toggle, sorted } = useTableSort<AdminWork, WorkSortKey>(filtered, getWorkValue);

  const confirmDelete = (id: number) => {
    worksStore.remove(id);
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
                    placeholder="Поиск по названию, автору или издателю..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </label>
                <div className="catalog-sort-wrapper" ref={typeRef}>
                  <button className="catalog-sort-btn" onClick={() => setTypeOpen(o => !o)}>
                    <span>{typeFilter === 'all' ? 'Все типы' : `Только ${typeFilter.toLowerCase()}`}</span>
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
                      {WORK_TYPES.map(t => (
                        <li
                          key={t}
                          className={`catalog-sort-option${typeFilter === t ? ' catalog-sort-option--active' : ''}`}
                          onClick={() => { setTypeFilter(t); setTypeOpen(false); }}
                        >
                          Только {t.toLowerCase()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="catalog-sort-wrapper" ref={statusRef}>
                  <button className="catalog-sort-btn" onClick={() => setStatusOpen(o => !o)}>
                    <span>{statusFilter === 'all' ? 'Все статусы' : statusFilter}</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {statusOpen && (
                    <ul className="catalog-sort-dropdown">
                      <li
                        className={`catalog-sort-option${statusFilter === 'all' ? ' catalog-sort-option--active' : ''}`}
                        onClick={() => { setStatusFilter('all'); setStatusOpen(false); }}
                      >
                        Все статусы
                      </li>
                      {WORK_STATUSES.map(s => (
                        <li
                          key={s}
                          className={`catalog-sort-option${statusFilter === s ? ' catalog-sort-option--active' : ''}`}
                          onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                        >
                          {s}
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
                      <th className="admin-table__th admin-table__th--center">Обложка</th>
                      <AdminSortTh label="Название" sortKey="title" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Тип" sortKey="type" activeKey={sort.key} direction={sort.direction} onSort={toggle} align="center" />
                      <AdminSortTh label="Статус" sortKey="status" activeKey={sort.key} direction={sort.direction} onSort={toggle} align="center" />
                      <AdminSortTh label="Глав" sortKey="chapters" activeKey={sort.key} direction={sort.direction} onSort={toggle} align="center" />
                      <AdminSortTh label="Автор" sortKey="author" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Издатель" sortKey="publisher" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <th className="admin-table__th admin-table__th--right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(work => (
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
                        <td className="admin-table__td admin-table__td--bold">
                          <Link href={`/manga/${work.id}`} className="admin-user__link" title="Открыть страницу произведения">{work.title}</Link>
                        </td>
                        <td className="admin-table__td admin-table__td--muted admin-table__td--center">
                          <Link href={`/catalog?type=${encodeURIComponent(work.type)}`} className="admin-user__link">{work.type}</Link>
                        </td>
                        <td className="admin-table__td admin-table__td--center">
                          <span className={`admin-badge ${work.status === 'Выходит' ? 'admin-badge--green' : 'admin-badge--purple'}`}>
                            {work.status}
                          </span>
                        </td>
                        <td className="admin-table__td admin-table__td--muted admin-table__td--center">{work.chapters}</td>
                        <td className="admin-table__td admin-table__td--muted">
                          <Link href={`/catalog?author=${encodeURIComponent(work.author)}`} className="admin-user__link">{work.author}</Link>
                        </td>
                        <td className="admin-table__td admin-table__td--muted">
                          <Link href={`/catalog?publisher=${encodeURIComponent(work.publisher)}`} className="admin-user__link">{work.publisher}</Link>
                        </td>
                        <td className="admin-table__td admin-table__td--right">
                          <div className="admin-table__actions">
                            <Link href={`/admin/chapters/add?work=${work.id}`} className="admin-btn admin-btn--sm admin-btn--ghost admin-btn--icon" title="Добавить главу">
                              <PlusIcon />
                            </Link>
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
                    {sorted.length === 0 && (
                      <tr><td colSpan={8} className="admin-table__empty">Ничего не найдено</td></tr>
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
            <p className="admin-modal__text">Удалить произведение? Оно переместится в корзину и будет храниться 7 дней — оттуда его можно вернуть.</p>
            <div className="admin-modal__btns">
              <button className="admin-btn admin-btn--danger" onClick={() => confirmDelete(deleteId)}>В корзину</button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteId(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {previewCover && (
        <div className="admin-overlay admin-cover-preview" onClick={() => setPreviewCover(null)}>
          <div className="admin-cover-preview__inner" onClick={e => e.stopPropagation()}>
            <img src={previewCover} alt="Обложка" className="admin-cover-preview__img" />
          </div>
        </div>
      )}
    </>
  );
}
