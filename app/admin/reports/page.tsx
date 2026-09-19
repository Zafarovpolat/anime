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

/* Тип объекта жалобы — комментарий или пользователь. */
type ReportTarget = 'comment' | 'user';
const TARGET_LABEL: Record<ReportTarget, string> = { comment: 'Комментарий', user: 'Пользователь' };

interface Report {
  id: number;
  target: ReportTarget;
  subject: string;
  reason: string;
  reporter: string;
  date: string;
}

const REASONS = ['Спам', 'Оскорбления', 'Спойлер', 'Нецензурная лексика', 'Реклама', 'Флуд'];
const REPORTERS = ['Sempai_11','OtakuKing','MangaLover','DarkReader','SakuraChan','NightWolf','AniMax','ZeroOne'];

const REPORTS: Report[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  target: (i % 3 === 0 ? 'user' : 'comment') as ReportTarget,
  subject: i % 3 === 0 ? REPORTERS[(i + 2) % REPORTERS.length] : `«${['Автор дурак...', 'Купите по ссылке...', 'Спойлер финала...', 'Ааааа флуд', 'Реклама канала'][i % 5]}»`,
  reason: REASONS[i % REASONS.length],
  reporter: REPORTERS[i % REPORTERS.length],
  date: `${10 + i}.0${(i % 9) + 1}.2024`,
}));

type ReportSortKey = 'target' | 'subject' | 'reason' | 'reporter' | 'date';
const getReportValue = (r: Report, key: ReportSortKey): string => key === 'target' ? TARGET_LABEL[r.target] : r[key];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = reports.filter(r =>
    r.subject.toLowerCase().includes(search.toLowerCase()) ||
    r.reason.toLowerCase().includes(search.toLowerCase()) ||
    r.reporter.toLowerCase().includes(search.toLowerCase())
  );
  const { sort, toggle, sorted } = useTableSort<Report, ReportSortKey>(filtered, getReportValue);

  const remove = (id: number) => {
    setReports(prev => prev.filter(r => r.id !== id));
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
                <h2 className="profile-content__title">ЖАЛОБЫ</h2>
                <span className="admin-counter">{reports.length} жалоб</span>
              </div>

              <div className="admin-search-wrap">
                <label className="admin-search">
                  <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                    <path d="M23.3333 23.3333L18.4372 18.4372M18.4372 18.4372C20.0206 16.8537 21 14.6662 21 12.25C21 7.41751 17.0825 3.5 12.25 3.5C7.41751 3.5 3.5 7.41751 3.5 12.25C3.5 17.0825 7.41751 21 12.25 21C14.6662 21 16.8537 20.0206 18.4372 18.4372Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    className="admin-search__input"
                    type="text"
                    placeholder="Поиск по объекту, причине или автору жалобы..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </label>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <AdminSortTh label="Тип" sortKey="target" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Объект" sortKey="subject" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Причина" sortKey="reason" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Автор жалобы" sortKey="reporter" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Дата" sortKey="date" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <th className="admin-table__th admin-table__th--right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(report => (
                      <tr key={report.id} className="admin-table__row">
                        <td className="admin-table__td">
                          <span className={`admin-badge ${report.target === 'user' ? 'admin-badge--purple' : 'admin-badge--green'}`}>{TARGET_LABEL[report.target]}</span>
                        </td>
                        <td className="admin-table__td admin-table__td--bold admin-table__td--clamp">{report.subject}</td>
                        <td className="admin-table__td admin-table__td--muted">{report.reason}</td>
                        <td className="admin-table__td admin-table__td--muted">{report.reporter}</td>
                        <td className="admin-table__td admin-table__td--muted">{report.date}</td>
                        <td className="admin-table__td admin-table__td--right">
                          <div className="admin-table__actions">
                            <button className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-btn--icon" onClick={() => setDeleteId(report.id)} title="Удалить жалобу">
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {sorted.length === 0 && (
                      <tr><td colSpan={6} className="admin-table__empty">Жалобы не найдены</td></tr>
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
            <p className="admin-modal__text">Удалить жалобу?</p>
            <div className="admin-modal__btns">
              <button className="admin-btn admin-btn--danger" onClick={() => remove(deleteId)}>Удалить</button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteId(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
