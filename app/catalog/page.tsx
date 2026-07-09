"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";

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
  "Выбери меня!",
  "Я стала приёмной дочерью в семье убийц",
  "Леди-малышка изменяет мир деньгами",
  "Следуйте за своим сердцем",
  "Не подбирайте выброшенный мусор",
];

const GENRES = [
  "Боевые искусства",
  "Гарем",
  "Гендерная интрига",
  "Героическое фэнтези",
  "Детектив",
  "Дзёсэй",
  "Драма",
  "Исекай",
  "Комедия",
  "Мистика",
  "Приключения",
  "Романтика",
  "Сёнэн",
  "Сёдзё",
  "Фэнтези",
];

const RATINGS = [
  9.6, 9.4, 9.2, 9.8, 9.1, 9.7, 9.3, 9.5, 9.0, 9.6, 9.4, 9.8, 9.2, 9.3, 9.7,
];

const CARD_GENRES = [
  ["Романтика", "Драма"],
  ["Боевые искусства", "Приключения"],
  ["Комедия", "Романтика"],
  ["Романтика", "Сёдзё"],
  ["Фэнтези", "Приключения"],
  ["Боевые искусства", "Драма"],
  ["Комедия", "Сёдзё"],
  ["Боевые искусства", "Исекай"],
  ["Мистика", "Драма"],
  ["Исекай", "Приключения"],
  ["Романтика", "Гарем"],
  ["Детектив", "Мистика"],
];

const CATEGORIES = ["Манга", "Манхва", "Маньхуа", "Руманга", "Комикс"];

type FilterState = "any" | "include" | "exclude";

const FILTER_STATE_LABEL: Record<FilterState, string> = {
  any: "Не учитывать",
  include: "Включить",
  exclude: "Исключить",
};

const nextFilterState = (state: FilterState): FilterState => {
  if (state === "any") return "include";
  if (state === "include") return "exclude";
  return "any";
};

const getActiveFilters = (
  states: Record<string, FilterState>,
  targetState: FilterState,
) =>
  Object.entries(states)
    .filter(([, state]) => state === targetState)
    .map(([value]) => value);

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M8.2091 1.01094L9.44445 3.49535C9.61092 3.83894 10.0578 4.16491 10.4345 4.23538L12.6687 4.6054C14.0969 4.84327 14.4298 5.88285 13.4047 6.92242L11.6611 8.6756C11.372 8.96633 11.2055 9.53898 11.3019 9.95305L11.8013 12.1203C12.1956 13.8294 11.2844 14.499 9.78617 13.6004L7.69214 12.3494C7.3154 12.1203 6.68458 12.1203 6.30783 12.3494L4.21381 13.6004C2.71558 14.4902 1.80439 13.8294 2.19866 12.1203L2.69808 9.95305C2.79445 9.54779 2.62798 8.97514 2.33885 8.6756L0.595308 6.92242C-0.429794 5.89165 -0.0968578 4.85208 1.33128 4.6054L3.56546 4.23538C3.94221 4.17372 4.38905 3.83894 4.55552 3.49535L5.7909 1.01094C6.44802 -0.336981 7.53446 -0.336981 8.2091 1.01094Z"
        fill="white"
      />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 12L4 15L7 12M4 15V1M15 4L12 1L9 4M12 1V15"
        stroke="#562CF0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ color = "#97989B" }: { color?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.3333 23.3333L18.4372 18.4372M18.4372 18.4372C20.0206 16.8537 21 14.6662 21 12.25C21 7.41751 17.0825 3.5 12.25 3.5C7.41751 3.5 3.5 7.41751 3.5 12.25C3.5 17.0825 7.41751 21 12.25 21C14.6662 21 16.8537 20.0206 18.4372 18.4372Z"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.3145 4.79409C17.8387 4.64742 16.3628 4.53742 14.8778 4.45492V4.44575L14.6762 3.25409C14.5387 2.41075 14.337 1.14575 12.192 1.14575H9.79035C7.65451 1.14575 7.45285 2.35575 7.30618 3.24492L7.11368 4.41825C6.26118 4.47325 5.40868 4.52825 4.55618 4.61075L2.68618 4.79409C2.30118 4.83075 2.02618 5.16992 2.06285 5.54575C2.09951 5.92159 2.42951 6.19659 2.81451 6.15992L4.68451 5.97659C9.48785 5.49992 14.3278 5.68325 19.1862 6.16909C19.2137 6.16909 19.232 6.16909 19.2595 6.16909C19.6078 6.16909 19.9103 5.90325 19.947 5.54575C19.9745 5.16992 19.6995 4.83075 19.3145 4.79409Z"
        fill="currentColor"
      />
      <path
        opacity="0.3991"
        d="M17.6271 7.46175C17.4071 7.23258 17.1046 7.10425 16.7929 7.10425H5.20627C4.89461 7.10425 4.58294 7.23258 4.37211 7.46175C4.16127 7.69091 4.04211 8.00258 4.06044 8.32341L4.62877 17.7284C4.72961 19.1217 4.85794 20.8634 8.05711 20.8634H13.9421C17.1413 20.8634 17.2696 19.1309 17.3704 17.7284L17.9388 8.33258C17.9571 8.00258 17.8379 7.69091 17.6271 7.46175Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.78125 15.5833C8.78125 15.2036 9.08905 14.8958 9.46875 14.8958H12.5212C12.9009 14.8958 13.2087 15.2036 13.2087 15.5833C13.2087 15.9629 12.9009 16.2708 12.5212 16.2708H9.46875C9.08905 16.2708 8.78125 15.9629 8.78125 15.5833Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.02051 11.9167C8.02051 11.5371 8.32831 11.2292 8.70801 11.2292H13.2913C13.671 11.2292 13.9788 11.5371 13.9788 11.9167C13.9788 12.2964 13.671 12.6042 13.2913 12.6042H8.70801C8.32831 12.6042 8.02051 12.2964 8.02051 11.9167Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Arrow / Caret_Down_MD">
        <path
          id="Vector"
          d="M16 10L12 14L8 10"
          stroke="#180F2A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M20.83 8.01002L14.28 2.77002C13 1.75002 11 1.74002 9.72996 2.76002L3.17996 8.01002C2.23996 8.76002 1.66996 10.26 1.86996 11.44L3.12996 18.98C3.41996 20.67 4.98996 22 6.69996 22H17.3C18.99 22 20.59 20.64 20.88 18.97L22.14 11.43C22.32 10.26 21.75 8.76002 20.83 8.01002Z"
        fill="currentColor"
      />
      <path
        d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18C12.75 18.41 12.41 18.75 12 18.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function CatalogPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("По популярности ↓");
  const [genreSearch, setGenreSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [genreStates, setGenreStates] = useState<Record<string, FilterState>>({});
  const [categoryStates, setCategoryStates] = useState<Record<string, FilterState>>({});
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(true);
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [ratingFrom, setRatingFrom] = useState("");
  const [ratingTo, setRatingTo] = useState("");
  const [chaptersFrom, setChaptersFrom] = useState("");
  const [chaptersTo, setChaptersTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 148;

  const filteredGenres = GENRES.filter((g) =>
    g.toLowerCase().includes(genreSearch.toLowerCase()),
  );

  const toggleGenre = (genre: string) => {
    setGenreStates((prev) => {
      const next = nextFilterState(prev[genre] ?? "any");
      if (next === "any") {
        const { [genre]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [genre]: next };
    });
  };

  const toggleCategory = (category: string) => {
    setCategoryStates((prev) => {
      const next = nextFilterState(prev[category] ?? "any");
      if (next === "any") {
        const { [category]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [category]: next };
    });
  };

  const renderTriStateFilter = (
    value: string,
    state: FilterState,
    onToggle: () => void,
  ) => (
    <button
      key={value}
      type="button"
      className={`catalog-filter__checkbox-row catalog-filter__checkbox-row--${state}`}
      role="checkbox"
      aria-checked={state === "exclude" ? "mixed" : state === "include"}
      aria-label={`${value}: ${FILTER_STATE_LABEL[state]}`}
      title={`${value}: ${FILTER_STATE_LABEL[state]}`}
      onClick={onToggle}
    >
      <span
        className={`catalog-filter__checkbox catalog-filter__checkbox--${state}`}
        aria-hidden="true"
      >
        {state === "include" ? "✓" : state === "exclude" ? "−" : ""}
      </span>
      <span className="catalog-filter__checkbox-label">{value}</span>
    </button>
  );

  const renderGenreFilter = (genre: string) =>
    renderTriStateFilter(
      genre,
      genreStates[genre] ?? "any",
      () => toggleGenre(genre),
    );

  const renderCategoryFilter = (category: string) =>
    renderTriStateFilter(
      category,
      categoryStates[category] ?? "any",
      () => toggleCategory(category),
    );

  const resetFilters = () => {
    setGenreStates({});
    setCategoryStates({});
    setGenreSearch("");
    setNameSearch("");
    setYearFrom("");
    setYearTo("");
    setRatingFrom("");
    setRatingTo("");
    setChaptersFrom("");
    setChaptersTo("");
  };

  const sortOptions = [
    "По популярности ↓",
    "По популярности ↑",
    "По рейтингу ↓",
    "По рейтингу ↑",
    "По новизне ↓",
    "По новизне ↑",
    "По алфавиту А-Я",
    "По алфавиту Я-А",
  ];

  const includedGenres = getActiveFilters(genreStates, "include");
  const excludedGenres = getActiveFilters(genreStates, "exclude");
  const includedCategories = getActiveFilters(categoryStates, "include");
  const excludedCategories = getActiveFilters(categoryStates, "exclude");

  const allCards = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    coverIdx: (i % 12) + 1,
    title: MANGA_TITLES[i % MANGA_TITLES.length],
    rating: RATINGS[i],
    genres: CARD_GENRES[i % CARD_GENRES.length],
    category: CATEGORIES[i % CATEGORIES.length],
    year: 2020 + (i % 5),
  }));

  const cards = allCards.filter((card) => {
    if (nameSearch && !card.title.toLowerCase().includes(nameSearch.toLowerCase())) return false;
    if (includedGenres.length > 0 && !includedGenres.some((g) => card.genres.includes(g))) return false;
    if (excludedGenres.some((g) => card.genres.includes(g))) return false;
    if (includedCategories.length > 0 && !includedCategories.includes(card.category)) return false;
    if (excludedCategories.includes(card.category)) return false;
    if (ratingFrom && card.rating < parseFloat(ratingFrom)) return false;
    if (ratingTo && card.rating > parseFloat(ratingTo)) return false;
    if (yearFrom && card.year < parseInt(yearFrom)) return false;
    if (yearTo && card.year > parseInt(yearTo)) return false;
    return true;
  }).sort((a, b) => {
    switch (sortLabel) {
      case 'По популярности ↓': case 'По рейтингу ↓': return b.rating - a.rating;
      case 'По популярности ↑': case 'По рейтингу ↑': return a.rating - b.rating;
      case 'По новизне ↓': return b.year - a.year;
      case 'По новизне ↑': return a.year - b.year;
      case 'По алфавиту А-Я': return a.title.localeCompare(b.title, 'ru');
      case 'По алфавиту Я-А': return b.title.localeCompare(a.title, 'ru');
      default: return 0;
    }
  });

  const getPaginationPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, 4, "...", totalPages - 1, totalPages);
    }
    return pages;
  };

  return (
    <>
      <Header />
      <main className="main catalog-main">
        <section className="section manga-section catalog-section">
          <div className="container">
            {/* Breadcrumbs */}
            <nav className="catalog-breadcrumbs" aria-label="Хлебные крошки">
              <Link href="/" className="catalog-breadcrumb">
                <HomeIcon />
                <span>Главная</span>
              </Link>
              <span className="catalog-breadcrumb-sep">|</span>
              <span className="catalog-breadcrumb catalog-breadcrumb--current">
                Каталог
              </span>
            </nav>

            <div className="catalog-layout">
              {/* Left: title + grid + pagination */}
              <div className="catalog-content">
                {/* Title + Sort */}
                <div className="catalog-title-row">
                  <h1 className="catalog-title">Каталог</h1>
                  <div className="catalog-title-divider" aria-hidden="true" />
                  <div className="catalog-title-row__actions">
                    <div className="catalog-sort-wrapper">
                      <button
                        className="catalog-sort-btn"
                        onClick={() => setSortOpen((v) => !v)}
                        aria-haspopup="listbox"
                        aria-expanded={sortOpen}
                      >
                        <SortIcon />
                        <span>{sortLabel}</span>
                      </button>
                      {sortOpen && (
                        <ul className="catalog-sort-dropdown" role="listbox">
                          {sortOptions.map((opt) => (
                            <li
                              key={opt}
                              className={`catalog-sort-option${sortLabel === opt ? " catalog-sort-option--active" : ""}`}
                              role="option"
                              aria-selected={sortLabel === opt}
                              onClick={() => {
                                setSortLabel(opt);
                                setSortOpen(false);
                              }}
                            >
                              {opt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Mobile filter button */}
                    <button
                      className="catalog-filter-toggle"
                      onClick={() => setFilterOpen(true)}
                      aria-label="Открыть фильтры"
                    >
                      <svg
                        width="11"
                        height="13"
                        viewBox="0 0 11 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.22998 0H9.35999C10.04 0 10.59 0.56 10.59 1.25V2.62C10.59 3.12 10.28 3.73999 9.96997 4.04999L7.32001 6.42001C6.95001 6.73001 6.70001 7.36001 6.70001 7.85001V10.53C6.70001 10.9 6.45002 11.4 6.15002 11.59L5.28998 12.15C4.48998 12.65 3.38 12.09 3.38 11.09V7.78C3.38 7.34 3.13001 6.78 2.89001 6.47L0.549988 3.97C0.239988 3.66 0 3.1 0 2.72V1.29001C0 0.560009 0.54998 0 1.22998 0Z"
                          fill="#834DFB"
                        />
                      </svg>

                      <span>Фильтры</span>
                    </button>
                  </div>
                </div>

                {/* Cards Grid */}
                {cards.length === 0 ? (
                  <div className="catalog-empty">
                    <p>Ничего не найдено. Попробуйте изменить фильтры.</p>
                  </div>
                ) : (
                  <div className="catalog-grid">
                    {cards.map((card) => (
                      <Link href={`/manga/${card.id}`} key={card.id} className="manga-card">
                        <div className="manga-card__image-wrapper">
                          <img src={`/images/cover_${card.coverIdx}.jpg`} alt={card.title} loading="lazy"/>
                          <div className="rating-badge">{card.rating} <StarIcon /></div>
                        </div>
                        <div className="manga-card__info">
                          <h3 className="manga-card__title">{card.title}</h3>
                          <span className="manga-card__genre">{card.category}, {card.genres.join(", ")}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <nav className="catalog-pagination" aria-label="Пагинация">
                  {getPaginationPages().map((page, i) =>
                    page === "..." ? (
                      <span key={`dots-${i}`} className="catalog-page-dots">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`catalog-page-btn${currentPage === page ? " catalog-page-btn--active" : ""}`}
                        onClick={() => setCurrentPage(page as number)}
                        aria-label={`Страница ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    className="catalog-page-next"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                  >
                    Вперёд
                  </button>
                </nav>
              </div>

              {/* Right: Filter Panel (desktop) */}
              <aside
                className="catalog-filter catalog-filter--desktop"
                aria-label="Фильтры"
              >
                <div className="catalog-filter__header">
                  <span className="catalog-filter__title">Фильтры</span>
                  <button
                    className="catalog-filter__reset"
                    onClick={resetFilters}
                  >
                    Сбросить <TrashIcon />
                  </button>
                </div>

                {/* Name search */}
                <div className="catalog-filter__block">
                  <div className="catalog-filter__input-wrap">
                    <SearchIcon />
                    <input
                      className="catalog-filter__input"
                      type="text"
                      placeholder="Поиск по названию"
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Genres */}
                <div className="catalog-filter__block catalog-filter__block--genres">
                  <button
                    className="catalog-filter__section-header"
                    onClick={() => setGenresOpen((v) => !v)}
                    aria-expanded={genresOpen}
                  >
                    <span className="catalog-filter__section-title">Жанры</span>
                    <ChevronIcon open={genresOpen} />
                  </button>
                  {genresOpen && (
                    <>
                      <div className="catalog-filter__input-wrap catalog-filter__input-wrap--sm">
                        <SearchIcon />
                        <input
                          className="catalog-filter__input"
                          type="text"
                          placeholder="Поиск по Жанрам"
                          value={genreSearch}
                          onChange={(e) => setGenreSearch(e.target.value)}
                        />
                      </div>
                      <div className="catalog-filter__genres-list">
                        {filteredGenres.map(renderGenreFilter)}
                      </div>
                    </>
                  )}
                </div>

                {/* Category */}
                <div className="catalog-filter__block">
                  <button
                    className="catalog-filter__section-header"
                    onClick={() => setCategoryOpen((v) => !v)}
                    aria-expanded={categoryOpen}
                  >
                    <span className="catalog-filter__section-title">
                      Категория
                    </span>
                    <ChevronIcon open={categoryOpen} />
                  </button>
                  {categoryOpen && (
                    <div className="catalog-filter__category-content">
                      {CATEGORIES.map(renderCategoryFilter)}
                    </div>
                  )}
                </div>

                {/* Year */}
                <div className="catalog-filter__block">
                  <div className="catalog-filter__section-label">
                    Год выпуска
                  </div>
                  <div className="catalog-filter__range-row">
                    <input
                      className="catalog-filter__range-input"
                      type="number"
                      placeholder="От"
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                    />
                    <input
                      className="catalog-filter__range-input"
                      type="number"
                      placeholder="До"
                      value={yearTo}
                      onChange={(e) => setYearTo(e.target.value)}
                    />
                  </div>
                  <div className="catalog-filter__quick-btns">
                    <button
                      className="catalog-filter__quick-btn"
                      onClick={() => {
                        setYearFrom("2026");
                        setYearTo("2026");
                      }}
                    >
                      Текущий год
                    </button>
                    <button
                      className="catalog-filter__quick-btn"
                      onClick={() => {
                        setYearFrom("2024");
                        setYearTo("2026");
                      }}
                    >
                      За 2 года
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="catalog-filter__block">
                  <div className="catalog-filter__section-label">Рейтинг</div>
                  <div className="catalog-filter__range-row">
                    <input
                      className="catalog-filter__range-input"
                      type="number"
                      placeholder="От"
                      value={ratingFrom}
                      onChange={(e) => setRatingFrom(e.target.value)}
                    />
                    <input
                      className="catalog-filter__range-input"
                      type="number"
                      placeholder="До"
                      value={ratingTo}
                      onChange={(e) => setRatingTo(e.target.value)}
                    />
                  </div>
                  <div className="catalog-filter__quick-btns">
                    <button
                      className="catalog-filter__quick-btn"
                      onClick={() => {
                        setRatingFrom("9");
                        setRatingTo("10");
                      }}
                    >
                      Лучшее
                    </button>
                    <button
                      className="catalog-filter__quick-btn"
                      onClick={() => {
                        setRatingFrom("7");
                        setRatingTo("9");
                      }}
                    >
                      Хорошее
                    </button>
                  </div>
                </div>

                {/* Chapters count */}
                <div className="catalog-filter__block">
                  <div className="catalog-filter__section-label">
                    Количество глав
                  </div>
                  <div className="catalog-filter__range-row">
                    <input
                      className="catalog-filter__range-input"
                      type="number"
                      placeholder="От"
                      value={chaptersFrom}
                      onChange={(e) => setChaptersFrom(e.target.value)}
                    />
                    <input
                      className="catalog-filter__range-input"
                      type="number"
                      placeholder="До"
                      value={chaptersTo}
                      onChange={(e) => setChaptersTo(e.target.value)}
                    />
                  </div>
                  <div className="catalog-filter__quick-btns">
                    <button
                      className="catalog-filter__quick-btn"
                      onClick={() => {
                        setChaptersFrom("0");
                        setChaptersTo("10");
                      }}
                    >
                      &lt;10
                    </button>
                    <button
                      className="catalog-filter__quick-btn"
                      onClick={() => {
                        setChaptersFrom("0");
                        setChaptersTo("50");
                      }}
                    >
                      &lt;50
                    </button>
                    <button
                      className="catalog-filter__quick-btn"
                      onClick={() => {
                        setChaptersFrom("50");
                        setChaptersTo("");
                      }}
                    >
                      &gt;50
                    </button>
                    <button
                      className="catalog-filter__quick-btn"
                      onClick={() => {
                        setChaptersFrom("100");
                        setChaptersTo("");
                      }}
                    >
                      100+
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="catalog-filter-overlay">
          <aside
            className="catalog-filter catalog-filter--mobile"
            aria-label="Фильтры"
          >
            {/* Pinned header */}
            <div className="catalog-filter__header">
              <span className="catalog-filter__title">Фильтры</span>
              <button
                className="catalog-filter-close"
                onClick={() => setFilterOpen(false)}
                aria-label="Закрыть"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 13L7.00002 7.00002M7.00002 7.00002L1 1M7.00002 7.00002L13 1M7.00002 7.00002L1 13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="catalog-filter__scrollable">
              <div className="catalog-filter__block">
                <div className="catalog-filter__input-wrap">
                  <SearchIcon />
                  <input
                    className="catalog-filter__input"
                    type="text"
                    placeholder="Поиск по названию"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="catalog-filter__block catalog-filter__block--genres">
                <button
                  className="catalog-filter__section-header"
                  onClick={() => setGenresOpen((v) => !v)}
                  aria-expanded={genresOpen}
                >
                  <span className="catalog-filter__section-title">Жанры</span>
                  <ChevronIcon open={genresOpen} />
                </button>
                {genresOpen && (
                  <>
                    <div className="catalog-filter__input-wrap catalog-filter__input-wrap--sm">
                      <SearchIcon />
                      <input
                        className="catalog-filter__input"
                        type="text"
                        placeholder="Поиск по Жанрам"
                        value={genreSearch}
                        onChange={(e) => setGenreSearch(e.target.value)}
                      />
                    </div>
                    <div className="catalog-filter__genres-list">
                      {filteredGenres.map(renderGenreFilter)}
                    </div>
                  </>
                )}
              </div>

              <div className="catalog-filter__block">
                <button
                  className="catalog-filter__section-header"
                  onClick={() => setCategoryOpen((v) => !v)}
                  aria-expanded={categoryOpen}
                >
                  <span className="catalog-filter__section-title">
                    Категория
                  </span>
                  <ChevronIcon open={categoryOpen} />
                </button>
                {categoryOpen && (
                  <div className="catalog-filter__category-content">
                    {CATEGORIES.map(renderCategoryFilter)}
                  </div>
                )}
              </div>

              <div className="catalog-filter__block">
                <div className="catalog-filter__section-label">Год выпуска</div>
                <div className="catalog-filter__range-row">
                  <input
                    className="catalog-filter__range-input"
                    type="number"
                    placeholder="От"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                  />
                  <input
                    className="catalog-filter__range-input"
                    type="number"
                    placeholder="До"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                  />
                </div>
                <div className="catalog-filter__quick-btns">
                  <button
                    className="catalog-filter__quick-btn"
                    onClick={() => {
                      setYearFrom("2026");
                      setYearTo("2026");
                    }}
                  >
                    Текущий год
                  </button>
                  <button
                    className="catalog-filter__quick-btn"
                    onClick={() => {
                      setYearFrom("2024");
                      setYearTo("2026");
                    }}
                  >
                    За 2 года
                  </button>
                </div>
              </div>

              <div className="catalog-filter__block">
                <div className="catalog-filter__section-label">Рейтинг</div>
                <div className="catalog-filter__range-row">
                  <input
                    className="catalog-filter__range-input"
                    type="number"
                    placeholder="От"
                    value={ratingFrom}
                    onChange={(e) => setRatingFrom(e.target.value)}
                  />
                  <input
                    className="catalog-filter__range-input"
                    type="number"
                    placeholder="До"
                    value={ratingTo}
                    onChange={(e) => setRatingTo(e.target.value)}
                  />
                </div>
                <div className="catalog-filter__quick-btns">
                  <button
                    className="catalog-filter__quick-btn"
                    onClick={() => {
                      setRatingFrom("9");
                      setRatingTo("10");
                    }}
                  >
                    Лучшее
                  </button>
                  <button
                    className="catalog-filter__quick-btn"
                    onClick={() => {
                      setRatingFrom("7");
                      setRatingTo("9");
                    }}
                  >
                    Хорошее
                  </button>
                </div>
              </div>

              <div className="catalog-filter__block">
                <div className="catalog-filter__section-label">
                  Количество глав
                </div>
                <div className="catalog-filter__range-row">
                  <input
                    className="catalog-filter__range-input"
                    type="number"
                    placeholder="От"
                    value={chaptersFrom}
                    onChange={(e) => setChaptersFrom(e.target.value)}
                  />
                  <input
                    className="catalog-filter__range-input"
                    type="number"
                    placeholder="До"
                    value={chaptersTo}
                    onChange={(e) => setChaptersTo(e.target.value)}
                  />
                </div>
                <div className="catalog-filter__quick-btns">
                  <button
                    className="catalog-filter__quick-btn"
                    onClick={() => {
                      setChaptersFrom("0");
                      setChaptersTo("10");
                    }}
                  >
                    &lt;10
                  </button>
                  <button
                    className="catalog-filter__quick-btn"
                    onClick={() => {
                      setChaptersFrom("0");
                      setChaptersTo("50");
                    }}
                  >
                    &lt;50
                  </button>
                  <button
                    className="catalog-filter__quick-btn"
                    onClick={() => {
                      setChaptersFrom("50");
                      setChaptersTo("");
                    }}
                  >
                    &gt;50
                  </button>
                  <button
                    className="catalog-filter__quick-btn"
                    onClick={() => {
                      setChaptersFrom("100");
                      setChaptersTo("");
                    }}
                  >
                    100+
                  </button>
                </div>
              </div>
            </div>

            {/* Pinned footer */}
            <div className="catalog-filter__footer">
              <button
                className="catalog-filter-reset-footer"
                onClick={resetFilters}
              >
                Сбросить <TrashIcon />
              </button>
              <button
                className="catalog-filter-apply"
                onClick={() => setFilterOpen(false)}
              >
                Применить
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

