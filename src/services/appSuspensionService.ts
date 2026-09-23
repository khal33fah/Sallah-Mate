import { AppSuspensionSettings, SuspendableApp, AppCategory } from '../types';

const STORAGE_KEY = 'sallah_app_suspension_settings';

export const DEFAULT_SUSPENDABLE_APPS: SuspendableApp[] = [
  // Social Media
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    packageId: 'com.zhiliaoapp.musically',
    iconName: 'video',
    isSuspended: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    packageId: 'com.instagram.android',
    iconName: 'camera',
    isSuspended: true,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    category: 'social',
    packageId: 'com.twitter.android',
    iconName: 'twitter',
    isSuspended: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    packageId: 'com.facebook.katana',
    iconName: 'facebook',
    isSuspended: true,
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    category: 'social',
    packageId: 'com.snapchat.android',
    iconName: 'ghost',
    isSuspended: true,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    category: 'social',
    packageId: 'com.reddit.frontpage',
    iconName: 'message-circle',
    isSuspended: true,
  },
  {
    id: 'threads',
    name: 'Threads',
    category: 'social',
    packageId: 'com.instagram.barcelona',
    iconName: 'at-sign',
    isSuspended: true,
  },

  // Messaging & Chat
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'messaging',
    packageId: 'com.whatsapp',
    iconName: 'message-square',
    isSuspended: true,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'messaging',
    packageId: 'org.telegram.messenger',
    iconName: 'send',
    isSuspended: true,
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'messaging',
    packageId: 'com.discord',
    iconName: 'gamepad-2',
    isSuspended: true,
  },
  {
    id: 'messenger',
    name: 'Messenger',
    category: 'messaging',
    packageId: 'com.facebook.orca',
    iconName: 'message-circle',
    isSuspended: true,
  },

  // Video & Entertainment
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'video',
    packageId: 'com.google.android.youtube',
    iconName: 'play-square',
    isSuspended: true,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'video',
    packageId: 'com.netflix.mediaclient',
    iconName: 'tv',
    isSuspended: true,
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'video',
    packageId: 'tv.twitch.android.app',
    iconName: 'tv-2',
    isSuspended: true,
  },
  {
    id: 'disney_plus',
    name: 'Disney+',
    category: 'video',
    packageId: 'com.disney.disneyplus',
    iconName: 'film',
    isSuspended: true,
  },

  // Gaming
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    category: 'gaming',
    packageId: 'com.tencent.ig',
    iconName: 'crosshair',
    isSuspended: true,
  },
  {
    id: 'codm',
    name: 'Call of Duty: Mobile',
    category: 'gaming',
    packageId: 'com.activision.callofduty.shooter',
    iconName: 'shield',
    isSuspended: true,
  },
  {
    id: 'roblox',
    name: 'Roblox',
    category: 'gaming',
    packageId: 'com.roblox.client',
    iconName: 'box',
    isSuspended: true,
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    category: 'gaming',
    packageId: 'com.dts.freefireth',
    iconName: 'flame',
    isSuspended: true,
  },
  {
    id: 'candy_crush',
    name: 'Candy Crush Saga',
    category: 'gaming',
    packageId: 'com.king.candycrushsaga',
    iconName: 'sparkles',
    isSuspended: true,
  },

  // Browsers & Shopping
  {
    id: 'chrome',
    name: 'Google Chrome',
    category: 'browsing',
    packageId: 'com.android.chrome',
    iconName: 'globe',
    isSuspended: false,
  },
  {
    id: 'amazon',
    name: 'Amazon Shopping',
    category: 'browsing',
    packageId: 'com.amazon.mShop.android.shopping',
    iconName: 'shopping-bag',
    isSuspended: true,
  },
  {
    id: 'shein',
    name: 'SHEIN',
    category: 'browsing',
    packageId: 'com.zzkko',
    iconName: 'shopping-cart',
    isSuspended: true,
  },
  {
    id: 'temu',
    name: 'Temu',
    category: 'browsing',
    packageId: 'com.einnovation.temu',
    iconName: 'tag',
    isSuspended: true,
  },

  // Work & Productivity
  {
    id: 'slack',
    name: 'Slack',
    category: 'work',
    packageId: 'com.Slack',
    iconName: 'hash',
    isSuspended: false,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'work',
    packageId: 'com.google.android.gm',
    iconName: 'mail',
    isSuspended: false,
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'work',
    packageId: 'com.microsoft.teams',
    iconName: 'users',
    isSuspended: false,
  },
];

export const DEFAULT_APP_SUSPENSION_SETTINGS: AppSuspensionSettings = {
  enabled: true,
  strictAntiBypass: true, // Cannot bypass without praying
  requireCameraProofToBypass: false, // Optional strict camera proof
  requireVoiceRecordingToBypass: true, // Must record voice Iqamah & prayer details
  autoLockOnAdhan: true, // Auto-lock as soon as Adhan starts
  suspensionMinutes: 20, // Standard prayer window
  emergencyPin: '',
  apps: DEFAULT_SUSPENDABLE_APPS,
};

export function getStoredAppSuspensionSettings(): AppSuspensionSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with default apps to preserve newly added default apps
      const savedApps: SuspendableApp[] = parsed.apps || [];
      const mergedApps = [...savedApps];
      
      DEFAULT_SUSPENDABLE_APPS.forEach((defApp) => {
        if (!mergedApps.some((a) => a.id === defApp.id)) {
          mergedApps.push(defApp);
        }
      });

      return {
        ...DEFAULT_APP_SUSPENSION_SETTINGS,
        ...parsed,
        apps: mergedApps,
      };
    }
  } catch (err) {
    console.warn('Failed to load app suspension settings', err);
  }
  return DEFAULT_APP_SUSPENSION_SETTINGS;
}

export function saveAppSuspensionSettings(settings: AppSuspensionSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save app suspension settings', err);
  }
}

/**
 * Returns list of apps currently designated for suspension
 */
export function getActiveSuspendedApps(): SuspendableApp[] {
  const settings = getStoredAppSuspensionSettings();
  if (!settings.enabled) return [];
  return settings.apps.filter((a) => a.isSuspended);
}

/**
 * Generates an exportable package list for Android Digital Wellbeing / Tasker / Macrodroid
 */
export function generateAndroidPackageList(apps: SuspendableApp[]): string {
  const suspended = apps.filter((a) => a.isSuspended && a.packageId);
  return suspended.map((a) => a.packageId).join('\n');
}
