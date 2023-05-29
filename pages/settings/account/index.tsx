import { Separator } from '@/components/ui/separator'
import { AccountForm } from '../../../components/settings/account-form'
import SettingsLayout from '@/pages/settings/layout'

export default function SettingsAccountPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">账户</h3>
          <p className="text-sm text-muted-foreground dark:text-neutral-400">更新您的账户设置</p>
        </div>
        <Separator />
        <AccountForm />
      </div>
    </SettingsLayout>
  )
}
