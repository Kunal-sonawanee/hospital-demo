import { useHashRoute } from '@/hooks/useHashRoute';
import { DemoProvider } from '@/store/demo';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar, DemoModeRibbon } from '@/components/layout/Topbar';
import { Toasts } from '@/components/ui/Toasts';
import { Overview } from '@/screens/Overview';
import { AIReceptionist } from '@/screens/AIReceptionist';
import { Appointments } from '@/screens/Appointments';
import { WhatsApp } from '@/screens/WhatsApp';
import { CallAnalytics } from '@/screens/CallAnalytics';
import { HowItWorks } from '@/screens/HowItWorks';

function Shell() {
  const [screen, navigate] = useHashRoute();

  return (
    <div className="min-h-screen">
      <Sidebar screen={screen} onNavigate={navigate} />

      <div className="flex min-h-screen flex-col lg:pl-[248px]">
        <Topbar screen={screen} onNavigate={navigate} />

        <main
          key={screen}
          className="mx-auto w-full max-w-[1240px] flex-1 animate-fade-up px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >
          {screen === 'overview' && <Overview onNavigate={navigate} />}
          {screen === 'receptionist' && <AIReceptionist onNavigate={navigate} />}
          {screen === 'appointments' && <Appointments />}
          {screen === 'whatsapp' && <WhatsApp />}
          {screen === 'analytics' && <CallAnalytics />}
          {screen === 'how-it-works' && <HowItWorks onNavigate={navigate} />}
        </main>

        <DemoModeRibbon />
      </div>

      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <Shell />
    </DemoProvider>
  );
}
