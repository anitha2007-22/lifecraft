import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

const SUBJECT_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Commerce & Accounts',
  'Economics',
  'English & Literature',
  'Design & Arts',
];

const INTEREST_OPTIONS = [
  'Technology & AI',
  'Healthcare & Medicine',
  'Engineering & Smart Infrastructure',
  'Business & Venture Scaling',
  'Product Design & UI/UX',
  'Scientific Research & Genomics',
  'Entrepreneurship & Startups',
  'Public Policy & Sustainability',
];

const SKILL_OPTIONS = [
  'Problem solving',
  'Creativity',
  'Communication',
  'Leadership',
  'Teamwork',
  'Planning & Strategy',
  'Financial reasoning',
  'Technical agility',
];

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { profile, updateProfile, user } = useGame();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile?.name || user?.name || '');
  const [classGrade, setClassGrade] = useState(profile?.classGrade || '12th Grade (Science & CS)');
  const [ageRange, setAgeRange] = useState(profile?.ageRange || '17-18 years');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    profile?.favouriteSubjects?.length ? profile.favouriteSubjects : ['Computer Science', 'Mathematics']
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile?.interests?.length ? profile.interests : ['Technology & AI', 'Engineering & Smart Infrastructure']
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    profile?.selectedSkills?.length ? profile.selectedSkills : ['Problem solving', 'Creativity']
  );
  const [avatarIcon, setAvatarIcon] = useState<string>(profile?.avatarIcon || '🚀');

  if (!isOpen) return null;

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = () => {
    updateProfile({
      name,
      classGrade,
      ageRange,
      favouriteSubjects: selectedSubjects,
      interests: selectedInterests,
      selectedSkills: selectedSkills,
      avatarIcon,
      onboardingCompleted: true,
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400">
              STEP {step} OF 5
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  i <= step ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Initialize Your Profile
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Let's tailor your career simulation journeys to your current 12th-grade academic context.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Grade & Stream
                </label>
                <select
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="12th Grade (Science & CS)">12th Grade (Science with Computer Science)</option>
                  <option value="12th Grade (Science PCB/Medical)">12th Grade (Science PCB / Pre-Med)</option>
                  <option value="12th Grade (Commerce with Math)">12th Grade (Commerce with Math)</option>
                  <option value="12th Grade (Commerce General)">12th Grade (Commerce / Business Studies)</option>
                  <option value="12th Grade (Humanities & Arts)">12th Grade (Humanities, Design & Arts)</option>
                  <option value="High School Senior (International/IB/AP)">High School Senior (IB / AP / Cambridge)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Age Group
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['16-17 years', '17-18 years', '18+ years'].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAgeRange(a)}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        ageRange === a
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Your Student Explorer Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { icon: '🚀', label: 'Innovator' },
                    { icon: '⚡', label: 'Hacker' },
                    { icon: '🧠', label: 'Strategist' },
                    { icon: '🌐', label: 'Pioneer' },
                    { icon: '🛡️', label: 'Architect' },
                    { icon: '🧬', label: 'Scientist' },
                  ].map((av) => (
                    <button
                      key={av.icon}
                      type="button"
                      onClick={() => setAvatarIcon(av.icon)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        avatarIcon === av.icon
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 shadow-sm ring-1 ring-cyan-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{av.icon}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {av.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Subjects */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Favourite Subjects
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select the school subjects that engage you the most.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SUBJECT_OPTIONS.map((sub) => {
                const active = selectedSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleItem(selectedSubjects, setSelectedSubjects, sub)}
                    className={`p-3 text-left rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span>{sub}</span>
                    {active && <Check className="w-4 h-4 text-cyan-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Domains of Curiosity
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Which industries or real-world domains excite your curiosity?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INTEREST_OPTIONS.map((item) => {
                const active = selectedInterests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(selectedInterests, setSelectedInterests, item)}
                    className={`p-3 text-left rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span>{item}</span>
                    {active && <Check className="w-4 h-4 text-cyan-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Self-Selected Skills */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Self-Identified Strengths
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select 2–3 capabilities you feel most comfortable applying right now.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SKILL_OPTIONS.map((sk) => {
                const active = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleItem(selectedSkills, setSelectedSkills, sk)}
                    className={`p-3 text-left rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span>{sk}</span>
                    {active && <Check className="w-4 h-4 text-cyan-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Finalize
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Ready Card */}
        {step === 5 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                Your LIFECRAFT journey is ready.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Welcome, <span className="font-semibold text-cyan-500">{name || 'Explorer'}</span>. Your simulation engine is calibrated. Explore real challenges, make high-stakes decisions, and watch your digital Skill Passport come to life.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Grade:</span>
                <span className="font-medium text-slate-900 dark:text-white">{classGrade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Focus:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedInterests.slice(0, 2).join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Core Strengths:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedSkills.slice(0, 2).join(', ')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                Launch LIFECRAFT Platform
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
