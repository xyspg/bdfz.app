import { AppStoreLink } from 'components/intro/AppStoreLink'
import { CircleBackground } from 'components/intro/CircleBackground'
import { Container } from 'components/intro/Container'
import { useTranslations } from "next-intl";

export function CallToAction() {
  const t = useTranslations('landing_page.call_to_action');
  return (
    <section
      id="get-free-shares-today"
      className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
    >
      <div className="absolute top-1/2 left-20 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        <CircleBackground color="#7f1d1d" className="animate-spin-slower" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-md sm:text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-gray-300">{t('subtitle')}</p>
          <div className="mt-8 flex justify-center">
            <AppStoreLink />
          </div>
        </div>
      </Container>
    </section>
  )
}
