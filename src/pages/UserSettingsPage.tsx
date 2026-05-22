import { ShieldCheck, UserCircle2, Bell, CreditCard, MoonStar } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/context/ThemeContext';
import { usePageTitle } from '@/hooks/usePageTitle';

export const UserSettingsPage = () => {
  usePageTitle('Settings');

  const { theme, toggleTheme } = useTheme();

  return (
    <DashboardLayout title="Settings">
      <PageTransition>
        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-primary" /> Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Full name" defaultValue="Aarav Kapoor" />
              <Input placeholder="Email" defaultValue="patient@mediscan.ai" />
              <Input placeholder="Phone" defaultValue="+91 98765 43210" />
              <Button>Save Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-teal" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingRow label="Critical health alerts" />
              <SettingRow label="Report analysis completion" defaultChecked />
              <SettingRow label="Consultation reminders" defaultChecked />
              <SettingRow label="Marketing updates" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple" /> Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-[#dbe8f4] bg-[#f4f9fd] p-4">
                <p className="font-display text-lg font-semibold">Pro Plan</p>
                <p className="text-sm text-[#60758a]">?299/mo • Renews on 20 May 2026</p>
                <Badge className="mt-2" variant="teal">
                  Active
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary">Change Plan</Button>
                <Button variant="outline">Manage Billing</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#1d9e75]" /> Security & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md border border-[#dbe8f4] p-3">
                <div>
                  <p className="font-medium">Two-factor authentication</p>
                  <p className="text-sm text-[#60758a]">Protect your account with OTP verification.</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between rounded-md border border-[#dbe8f4] p-3">
                <div className="inline-flex items-center gap-2">
                  <MoonStar className="h-5 w-5 text-[#60758a]" />
                  <div>
                    <p className="font-medium">Dark mode</p>
                    <p className="text-sm text-[#60758a]">Current: {theme}</p>
                  </div>
                </div>
                <Button variant="secondary" onClick={toggleTheme}>
                  Toggle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

const SettingRow = ({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) => (
  <div className="flex items-center justify-between rounded-md border border-[#dbe8f4] p-3">
    <span className="text-sm text-[#415e76]">{label}</span>
    <Switch defaultChecked={defaultChecked} />
  </div>
);

