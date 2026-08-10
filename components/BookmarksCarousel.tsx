'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useRef, useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

const MANGA_TITLES = [
  "Выбери меня!",
  "Я стала приёмной дочерью в семье убийц",
  "Леди-малышка изменяет мир деньгами",
  "Следуйте за своим сердцем",
  "Не подбирайте выброшенный мусор",
  "Таков закон",
  "Истинная красота",
  "Игрок падшего дворянского рода",
  "Мир Зомби",
  "План перерожденного наёмника",
];

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.2091 1.01094L9.44445 3.49535C9.61092 3.83894 10.0578 4.16491 10.4345 4.23538L12.6687 4.6054C14.0969 4.84327 14.4298 5.88285 13.4047 6.92242L11.6611 8.6756C11.372 8.96633 11.2055 9.53898 11.3019 9.95305L11.8013 12.1203C12.1956 13.8294 11.2844 14.499 9.78617 13.6004L7.69214 12.3494C7.3154 12.1203 6.68458 12.1203 6.30783 12.3494L4.21381 13.6004C2.71558 14.4902 1.80439 13.8294 2.19866 12.1203L2.69808 9.95305C2.79445 9.54779 2.62798 8.97514 2.33885 8.6756L0.595308 6.92242C-0.429794 5.89165 -0.0968578 4.85208 1.33128 4.6054L3.56546 4.23538C3.94221 4.17372 4.38905 3.83894 4.55552 3.49535L5.7909 1.01094C6.44802 -0.336981 7.53446 -0.336981 8.2091 1.01094Z" fill="white"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.999965 10.8995L10.8995 1.00001M10.8995 9.48529V1.00001H2.41418" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const STATUS_LABELS = ["Читаю", "Буду читать", "Прочитано", "Заброшено", "Прочитано", "Читаю", "Буду читать", "Прочитано", "Заброшено", "Читаю"];

export default function BookmarksCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 540px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const cards = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    coverIdx: (i % 12) + 1,
    title: MANGA_TITLES[i % MANGA_TITLES.length],
    status: STATUS_LABELS[i],
  }));

  return (
    <section className="section manga-section bookmarks-section" id="bookmarks" aria-labelledby="bookmarks-title">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" id="bookmarks-title">Мои закладки</h2>
          {!isMobile && (
            <Link href="/bookmarks" className="section-more">
              <span>Смотреть больше</span>
              <span className="section-more__arrow">
                <ArrowIcon />
              </span>
            </Link>
          )}
        </div>
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          spaceBetween={20}
          slidesPerView={5}
          breakpoints={{
            0: { slidesPerView: 1.3, spaceBetween: 10 },
            400: { slidesPerView: 1.8, spaceBetween: 12 },
            540: { slidesPerView: 2.3, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 14 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="bookmarks-swiper"
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id}>
              <Link href={`/manga/${card.id}`} className="bookmark-card">
                <div className="bookmark-card__image-wrapper">
                  <img
                    src={`/images/cover_${card.coverIdx}.jpg`}
                    alt={card.title}
                    loading="lazy"
                  />
                  <div className="badges-row">
                    <div className="rating-badge">
                      9.6 <StarIcon />
                    </div>
                    <div className="status-badge">
                      <span>{card.status}</span>
                    </div>
                  </div>
                </div>
                <h3 className="bookmark-card__title">{card.title}</h3>
                <span className="bookmark-card__genre">Манхва, экшен</span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        {!isMobile && (
          <div className="carousel-controls">
            <div className="carousel-btns">
              <button
                className={`carousel-btn${!isBeginning ? ' carousel-btn--active' : ''}`}
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Назад"
              >
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 7H1M7 13L1 7L7 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className={`carousel-btn${!isEnd ? ' carousel-btn--active' : ''}`}
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Вперёд"
              >
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7H15M9 13L15 7L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        {isMobile && (
          <Link href="/bookmarks" className="manga-section__more-btn">
            <span className="section-more__arrow manga-section__more-btn-icon">
              <ArrowIcon />
            </span>
            <span>Смотреть больше</span>
          </Link>
        )}
      </div>
    </section>
  );
}
