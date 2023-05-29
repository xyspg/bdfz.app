import { Separator } from '@/components/ui/separator'
import { AppearanceForm } from '../../../components/settings/appearance-form'
import SettingsLayout from '@/pages/settings/layout'

export default function SettingsAppearancePage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">外观</h3>
          <p className="text-sm text-muted-foreground dark:text-neutral-400">自定义网页的外观</p>
        </div>
        <Separator />
        <AppearanceForm />
      </div>
    </SettingsLayout>
  )
}
