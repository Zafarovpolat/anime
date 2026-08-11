import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="main">
        <section className="section">
          <div className="container" style={{ backgroundColor: 'var(--color-surface)', borderRadius: '25px', padding: '40px' }}>
            <h1 className="section-title" style={{ marginBottom: '20px' }}>Политика конфиденциальности</h1>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '15px', lineHeight: '1.8' }}>
              PANELIA уважает вашу конфиденциальность. Мы собираем минимально необходимые данные 
              для работы сервиса. Персональные данные не передаются третьим лицам.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
