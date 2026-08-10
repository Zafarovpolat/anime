'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';

const GENRES = [
  "Боевые искусства","Гарем","Гендерная интрига","Героическое фэнтези",
  "Детектив","Дзёсэй","Драма","Исекай",
  "Комедия","Мистика","Приключения","Романтика",
  "Сёнэн","Сёдзё","Фэнтези",
];
const TYPES = ['Манга','Манхва','Маньхуа','Руманга'];
const STATUSES = ['Выходит','Завершено','Анонс','Заморожено'];
const YEARS = Array.from({ length: 30 }, (_, i) => String(2025 - i));

export default function AdminAddWorkPage() {
  const [cover, setCover] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [type, setType] = useState(TYPES[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [yearEnd, setYearEnd] = useState('');
  const [status, setStatus] = useState(STATUSES[0]);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleGenre = (g: string) =>
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  return (
    <>
      <Header />
      <main className="main">
        <section className="section admin-section">
          <div className="container">
            <AdminLayout>
              <div className="admin-page__head">
                <div>
                  <div className="admin-breadcrumb">
                    <Link href="/admin/works" className="admin-breadcrumb__link">Произведения</Link>
                    <span className="admin-breadcrumb__sep">/</span>
                    <span className="admin-breadcrumb__cur">Добавить</span>
                  </div>
                  <h2 className="profile-content__title">ДОБАВИТЬ ПРОИЗВЕДЕНИЕ</h2>
                </div>
              </div>

              <div className="admin-form-layout">
                {/* Cover */}
                <div className="admin-cover-wrap">
                  <div className="admin-cover" onClick={() => fileRef.current?.click()}>
                    {cover ? (
                      <Image src={cover} alt="Обложка" fill sizes="200px" style={{ objectFit: 'cover', borderRadius: 20 }} />
                    ) : (
                      <div className="admin-cover__placeholder">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15M17 8L12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Загрузить обложку</span>
                        <span className="admin-cover__hint">JPG, PNG до 5 МБ</span>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { const f = e.target.files?.[0]; if(f) setCover(URL.createObjectURL(f)); }} />
                  {cover && (
                    <button className="admin-btn admin-btn--ghost admin-btn--sm" style={{ marginTop: 10, width: '100%' }} onClick={() => setCover(null)}>
                      Удалить
                    </button>
                  )}
                </div>

                {/* Fields */}
                <div className="admin-fields">
                  <div className="admin-fields__row">
                    <div className="admin-field">
                      <label className="admin-field__label">Название *</label>
                      <div className="profile-form__input-wrap"><input className="profile-form__input" type="text" placeholder="Введите название" /></div>
                    </div>
                    <div className="admin-field">
                      <label className="admin-field__label">Автор *</label>
                      <div className="profile-form__input-wrap"><input className="profile-form__input" type="text" placeholder="Имя автора" /></div>
                    </div>
                  </div>

                  <div className="admin-fields__row">
                    <div className="admin-field">
                      <label className="admin-field__label">Тип</label>
                      <div className="profile-form__input-wrap">
                        <CustomSelect options={TYPES} value={type} onChange={setType} />
                      </div>
                    </div>
                    <div className="admin-field">
                      <label className="admin-field__label">Статус</label>
                      <div className="profile-form__input-wrap">
                        <CustomSelect options={STATUSES} value={status} onChange={setStatus} />
                      </div>
                    </div>
                  </div>

                  <div className="admin-fields__row">
                    <div className="admin-field">
                      <label className="admin-field__label">Год выпуска</label>
                      <div className="profile-form__input-wrap">
                        <CustomSelect options={YEARS} value={year} onChange={setYear} />
                      </div>
                    </div>
                    <div className="admin-field">
                      <label className="admin-field__label">Год окончания</label>
                      <div className="profile-form__input-wrap">
                        <CustomSelect options={['—', ...YEARS]} value={yearEnd} onChange={setYearEnd} placeholder="—" />
                      </div>
                    </div>
                  </div>

                  <div className="admin-field">
                    <label className="admin-field__label">Описание</label>
                    <textarea className="admin-textarea" rows={4} placeholder="Краткое описание произведения..." />
                  </div>

                  <div className="admin-field">
                    <label className="admin-field__label">Жанры</label>
                    <div className="admin-genres">
                      {GENRES.map(genre => {
                        const checked = selectedGenres.includes(genre);
                        return (
                          <button
                            key={genre}
                            type="button"
                            className={`profile-genre-row${checked ? ' profile-genre-row--checked' : ''}`}
                            onClick={() => toggleGenre(genre)}
                          >
                            <span className="profile-genre-checkbox-box">
                              {checked && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </span>
                            <span className="catalog-filter__checkbox-label">{genre}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="admin-actions">
                    <button className="admin-btn admin-btn--primary admin-btn--wide">Сохранить</button>
                    <Link href="/admin/works" className="admin-btn admin-btn--ghost admin-btn--wide">Отмена</Link>
                  </div>
                </div>
              </div>
            </AdminLayout>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
