import { Separator } from '@/components/ui/separator'
import { Profile } from '../../components/settings/profile'
import SettingsLayout from './layout'
export default function SettingsProfilePage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium dark:text-neutral-200">个人资料</h3>
          <p className="text-sm text-muted-foreground dark:text-neutral-400">查看您的个人资料</p>
        </div>
        <Separator />
        <Profile />
      </div>
    </SettingsLayout>
  )
}
