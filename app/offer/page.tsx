import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OfferPage() {
  return (
    <>
      <Header />
      <main className="main">
        <section className="section">
          <div className="container" style={{ backgroundColor: 'white', borderRadius: '25px', padding: '40px' }}>
            <h1 className="section-title" style={{ marginBottom: '20px' }}>Оферта</h1>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '15px', lineHeight: '1.8' }}>
              Данный документ является офертой сервиса PANELIA. Используя сервис, вы соглашаетесь 
              с условиями данного соглашения. Подробная информация будет доступна позже.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
