import { useNavigate } from 'react-router-dom';

import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MapPanel } from '../../components/map/MapPanel';
import { RequestForm } from '../../components/request/RequestForm';
import { PinIcon } from '../../components/ui/icons';
import { useLocale } from '../../app/providers/LocaleContext';

export function OperatorPage() {
  const { t } = useLocale();
  const navigate = useNavigate();

  function handleRequestCreated(id: number) {
    navigate(`/operator/${id}`);
  }

  return (
    <div className="page">
      <Header />

      <main className="operator-page">
        <section className="request-hero">
          <div className="request-hero__map" aria-hidden="true">
            <MapPanel latitude={null} longitude={null} />
          </div>

          <div className="request-form-card">
            <PinIcon className="request-form-card__icon" />

            <h1 className="request-form-card__title">
              Emergency Location
            </h1>

            <p className="request-form-card__subtitle">
              {t.request.subtitle}
            </p>

            <RequestForm
              onRequestCreated={handleRequestCreated}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
