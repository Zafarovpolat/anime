import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="main">
        <section className="section">
          <div className="container" style={{ backgroundColor: 'var(--color-surface)', borderRadius: '25px', padding: '40px' }}>
            <h1 className="section-title" style={{ marginBottom: '20px' }}>Пользовательское соглашение</h1>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '15px', lineHeight: '1.8' }}>
              Используя сервис PANELIA, вы принимаете условия пользовательского соглашения. 
              Запрещено копирование контента, нарушение авторских прав и злоупотребление сервисом.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
