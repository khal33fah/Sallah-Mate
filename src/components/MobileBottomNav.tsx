import React from 'react';
import { Clock, Sparkles, Compass, BookOpen, Shield, Flame } from 'lucide-react';

export type MobileTab = 'prayers' | 'dhikr' | 'qibla' | 'library' | 'tools';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  completedPrayersCount?: number;
  isBlockerActive?: boolean;
  isTravelerActive?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  completedPrayersCount = 0,
  isBlockerActive = false,
  isTravelerActive = false,
}) => {
  const handleSelectTab = (tab: MobileTab) => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {}
    onTabChange(tab);
  };

  const tabs: {
    id: MobileTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number | null;
    dot?: boolean;
  }[] = [
    {
      id: 'prayers',
      label: 'Prayers',
      icon: Clock,
      badge: completedPrayersCount > 0 ? `${completedPrayersCount}/5` : null,
    },
    {
      id: 'dhikr',
      label: 'Dhikr',
      icon: Sparkles,
    },
    {
      id: 'qibla',
      label: 'Qibla',
      icon: Compass,
    },
    {
      id: 'library',
      label: 'Library',
      icon: BookOpen,
    },
    {
      id: 'tools',
      label: 'Shield',
      icon: Shield,
      dot: isBlockerActive || isTravelerActive,
    },
  ];

  return (
    <nav
      id="mobile-bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/90 backdrop-blur-xl border-t border-stone-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] select-none"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
      }}
      aria-label="Mobile Navigation Bar"
    >
      <div className="max-w-md mx-auto px-3 pt-2 pb-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => handleSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 touch-press group ${
                isActive
                  ? 'text-emerald-400 font-bold scale-[1.03]'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title={tab.label}
            >
              {/* Active Tab Ambient Pill Glow */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              )}

              {/* Icon Container with Badge */}
              <div
                className={`relative w-10 h-7 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 shadow-inner'
                    : 'group-hover:bg-stone-900/60'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />

                {/* Counter Badge */}
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-full border shadow-sm ${
                      isActive
                        ? 'bg-emerald-500 text-stone-950 border-emerald-300'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {/* Dot Badge */}
                {tab.dot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-stone-950 animate-pulse" />
                )}
              </div>

              {/* Tab Label */}
              <span className={`text-[10px] mt-0.5 tracking-tight transition-colors duration-200 ${
                isActive ? 'text-emerald-300' : 'text-stone-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
