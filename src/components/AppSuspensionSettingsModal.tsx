import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  Smartphone,
  Check,
  Plus,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Sparkles,
  Sliders,
  Copy,
  ExternalLink,
  Flame,
  Search,
  Eye,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { AppSuspensionSettings, SuspendableApp, AppCategory } from '../types';
import {
  getStoredAppSuspensionSettings,
  saveAppSuspensionSettings,
  generateAndroidPackageList,
} from '../services/appSuspensionService';

interface AppSuspensionSettingsModalProps {
  onClose: () => void;
  onSimulateAppBlock?: (app: SuspendableApp) => void;
}

export const AppSuspensionSettingsModal: React.FC<AppSuspensionSettingsModalProps> = ({
  onClose,
  onSimulateAppBlock,
}) => {
  const [settings, setSettings] = useState<AppSuspensionSettings>(getStoredAppSuspensionSettings());
  const [activeTab, setActiveTab] = useState<'apps' | 'security' | 'integration' | 'test'>('apps');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedPackageList, setCopiedPackageList] = useState<boolean>(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // New custom app form
  const [newAppName, setNewAppName] = useState<string>('');
  const [newAppCategory, setNewAppCategory] = useState<AppCategory>('gaming');
  const [newAppPackageId, setNewAppPackageId] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Update and save helper
  const updateSettings = (updated: AppSuspensionSettings) => {
    setSettings(updated);
    saveAppSuspensionSettings(updated);
    setSavedSuccessMessage('Settings updated successfully');
    setTimeout(() => setSavedSuccessMessage(null), 2500);
  };

  const handleToggleApp = (appId: string) => {
    const updatedApps = settings.apps.map((app) =>
      app.id === appId ? { ...app, isSuspended: !app.isSuspended } : app
    );
    updateSettings({ ...settings, apps: updatedApps });
  };

  const handleAddCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const id = `custom_${Date.now()}`;
    const customApp: SuspendableApp = {
      id,
      name: newAppName.trim(),
      category: newAppCategory,
      packageId: newAppPackageId.trim() || `com.app.${id}`,
      iconName: 'smartphone',
      isSuspended: true,
      isCustom: true,
    };

    updateSettings({
      ...settings,
      apps: [customApp, ...settings.apps],
    });

    setNewAppName('');
    setNewAppPackageId('');
    setShowAddForm(false);
  };

  const handleDeleteCustomApp = (appId: string) => {
    const updatedApps = settings.apps.filter((a) => a.id !== appId);
    updateSettings({ ...settings, apps: updatedApps });
  };

  const handleApplyPreset = (preset: 'all' | 'none' | 'distractions' | 'extreme') => {
    let updatedApps = [...settings.apps];
    if (preset === 'all') {
      updatedApps = updatedApps.map((a) => ({ ...a, isSuspended: true }));
    } else if (preset === 'none') {
      updatedApps = updatedApps.map((a) => ({ ...a, isSuspended: false }));
    } else if (preset === 'distractions') {
      updatedApps = updatedApps.map((a) => ({
        ...a,
        isSuspended: ['social', 'video', 'gaming'].includes(a.category),
      }));
    } else if (preset === 'extreme') {
      updatedApps = updatedApps.map((a) => ({
        ...a,
        isSuspended: true,
      }));
    }
    updateSettings({ ...settings, apps: updatedApps });
  };

  const handleCopyPackages = () => {
    const list = generateAndroidPackageList(settings.apps);
    navigator.clipboard.writeText(list);
    setCopiedPackageList(true);
    setTimeout(() => setCopiedPackageList(false), 3000);
  };

  const filteredApps = settings.apps.filter((app) => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.packageId && app.packageId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const suspendedCount = settings.apps.filter((a) => a.isSuspended).length;

  return (
    <div
      id="app-suspension-settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-stone-900 border border-emerald-500/30 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Adhan App Suspension & Anti-Bypass Security
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold uppercase tracking-wider">
                  {settings.strictAntiBypass ? 'Strict Security' : 'Standard Shield'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Choose which apps are suspended the moment the Call to Prayer begins • Unbypassable Sallah Lock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Master Toggle Banner */}
        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-950/70 via-stone-950 to-emerald-950/70 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="global-suspension-toggle"
              checked={settings.enabled}
              onChange={(e) => updateSettings({ ...settings, enabled: e.target.checked })}
              className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="global-suspension-toggle" className="cursor-pointer">
              <span className="text-xs sm:text-sm font-semibold text-emerald-100 block">
                Auto-Suspend Selected Apps as Soon as Adhan Commences
              </span>
              <span className="text-[11px] text-stone-400">
                {settings.enabled
                  ? `Active • ${suspendedCount} apps will be suspended immediately during prayer time`
                  : 'Disabled • Apps will not be automatically blocked during Adhan'}
              </span>
            </label>
          </div>

          {savedSuccessMessage && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {savedSuccessMessage}
            </span>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-stone-800/80 bg-stone-950/40 flex gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'apps'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Choose Apps ({suspendedCount} suspended)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Anti-Bypass Security</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'test'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Test Interceptor</span>
          </button>

          <button
            onClick={() => setActiveTab('integration')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'integration'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Android / Device Sync</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: CHOOSE APPS */}
          {activeTab === 'apps' && (
            <div className="space-y-4">
              {/* Presets and Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search apps by name or package..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-stone-500 font-semibold mr-1">Presets:</span>
                  <button
                    onClick={() => handleApplyPreset('distractions')}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition"
                  >
                    Social & Games
                  </button>
                  <button
                    onClick={() => handleApplyPreset('all')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs hover:bg-emerald-900 transition"
                  >
                    Suspend All
                  </button>
                  <button
                    onClick={() => handleApplyPreset('none')}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs transition"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Custom App</span>
                  </button>
                </div>
              </div>

              {/* Add Custom App Form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddCustomApp}
                  className="p-4 rounded-xl bg-stone-950 border border-emerald-500/40 space-y-3 animate-in fade-in"
                >
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Add Custom App to Suspend
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">App Name</label>
                      <input
                        type="text"
                        value={newAppName}
                        onChange={(e) => setNewAppName(e.target.value)}
                        placeholder="e.g. My Favorite Game"
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Category</label>
                      <select
                        value={newAppCategory}
                        onChange={(e) => setNewAppCategory(e.target.value as AppCategory)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="social">Social Media</option>
                        <option value="messaging">Messaging / Chat</option>
                        <option value="video">Video & Entertainment</option>
                        <option value="gaming">Gaming</option>
                        <option value="browsing">Browsing / Shopping</option>
                        <option value="work">Work & Productivity</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Package ID (Optional)</label>
                      <input
                        type="text"
                        value={newAppPackageId}
                        onChange={(e) => setNewAppPackageId(e.target.value)}
                        placeholder="e.g. com.developer.app"
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1 rounded bg-stone-800 text-stone-400 text-xs hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Add App
                    </button>
                  </div>
                </form>
              )}

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {(
                  [
                    { id: 'all', label: 'All Apps' },
                    { id: 'social', label: 'Social Media' },
                    { id: 'messaging', label: 'Messaging' },
                    { id: 'video', label: 'Video & Media' },
                    { id: 'gaming', label: 'Gaming' },
                    { id: 'browsing', label: 'Shopping & Web' },
                    { id: 'work', label: 'Work & Email' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-stone-200 text-stone-950 font-bold'
                        : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* App List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => handleToggleApp(app.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2.5 select-none ${
                      app.isSuspended
                        ? 'bg-emerald-950/50 border-emerald-500/50 text-white shadow-sm'
                        : 'bg-stone-950/60 border-stone-800/80 text-stone-400 hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          app.isSuspended
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-stone-800 text-stone-500'
                        }`}
                      >
                        {app.isSuspended ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                          <span className={app.isSuspended ? 'text-emerald-200' : 'text-stone-300'}>
                            {app.name}
                          </span>
                          {app.isCustom && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600/30">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate font-mono">
                          {app.packageId || app.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {app.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomApp(app.id);
                          }}
                          className="p-1 text-stone-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          app.isSuspended
                            ? 'bg-emerald-500 border-emerald-400 text-stone-950'
                            : 'border-stone-700 bg-stone-900'
                        }`}
                      >
                        {app.isSuspended && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: STRICT ANTI-BYPASS SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/70 via-stone-950 to-stone-900 border border-emerald-500/40 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Strict Anti-Bypass Security Engine
                      </h3>
                      <p className="text-xs text-stone-300">
                        Prevents anyone from casually dismissing the prayer lock until Sallah is performed
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    id="strict-anti-bypass-toggle"
                    checked={settings.strictAntiBypass}
                    onChange={(e) =>
                      updateSettings({ ...settings, strictAntiBypass: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-emerald-500 cursor-pointer mt-1"
                  />
                </div>

                <div className="pt-2 border-t border-emerald-500/20 text-xs text-stone-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>No Easy Dismissal:</strong> Replaces standard "Continue Using App" with strict prayer completion check.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Tab & Exit Protection:</strong> Warns with browser-level lockdown protection if navigating away.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Emergency Covenant:</strong> Emergency bypass requires a 10-second spiritual countdown reminding of the Day of Judgment before any unlock.
                    </span>
                  </div>
                </div>
              </div>

              {/* Camera Proof Mandate */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-200 block">
                      Require Camera Sujud / Mate Verification to Unlock
                    </span>
                    <span className="text-[11px] text-stone-400">
                      To lift the lock, you must scan your prayer posture (prostration / prayer mat) or companion witness.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requireCameraProofToBypass}
                    onChange={(e) =>
                      updateSettings({ ...settings, requireCameraProofToBypass: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Auto-Lock Screen on Adhan Commencement */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-200 block">
                      Full-Screen Lock as Soon as Call to Prayer Commences
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Automatically launches the immersive Khushu prayer shield the moment the Adhan is called.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoLockOnAdhan}
                    onChange={(e) =>
                      updateSettings({ ...settings, autoLockOnAdhan: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Suspension Duration */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <label className="text-xs font-bold text-stone-200 block">
                  Suspension Window Duration
                </label>
                <div className="flex items-center gap-3">
                  {[15, 20, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => updateSettings({ ...settings, suspensionMinutes: mins })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        settings.suspensionMinutes === mins
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-900 border border-stone-700 text-stone-400 hover:text-white'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-stone-500">
                  Suspended apps will remain inaccessible until either the prayer is completed or the window expires.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: TEST INTERCEPTOR SIMULATOR */}
          {activeTab === 'test' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-950 border border-emerald-500/30 space-y-2">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Test Adhan App Suspension Interceptor</span>
                </h3>
                <p className="text-xs text-stone-300">
                  Tap any suspended app below to see the exact blocker shield that appears when the Call to Prayer has commenced.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {settings.apps
                  .filter((a) => a.isSuspended)
                  .slice(0, 9)
                  .map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        if (onSimulateAppBlock) {
                          onSimulateAppBlock(app);
                        } else {
                          alert(
                            `🚫 [SALLAH MATE SHIELD ACTIVATED]\n\n${app.name} is SUSPENDED for Sallah!\n\nThe Call to Prayer has commenced. Stand before Allah first. May Allah accept your prayers.`
                          );
                        }
                      }}
                      className="p-3 rounded-xl bg-stone-950/80 border border-rose-500/30 hover:border-rose-500 hover:bg-rose-950/30 text-left transition space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-300 group-hover:text-rose-200">
                          {app.name}
                        </span>
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Click to test block
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANDROID / DEVICE SYNC */}
          {activeTab === 'integration' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-950 border border-emerald-500/30 space-y-2">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  How Device-Wide App Suspension Works
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  When installed on your Android or iOS device as a PWA, SallahMate maintains a full-screen distraction-free lock. To automatically suspend native apps across your entire Android operating system during Adhan, SallahMate integrates with Android Digital Wellbeing and automation tools like <strong>Tasker</strong> or <strong>Macrodroid</strong>.
                </p>
              </div>

              {/* Export package list for Android */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">
                      Copy Suspended Apps Package List ({suspendedCount} apps)
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Paste directly into Android Focus Mode, Digital Wellbeing, or automation rules.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyPackages}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedPackageList ? 'Copied!' : 'Copy List'}</span>
                  </button>
                </div>

                <div className="max-h-28 overflow-y-auto p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] font-mono text-emerald-400">
                  {generateAndroidPackageList(settings.apps) || 'No apps currently suspended'}
                </div>
              </div>

              {/* 3 Steps Guide */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3 text-xs text-stone-300">
                <div className="font-semibold text-emerald-400">
                  3 Steps for Native Phone Lockdown:
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold shrink-0">
                      1
                    </span>
                    <span>
                      <strong>Install SallahMate as an App:</strong> Tap the "Install App" button in the top bar to install directly onto your home screen.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold shrink-0">
                      2
                    </span>
                    <span>
                      <strong>Enable Adhan Auto-Lock:</strong> In the Security tab, keep "Strict Anti-Bypass Security" checked so your phone screen engages fullscreen prayer mode.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold shrink-0">
                      3
                    </span>
                    <span>
                      <strong>Digital Wellbeing Link:</strong> Copy the package list above and add it to your phone’s "Do Not Disturb / Bedtime / Focus Mode" for automated OS-level suppression.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-stone-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>
              {settings.enabled
                ? `${suspendedCount} apps will be locked upon Adhan`
                : 'Suspension is currently disabled'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
