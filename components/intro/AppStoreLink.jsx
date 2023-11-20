import Link from 'next/link'
import clsx from 'clsx'
import { useTranslations } from "next-intl";

export function AppStoreLink({ color = 'black' }) {
  const t = useTranslations('landing_page');
  return (
    <Link
      href="/login"
      className={clsx(
        'w-20 rounded-lg transition-colors  ',
        color === 'black'
          ? 'bg-red-900 text-white hover:bg-red-800'
          : 'bg-white text-gray-900 hover:bg-gray-50'
      )}
    >
      <div className="font-sm flex flex-col items-center justify-center font-medium">
        <span className="py-2 text-sm">{t('hero.button.main')}</span>
      </div>
    </Link>
  )
}
