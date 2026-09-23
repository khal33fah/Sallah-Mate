import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  Sparkles,
  Shield,
  Lock,
  Radio,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { PrayerName, VoicePrayerVerificationRecord } from '../types';
import { playSpiritualChime } from '../utils/prayerTimes';

interface PrayerVoiceRecorderProps {
  prayerName: PrayerName;
  rakahs: number;
  onVoiceVerificationComplete: (record: VoicePrayerVerificationRecord) => void;
  isStrictAntiBypass?: boolean;
  onCancel?: () => void;
}

export const IQAMAH_LINES = [
  { arabic: 'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ', translit: 'Allāhu Akbar, Allāhu Akbar', meaning: 'Allah is the Greatest, Allah is the Greatest' },
  { arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللهُ', translit: 'Ash-hadu allā ilāha illallāh', meaning: 'I bear witness that there is no deity worthy of worship except Allah' },
  { arabic: 'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ', translit: 'Ash-hadu anna Muḥammadan Rasūlullāh', meaning: 'I bear witness that Muhammad is the Messenger of Allah' },
  { arabic: 'حَيَّ عَلَى الصَّلَاةِ', translit: 'Ḥayya ʿalaṣ-ṣalāh', meaning: 'Hasten to the prayer' },
  { arabic: 'حَيَّ عَلَى الْفَلَاحِ', translit: 'Ḥayya ʿalal-falāḥ', meaning: 'Hasten to real success' },
  { arabic: 'قَدْ قَامَتِ الصَّلَاةُ، قَدْ قَامَتِ الصَّلَاةُ', translit: 'Qad qāmatiṣ-ṣalātu, qad qāmatiṣ-ṣalāh', meaning: 'The prayer has indeed commenced, the prayer has indeed commenced' },
  { arabic: 'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ', translit: 'Allāhu Akbar, Allāhu Akbar', meaning: 'Allah is the Greatest, Allah is the Greatest' },
  { arabic: 'لَا إِلَٰهَ إِلَّا اللهُ', translit: 'Lā ilāha illallāh', meaning: 'There is no deity worthy of worship except Allah' },
];

export const PRAYER_DETAIL_STEPS = [
  {
    stepId: 'takbir',
    title: '1. Takbirat al-Ihram',
    arabic: 'اللهُ أَكْبَر',
    translit: 'Allāhu Akbar',
    meaning: 'Raise hands to ears/shoulders with intention (Niyyah) for this Sallah',
    instruction: 'Recite Takbeer into the mic to commence your prayer',
  },
  {
    stepId: 'fatiha',
    title: '2. Qiyam & Surah Al-Fatiha',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ... وَلَا الضَّالِّينَ',
    translit: 'Bismillāhir-Raḥmānir-Raḥīm... Wa lāḍ-ḍāllīn',
    meaning: 'Recite Surah Al-Fatiha and supplementary verses with humble reflection (Khushu)',
    instruction: 'Stand upright facing Qibla and recite Fatiha audibly',
  },
  {
    stepId: 'ruku',
    title: '3. Ruku (Bowing Down)',
    arabic: 'سُبْحَانَ رَبِّيَ العَظِيم (٣ مَرَّات)',
    translit: 'Subḥāna Rabbiyal-ʿAẓīm (3 times)',
    meaning: 'Glory be to my Lord, the Almighty',
    instruction: 'Bow forward with level back, glorifying Allah',
  },
  {
    stepId: 'itidal',
    title: '4. I’tidal (Rising from Bowing)',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ • رَبَّنَا وَلَكَ الحَمْد',
    translit: 'Samiʿallāhu liman ḥamidah • Rabbanā wa lakal-ḥamd',
    meaning: 'Allah hears whoever praises Him. Our Lord, to You belongs all praise',
    instruction: 'Stand upright in stillness before descending to prostration',
  },
  {
    stepId: 'sujud1',
    title: '5. First Sujud (Prostration)',
    arabic: 'سُبْحَانَ رَبِّيَ الأَعْلَى (٣ مَرَّات)',
    translit: 'Subḥāna Rabbiyal-Aʿlā (3 times)',
    meaning: 'Glory be to my Lord, the Most High',
    instruction: 'Prostrate on 7 limbs, nearest the servant is to his Lord',
  },
  {
    stepId: 'jalsah',
    title: '6. Jalsah (Sitting between Prostrations)',
    arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
    translit: 'Rabbighfir lī, Rabbighfir lī',
    meaning: 'O my Lord, forgive me; O my Lord, forgive me',
    instruction: 'Sit calmly with hands on thighs seeking forgiveness',
  },
  {
    stepId: 'sujud2',
    title: '7. Second Sujud (Prostration)',
    arabic: 'سُبْحَانَ رَبِّيَ الأَعْلَى (٣ مَرَّات)',
    translit: 'Subḥāna Rabbiyal-Aʿlā (3 times)',
    meaning: 'Glory be to my Lord, the Most High',
    instruction: 'Complete the second prostration with heartfelt submission',
  },
  {
    stepId: 'tashahhud',
    title: '8. Tashahhud & Salawat',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ...',
    translit: 'At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt...',
    meaning: 'All compliments, prayers and pure words are due to Allah...',
    instruction: 'Sit for Tashahhud, bear witness to Tawhid and send peace upon the Prophet ﷺ',
  },
  {
    stepId: 'tasleem',
    title: '9. Tasleem (Conclusion of Sallah)',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ',
    translit: 'As-salāmu ʿalaykum wa raḥmatullāh (Right & Left)',
    meaning: 'May peace and mercy of Allah be upon you',
    instruction: 'Turn head to right and left proclaiming the peace of Allah',
  },
];

export const PrayerVoiceRecorder: React.FC<PrayerVoiceRecorderProps> = ({
  prayerName,
  rakahs,
  onVoiceVerificationComplete,
  isStrictAntiBypass = true,
  onCancel,
}) => {
  const [phase, setPhase] = useState<'iqamah' | 'prayer_steps' | 'finished'>('iqamah');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micPermissionState, setMicPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [iqamahRecorded, setIqamahRecorded] = useState<boolean>(false);
  const [iqamahSeconds, setIqamahSeconds] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [recordedSteps, setRecordedSteps] = useState<string[]>([]);
  const [prayerSeconds, setPrayerSeconds] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [speechDetected, setSpeechDetected] = useState<boolean>(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start microphone capture and analyzer
  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setMicPermissionState('granted');

      // Setup audio analyzer for live waveform visualization
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start MediaRecorder
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      recorder.start(1000);
      setIsRecording(true);
      playSpiritualChime('gentle');

      // Visualizer loop
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);
        setSpeechDetected(normalized > 18);

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (err) {
      console.warn('Microphone permission denied or not available', err);
      setMicPermissionState('denied');
    }
  };

  const stopMicrophone = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setAudioLevel(0);
    setSpeechDetected(false);
  };

  // Timer loop
  useEffect(() => {
    let timer: any = null;
    if (isRecording) {
      timer = setInterval(() => {
        if (phase === 'iqamah') {
          setIqamahSeconds((s) => s + 1);
        } else if (phase === 'prayer_steps') {
          setPrayerSeconds((s) => s + 1);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  const handleFinishIqamah = () => {
    setIqamahRecorded(true);
    playSpiritualChime('takbeer');
    setPhase('prayer_steps');
  };

  const handleNextStep = () => {
    const currentStep = PRAYER_DETAIL_STEPS[currentStepIndex];
    if (!recordedSteps.includes(currentStep.stepId)) {
      setRecordedSteps((prev) => [...prev, currentStep.stepId]);
    }
    playSpiritualChime('gentle');

    if (currentStepIndex < PRAYER_DETAIL_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all prayer detail steps!
      stopMicrophone();
      setPhase('finished');
      playSpiritualChime('takbeer');

      const verificationRecord: VoicePrayerVerificationRecord = {
        prayerName,
        iqamahRecorded: true,
        iqamahDurationSeconds: iqamahSeconds,
        prayerRecorded: true,
        prayerDurationSeconds: prayerSeconds,
        totalAudioDuration: iqamahSeconds + prayerSeconds,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stepsRecorded: [...recordedSteps, currentStep.stepId],
      };

      onVoiceVerificationComplete(verificationRecord);
    }
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentStep = PRAYER_DETAIL_STEPS[currentStepIndex];

  return (
    <div
      id="prayer-voice-recorder-module"
      className="bg-stone-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl text-stone-100 space-y-5"
    >
      {/* Top Banner: Voice Protection Lock */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition shadow-inner ${
              isRecording
                ? 'bg-rose-600/20 border-rose-500/50 text-rose-400 animate-pulse'
                : 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
            }`}
          >
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Voice Prayer Verification Lock
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold uppercase tracking-wider">
                {prayerName} • {rakahs} Rakahs
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Suspended apps remain locked until your voice is recorded making Iqamah and reciting every prayer detail
            </p>
          </div>
        </div>

        {/* Live Audio Indicator & Mic Toggle */}
        <div className="flex items-center space-x-2">
          {isRecording ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>REC {formatSecs(phase === 'iqamah' ? iqamahSeconds : prayerSeconds)}</span>
            </div>
          ) : (
            <button
              onClick={startMicrophone}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start Microphone</span>
            </button>
          )}
        </div>
      </div>

      {/* Mic Permission Warning if Denied */}
      {micPermissionState === 'denied' && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Microphone Access Denied:</span>
            Please enable microphone permission in your browser or device settings so SallahMate can verify your Iqamah and prayer recitation.
          </div>
        </div>
      )}

      {/* Live Audio Visualizer Waveform */}
      {isRecording && (
        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Radio className={`w-4 h-4 ${speechDetected ? 'text-emerald-400 animate-pulse' : 'text-stone-500'}`} />
            <span className="text-stone-300 text-[11px]">
              {speechDetected ? 'Voice Recitation Active' : 'Waiting for recitation...'}
            </span>
          </div>

          {/* Visual Waveform Bars */}
          <div className="flex items-center gap-1 h-6">
            {[15, 30, 60, 90, 45, 75, 100, 50, 80, 40, 20].map((h, i) => {
              const activeHeight = speechDetected
                ? Math.max(4, Math.min(24, Math.round((audioLevel / 100) * h * 0.28)))
                : 4;
              return (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-emerald-500 transition-all duration-75"
                  style={{ height: `${activeHeight}px` }}
                />
              );
            })}
          </div>

          <div className="text-[10px] font-mono text-emerald-400 shrink-0">
            {audioLevel}% Vol
          </div>
        </div>
      )}

      {/* STAGE 1: IQAMAH VOICE RECORDING */}
      {phase === 'iqamah' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-stone-950 to-stone-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Requirement 1 of 2
              </span>
              <h4 className="text-sm font-bold text-white">
                Record Voice Making Iqamah (الإِقَامَة)
              </h4>
              <p className="text-xs text-stone-300">
                Recite the Iqamah into the microphone to declare that the prayer has commenced.
              </p>
            </div>
            {!isRecording && (
              <button
                onClick={startMicrophone}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0"
              >
                Enable Mic & Recite
              </button>
            )}
          </div>

          {/* Iqamah Lines Card */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5 max-h-56 overflow-y-auto">
            {IQAMAH_LINES.map((line, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="text-emerald-300 font-medium">{line.translit}</div>
                  <div className="text-[11px] text-stone-400">{line.meaning}</div>
                </div>
                <div className="font-arabic text-base sm:text-lg text-white font-bold" dir="rtl">
                  {line.arabic}
                </div>
              </div>
            ))}
          </div>

          {/* Action button to confirm Iqamah */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-stone-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Apps suspended until Iqamah and prayer are recited</span>
            </div>

            <button
              onClick={handleFinishIqamah}
              disabled={!isRecording && iqamahSeconds === 0}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <span>Confirm Iqamah Recited</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: PRAYER DETAILS VOICE RECORDING */}
      {phase === 'prayer_steps' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-stone-950 to-stone-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Requirement 2 of 2 • Step {currentStepIndex + 1} of {PRAYER_DETAIL_STEPS.length}
              </span>
              <h4 className="text-sm font-bold text-white">
                Record Every Detail of {prayerName} Sallah
              </h4>
              <p className="text-xs text-stone-300">
                Stand before Allah. Recite each posture and remembrance audibly into the voice recorder.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800">
              {currentStepIndex + 1}/{PRAYER_DETAIL_STEPS.length}
            </span>
          </div>

          {/* Current Detail Card */}
          <div className="p-5 rounded-2xl bg-stone-950 border border-emerald-500/50 space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {currentStep.title}
              </span>
              <span className="text-[11px] text-stone-400 italic">
                {currentStep.instruction}
              </span>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="font-arabic text-2xl sm:text-3xl text-emerald-300 font-bold" dir="rtl">
                {currentStep.arabic}
              </div>
              <div className="text-xs text-stone-200 font-semibold tracking-wide">
                {currentStep.translit}
              </div>
              <div className="text-xs text-stone-400 max-w-md mx-auto">
                {currentStep.meaning}
              </div>
            </div>

            {/* Step progress pills */}
            <div className="flex items-center justify-center gap-1 pt-1">
              {PRAYER_DETAIL_STEPS.map((s, idx) => (
                <div
                  key={s.stepId}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentStepIndex
                      ? 'w-6 bg-emerald-400'
                      : idx < currentStepIndex
                      ? 'w-2 bg-emerald-700'
                      : 'w-2 bg-stone-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Next Step / Complete Prayer Button */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-stone-400">
              Recording time: <span className="font-mono text-emerald-400">{formatSecs(prayerSeconds)}</span>
            </div>

            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 flex items-center gap-1.5 transition"
            >
              <span>
                {currentStepIndex === PRAYER_DETAIL_STEPS.length - 1
                  ? 'Complete & Unlock Suspended Apps'
                  : 'Recited • Next Detail'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: FINISHED */}
      {phase === 'finished' && (
        <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-extrabold text-white">
            Voice Prayer Verification Complete!
          </h4>
          <p className="text-xs text-emerald-200 max-w-sm mx-auto">
            Your voice Iqamah and prayer recitation details were recorded and verified. SallahMate has unlocked all suspended apps. May Allah accept your prayer!
          </p>
        </div>
      )}
    </div>
  );
};
