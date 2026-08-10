'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import { useState, useRef } from 'react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';

const WORKS = [
  'Наномашины','Мир Зомби','Истинная красота','Следуйте за своим сердцем',
  'Таков закон','Выбери меня!','Игрок падшего дворянского рода','Леди-малышка изменяет мир деньгами',
];

export default function AdminAddChapterPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [work, setWork] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPages(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const move = (i: number, dir: -1 | 1) => setPages(prev => {
    const next = [...prev];
    const j = i + dir;
    if (j < 0 || j >= next.length) return next;
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

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
                    <span className="admin-breadcrumb__cur">Добавить главу</span>
                  </div>
                  <h2 className="profile-content__title">ДОБАВИТЬ ГЛАВУ</h2>
                </div>
              </div>

              <div className="admin-fields admin-fields--wide">
                <div className="admin-fields__row">
                  <div className="admin-field">
                    <label className="admin-field__label">Произведение *</label>
                    <div className="profile-form__input-wrap">
                      <CustomSelect options={WORKS} value={work} onChange={setWork} placeholder="— Выбрать —" />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field__label">Том</label>
                    <div className="profile-form__input-wrap"><input className="profile-form__input" type="number" min="1" defaultValue="1" /></div>
                  </div>
                </div>

                <div className="admin-fields__row">
                  <div className="admin-field">
                    <label className="admin-field__label">Номер главы *</label>
                    <div className="profile-form__input-wrap"><input className="profile-form__input" type="number" min="1" placeholder="Например: 42" /></div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field__label">Название главы</label>
                    <div className="profile-form__input-wrap"><input className="profile-form__input" type="text" placeholder="Необязательно" /></div>
                  </div>
                </div>

                <div className="admin-field">
                  <label className="admin-field__label">Страницы *</label>
                  <div className="admin-drop" onClick={() => fileRef.current?.click()}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15M17 8L12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Нажмите или перетащите файлы</span>
                    <span className="admin-drop__hint">JPG, PNG, WebP — порядок можно изменить</span>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleFiles} />
                </div>

                {pages.length > 0 && (
                  <div className="admin-pages">
                    {pages.map((src, i) => (
                      <div key={i} className="admin-pages__item">
                        <span className="admin-pages__num">{i + 1}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="admin-pages__img" />
                        <div className="admin-pages__btns">
                          <button className="admin-icon-btn" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                          <button className="admin-icon-btn" onClick={() => move(i, 1)} disabled={i === pages.length - 1}>↓</button>
                          <button className="admin-icon-btn admin-icon-btn--del" onClick={() => setPages(p => p.filter((_, j) => j !== i))}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="admin-actions">
                  <button className="admin-btn admin-btn--primary admin-btn--wide">Сохранить главу</button>
                  <Link href="/admin" className="admin-btn admin-btn--ghost admin-btn--wide">Отмена</Link>
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
