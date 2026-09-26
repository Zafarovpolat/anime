'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import AdminSortTh from '@/components/AdminSortTh';
import CustomSelect from '@/components/CustomSelect';
import Link from 'next/link';
import { useState } from 'react';
import { useTableSort, parseRuDate } from '@/lib/admin/table-sort';

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
  accused: string;
  reason: string;
  reporter: string;
  date: string;
}

const REASONS = ['Спам', 'Оскорбления', 'Спойлер', 'Нецензурная лексика', 'Реклама', 'Флуд'];
const REPORTERS = ['Sempai_11','OtakuKing','MangaLover','DarkReader','SakuraChan','NightWolf','AniMax','ZeroOne'];
const ACCUSED = ['ToxicGuy','SpamBot','LeakLord','FloodKing','AdMan','RudeOne','ZeroTwo','DarkByte'];

const REPORTS: Report[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  target: (i % 3 === 0 ? 'user' : 'comment') as ReportTarget,
  subject: i % 3 === 0 ? ACCUSED[i % ACCUSED.length] : `«${['Автор дурак...', 'Купите по ссылке...', 'Спойлер финала...', 'Ааааа флуд', 'Реклама канала'][i % 5]}»`,
  accused: ACCUSED[i % ACCUSED.length],
  reason: REASONS[i % REASONS.length],
  reporter: REPORTERS[i % REPORTERS.length],
  date: `${10 + i}.0${(i % 9) + 1}.2024`,
}));

/* Меры, которые можно применить к нарушителю прямо из жалобы (D17 — степень ограничения). */
const MEASURES = ['Заблокировать', 'Ограничить', 'Предупреждение'];

type ReportSortKey = 'target' | 'subject' | 'accused' | 'reason' | 'reporter' | 'date';
const getReportValue = (r: Report, key: ReportSortKey): string | number =>
  key === 'target' ? TARGET_LABEL[r.target] : key === 'date' ? parseRuDate(r.date) : r[key];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  // id жалоб, по которым уже приняты меры — чтобы не обрабатывать повторно.
  const [resolved, setResolved] = useState<Record<number, string>>({});
  const [modTarget, setModTarget] = useState<Report | null>(null);
  const [measure, setMeasure] = useState('');
  const [reason, setReason] = useState('');

  const filtered = reports.filter(r =>
    r.subject.toLowerCase().includes(search.toLowerCase()) ||
    r.accused.toLowerCase().includes(search.toLowerCase()) ||
    r.reason.toLowerCase().includes(search.toLowerCase()) ||
    r.reporter.toLowerCase().includes(search.toLowerCase())
  );
  const { sort, toggle, sorted } = useTableSort<Report, ReportSortKey>(filtered, getReportValue);

  const remove = (id: number) => {
    setReports(prev => prev.filter(r => r.id !== id));
    setDeleteId(null);
  };

  const openMod = (report: Report) => {
    setMeasure('');
    setReason('');
    setModTarget(report);
  };

  const applyMod = () => {
    if (!modTarget || !measure) return;
    setResolved(prev => ({ ...prev, [modTarget.id]: measure }));
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
                      <AdminSortTh label="На что жалоба" sortKey="subject" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
                      <AdminSortTh label="Нарушитель" sortKey="accused" activeKey={sort.key} direction={sort.direction} onSort={toggle} />
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
                        <td className="admin-table__td">
                          <Link href="/profile" className="admin-user__link">{report.accused}</Link>
                        </td>
                        <td className="admin-table__td admin-table__td--muted">{report.reason}</td>
                        <td className="admin-table__td admin-table__td--muted">{report.reporter}</td>
                        <td className="admin-table__td admin-table__td--muted">{report.date}</td>
                        <td className="admin-table__td admin-table__td--right">
                          {resolved[report.id] ? (
                            <span className="admin-badge admin-badge--green">Обработана · {resolved[report.id]}</span>
                          ) : (
                            <div className="admin-table__actions">
                              <button className="admin-btn admin-btn--sm admin-btn--ghost admin-btn--icon" onClick={() => openMod(report)} title="Принять меры к нарушителю">
                                <ShieldIcon />
                              </button>
                              <button className="admin-btn admin-btn--sm admin-btn--danger-ghost admin-btn--icon" onClick={() => setDeleteId(report.id)} title="Отклонить жалобу">
                                <TrashIcon />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {sorted.length === 0 && (
                      <tr><td colSpan={7} className="admin-table__empty">Жалобы не найдены</td></tr>
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
            <p className="admin-modal__text">Отклонить жалобу? Она будет удалена из списка без применения мер к нарушителю.</p>
            <div className="admin-modal__btns">
              <button className="admin-btn admin-btn--danger" onClick={() => remove(deleteId)}>Отклонить</button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteId(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {modTarget && (
        <div className="admin-overlay" onClick={() => setModTarget(null)}>
          <div className="admin-modal admin-modal--form" onClick={e => e.stopPropagation()}>
            <p className="admin-modal__text">Принять меры к пользователю <strong>{modTarget.accused}</strong> по жалобе «{modTarget.reason}».</p>
            <div className="admin-modal__field">
              <label className="admin-modal__label">Мера</label>
              <CustomSelect options={MEASURES} value={measure} onChange={setMeasure} placeholder="Выберите меру…" />
              <textarea
                className="admin-textarea admin-textarea--sm"
                rows={2}
                placeholder="Комментарий модератора (необязательно)…"
                value={reason}
                onChange={e => setReason(e.target.value)}
                style={{ marginTop: 10 }}
              />
            </div>
            <div className="admin-modal__btns">
              <button className="admin-btn admin-btn--danger" onClick={applyMod} disabled={!measure}>Подтвердить</button>
              <button className="admin-btn admin-btn--ghost" onClick={() => setModTarget(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
