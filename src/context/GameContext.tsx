import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  StudentProfile,
  GameState,
  Journey,
  Achievement,
  Scenario,
  DecisionRecord,
  SkillScores,
  LifeEvent,
} from '../types';
import {
  JOURNEYS,
  ACHIEVEMENTS,
  INITIAL_SKILLS,
  LIFE_EVENTS,
  DEMO_PRESET_STUDENT,
} from '../data/mockData';
import {
  playClickSound,
  playLockSound,
  playRevealSound,
  playLevelUpSound,
} from '../utils/soundEffects';

interface GameContextType {
  user: User | null;
  profile: StudentProfile | null;
  gameState: GameState;
  journeys: Journey[];
  achievements: Achievement[];
  activeJourney: Journey | null;
  currentScenario: Scenario | null;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  toggleSound: () => void;
  toggleTheme: () => void;
  // Auth
  login: (email: string, role?: 'student' | 'admin', name?: string) => void;
  signup: (name: string, email: string, role?: 'student' | 'admin') => void;
  logout: () => void;
  updateProfile: (profileData: Partial<StudentProfile>) => void;
  startDemoMode: () => void;
  // Game Actions
  startJourney: (journeyId: string) => void;
  advanceToNextMission: () => void;
  makeDecision: (choiceId: string) => Promise<{
    consequenceHeadline: string;
    consequenceStory: string;
    consequenceImage: string;
    consequence: string;
    commentary: string;
    skillDeltas: Partial<SkillScores>;
    xpEarned: number;
    unlockedChallengeTitle?: string;
  }>;
  resolveLifeEvent: (event: LifeEvent, choiceId: string) => void;
  activeLifeEvent: LifeEvent | null;
  clearLifeEvent: () => void;
  resetGame: () => void;
  completeArenaChallenge: (xp: number) => void;
  // Admin Actions
  addScenario: (journeyId: string, scenario: Omit<Scenario, 'id'>) => void;
  updateScenario: (scenario: Scenario) => void;
  deleteScenario: (journeyId: string, scenarioId: string) => void;
  registeredStudents: Array<{ id: string; name: string; email: string; level: number; xp: number; joined: string }>;
  // Notifications
  recentUnlockedBadge: Achievement | null;
  clearUnlockedBadge: () => void;
  showLevelUpModal: boolean;
  closeLevelUpModal: () => void;
}

const STORAGE_KEYS = {
  USER: 'lifecraft_user_v2',
  PROFILE: 'lifecraft_profile_v2',
  GAME_STATE: 'lifecraft_gamestate_v2',
  THEME: 'lifecraft_theme_v2',
  SOUND: 'lifecraft_sound_v2',
  JOURNEYS: 'lifecraft_journeys_v2',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>(JOURNEYS);
  const [achievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [activeLifeEvent, setActiveLifeEvent] = useState<LifeEvent | null>(null);
  const [recentUnlockedBadge, setRecentUnlockedBadge] = useState<Achievement | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);

  const [gameState, setGameState] = useState<GameState>({
    xp: 0,
    level: 1,
    money: 10000,
    timeEnergy: 100,
    activeJourneyId: null,
    currentMissionIndex: 0,
    completedMissionsCount: 0,
    completedLevels: 0,
    totalLevels: 8,
    isCertificateUnlocked: false,
    completedScenarioIds: [],
    skillScores: { ...INITIAL_SKILLS },
    decisionsHistory: [],
    unlockedAchievementIds: [],
    isDemoMode: false,
  });

  const [registeredStudents, setRegisteredStudents] = useState([
    { id: 'std_1', name: 'Aarav Sharma', email: 'aarav@school.edu', level: 9, xp: 1840, joined: '2026-09-12' },
    { id: 'std_2', name: 'Ananya Iyer', email: 'ananya@school.edu', level: 8, xp: 1620, joined: '2026-09-18' },
    { id: 'std_3', name: 'Rohan Mehta', email: 'rohan@school.edu', level: 8, xp: 1550, joined: '2026-09-24' },
    { id: 'std_4', name: 'Diya Patel', email: 'diya@school.edu', level: 7, xp: 1390, joined: '2026-10-01' },
    { id: 'std_5', name: 'Kiran Verma (Demo)', email: 'kiran.demo@lifecraft.ai', level: 4, xp: 450, joined: '2026-10-09' },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
        document.documentElement.classList.add('dark');
      }

      const savedSound = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true');
      }

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedGameState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (savedGameState) {
        const parsed = JSON.parse(savedGameState);
        const total = parsed.totalLevels ?? 8;
        const comp = parsed.completedLevels ?? parsed.completedMissionsCount ?? 0;
        const unlocked = parsed.isCertificateUnlocked ?? (comp >= total && total > 0);
        setGameState((prev) => ({
          ...prev,
          ...parsed,
          completedLevels: comp,
          totalLevels: total,
          isCertificateUnlocked: unlocked,
          completedScenarioIds: parsed.completedScenarioIds || [],
        }));
      }
    } catch (e) {
      console.error('Failed to load storage state', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
  }, [gameState]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem(STORAGE_KEYS.SOUND, String(nextVal));
    if (nextVal) playClickSound(true);
  };

  const login = (email: string, role: 'student' | 'admin' = 'student', name?: string) => {
    const resolvedName = name || (email.split('@')[0] ? email.split('@')[0].replace('.', ' ') : 'Student');
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1),
      email,
      role,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);

    if (role === 'student' && !profile) {
      setProfile({
        userId: newUser.id,
        name: newUser.name,
        classGrade: '12th Grade (General)',
        ageRange: '17-18 years',
        favouriteSubjects: ['Computer Science', 'Mathematics'],
        interests: ['Technology', 'Engineering'],
        selectedSkills: ['Problem solving', 'Decision making'],
        avatarIcon: '🚀',
        onboardingCompleted: false,
      });
    }
  };

  const signup = (name: string, email: string, role: 'student' | 'admin' = 'student') => {
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      role,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setProfile({
      userId: newUser.id,
      name,
      classGrade: '12th Grade (Senior)',
      ageRange: '17-18 years',
      favouriteSubjects: [],
      interests: [],
      selectedSkills: [],
      avatarIcon: '🚀',
      onboardingCompleted: false,
    });
    setRegisteredStudents((prev) => [
      { id: newUser.id, name: newUser.name, email: newUser.email, level: 1, xp: 0, joined: newUser.createdAt },
      ...prev,
    ]);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setGameState({
      xp: 0,
      level: 1,
      money: 10000,
      timeEnergy: 100,
      activeJourneyId: null,
      currentMissionIndex: 0,
      completedMissionsCount: 0,
      completedLevels: 0,
      totalLevels: 8,
      isCertificateUnlocked: false,
      completedScenarioIds: [],
      skillScores: { ...INITIAL_SKILLS },
      decisionsHistory: [],
      unlockedAchievementIds: [],
      isDemoMode: false,
    });
  };

  const startDemoMode = () => {
    setUser({
      id: DEMO_PRESET_STUDENT.id,
      name: DEMO_PRESET_STUDENT.name,
      email: DEMO_PRESET_STUDENT.email,
      role: 'student',
      createdAt: DEMO_PRESET_STUDENT.createdAt,
    });
    setProfile(DEMO_PRESET_STUDENT.profile);
    setGameState({
      xp: 0,
      level: 1,
      money: 10000,
      timeEnergy: 100,
      activeJourneyId: 'tech',
      currentMissionIndex: 0,
      completedMissionsCount: 0,
      completedLevels: 0,
      totalLevels: 8,
      isCertificateUnlocked: false,
      completedScenarioIds: [],
      skillScores: { ...INITIAL_SKILLS },
      decisionsHistory: [],
      unlockedAchievementIds: [],
      isDemoMode: true,
    });
  };

  const updateProfile = (profileData: Partial<StudentProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...profileData } : null));
  };

  const activeJourney = journeys.find((j) => j.id === gameState.activeJourneyId) || null;
  const currentScenario =
    activeJourney && activeJourney.scenarios[gameState.currentMissionIndex]
      ? activeJourney.scenarios[gameState.currentMissionIndex]
      : null;

  const startJourney = (journeyId: string) => {
    playClickSound(soundEnabled);
    const targetJourney = journeys.find((j) => j.id === journeyId);
    const targetTotal = targetJourney ? targetJourney.scenarios.length : 8;
    setGameState((prev) => ({
      ...prev,
      activeJourneyId: journeyId,
      currentMissionIndex: 0,
      timeEnergy: 100,
      totalLevels: targetTotal,
    }));
  };

  const checkAchievements = (newXp: number, newSkills: SkillScores, completedCount: number, currentUnlocked: string[]) => {
    const toUnlock: Achievement[] = [];

    ACHIEVEMENTS.forEach((ach) => {
      if (currentUnlocked.includes(ach.id)) return;

      if (ach.id === 'first_mission' && completedCount >= 1) toUnlock.push(ach);
      if (ach.id === 'problem_solver' && newSkills.problemSolving >= 75) toUnlock.push(ach);
      if (ach.id === 'strategic_thinker' && newSkills.planning >= 80) toUnlock.push(ach);
      if (ach.id === 'creative_mind' && newSkills.creativity >= 75) toUnlock.push(ach);
      if (ach.id === 'team_player' && newSkills.teamwork >= 80) toUnlock.push(ach);
      if (ach.id === 'smart_planner' && newSkills.financialManagement >= 75) toUnlock.push(ach);
      if (ach.id === 'future_explorer' && completedCount >= 8) toUnlock.push(ach);
      if (ach.id === 'lifecraft_master' && newXp >= 1000) toUnlock.push(ach);
    });

    if (toUnlock.length > 0) {
      const first = toUnlock[0];
      setRecentUnlockedBadge(first);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // confetti safe
      }
    }

    return [...currentUnlocked, ...toUnlock.map((a) => a.id)];
  };

  const makeDecision = async (choiceId: string) => {
    if (!currentScenario || !activeJourney) {
      throw new Error('No active scenario');
    }

    const choice = currentScenario.choices.find((c) => c.id === choiceId);
    if (!choice) {
      throw new Error('Choice not found');
    }

    playLockSound(soundEnabled);

    // Calculate skill updates
    const updatedSkills = { ...gameState.skillScores };
    Object.entries(choice.skillImpacts).forEach(([key, val]) => {
      if (val !== undefined && key in updatedSkills) {
        const k = key as keyof SkillScores;
        updatedSkills[k] = Math.max(10, Math.min(99, updatedSkills[k] + val));
      }
    });

    const newXp = gameState.xp + choice.xpReward;
    const previousLevel = gameState.level;
    const newLevel = Math.floor(newXp / 200) + 1;
    const newCompletedCount = gameState.completedMissionsCount + 1;
    const newMoney = Math.max(0, gameState.money + choice.moneyChange);
    const newEnergy = Math.max(15, Math.min(100, gameState.timeEnergy + choice.timeEnergyChange));

    if (newLevel > previousLevel) {
      setShowLevelUpModal(true);
      playLevelUpSound(soundEnabled);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {
        // safe
      }
    }

    const decisionRecord: DecisionRecord = {
      scenarioId: currentScenario.id,
      missionTitle: currentScenario.title,
      selectedChoiceId: choice.id,
      choiceTag: choice.tag,
      choiceTitle: choice.title,
      choiceText: choice.text,
      consequenceStory: choice.consequenceStory,
      consequence: choice.consequenceText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      skillDelta: choice.skillImpacts,
      xpEarned: choice.xpReward,
    };

    const newUnlocked = checkAchievements(newXp, updatedSkills, newCompletedCount, gameState.unlockedAchievementIds);

    // AI Game Master commentary via server
    let commentary = '';
    try {
      const response = await fetch('/api/ai/game-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: profile?.name || user?.name || 'Explorer',
          journeyTitle: activeJourney.title,
          missionTitle: currentScenario.title,
          situation: currentScenario.situation,
          choiceSelected: `${choice.tag}: ${choice.title} - ${choice.text}`,
          consequences: choice.consequenceStory,
          currentSkills: updatedSkills,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        commentary = data.commentary;
      }
    } catch (err) {
      commentary = `LUMA notes: By committing to ${choice.title}, you balanced immediate operational delivery with long-term trust. Excellent conviction.`;
    }

    // Trigger unexpected life event at mission 2
    if (gameState.currentMissionIndex === 1 && !activeLifeEvent) {
      setActiveLifeEvent(LIFE_EVENTS[0]);
    }

    const totalLevels = activeJourney ? activeJourney.scenarios.length : (gameState.totalLevels || 8);
    const previousCompletedLevels = gameState.completedLevels ?? gameState.completedMissionsCount ?? 0;
    const newCompletedLevels = Math.min(totalLevels, previousCompletedLevels + 1);
    const isUnlocked = newCompletedLevels >= totalLevels && totalLevels > 0;

    if (isUnlocked && !gameState.isCertificateUnlocked) {
      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.4 },
        });
      } catch (e) {
        // safe
      }
    }

    // Update game state with decision impacts, keeping currentMissionIndex so the consequence can be viewed
    setGameState((prev) => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      money: newMoney,
      timeEnergy: newEnergy,
      completedMissionsCount: Math.max(prev.completedMissionsCount, prev.currentMissionIndex + 1),
      completedLevels: newCompletedLevels,
      totalLevels,
      isCertificateUnlocked: isUnlocked,
      completedScenarioIds: prev.completedScenarioIds?.includes(currentScenario.id)
        ? prev.completedScenarioIds
        : [...(prev.completedScenarioIds || []), currentScenario.id],
      skillScores: updatedSkills,
      decisionsHistory: [decisionRecord, ...prev.decisionsHistory],
      unlockedAchievementIds: newUnlocked,
    }));

    return {
      consequenceHeadline: choice.consequenceHeadline || '🚨 WORLD STATE UPDATED',
      consequenceStory: choice.consequenceStory,
      consequenceImage: choice.consequenceImage || currentScenario.sceneVisual,
      consequence: choice.consequenceText,
      commentary: commentary || 'Decision verified.',
      skillDeltas: choice.skillImpacts,
      xpEarned: choice.xpReward,
      unlockedChallengeTitle: choice.unlockedChallengeTitle,
    };
  };

  const advanceToNextMission = () => {
    const totalLevels = activeJourney ? activeJourney.scenarios.length : (gameState.totalLevels || 8);
    const nextIndex = gameState.currentMissionIndex + 1;
    const newCompletedLevels = Math.min(totalLevels, Math.max(gameState.completedLevels, nextIndex));
    const isUnlocked = newCompletedLevels >= totalLevels && totalLevels > 0;

    if (isUnlocked && !gameState.isCertificateUnlocked) {
      try {
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.4 },
        });
      } catch (e) {
        // safe
      }
    }

    setGameState((prev) => ({
      ...prev,
      currentMissionIndex: nextIndex,
      completedMissionsCount: Math.min(totalLevels, Math.max(prev.completedMissionsCount, nextIndex)),
      completedLevels: newCompletedLevels,
      totalLevels,
      isCertificateUnlocked: isUnlocked,
    }));
  };

  const resolveLifeEvent = (event: LifeEvent, choiceId: string) => {
    const choice = event.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    playLockSound(soundEnabled);
    const updatedSkills = { ...gameState.skillScores };
    Object.entries(choice.skillImpacts).forEach(([key, val]) => {
      if (val !== undefined && key in updatedSkills) {
        const k = key as keyof SkillScores;
        updatedSkills[k] = Math.max(10, Math.min(99, updatedSkills[k] + val));
      }
    });

    const newXp = gameState.xp + choice.xpReward;
    const newUnlocked = checkAchievements(newXp, updatedSkills, gameState.completedMissionsCount, gameState.unlockedAchievementIds);

    setGameState((prev) => ({
      ...prev,
      xp: newXp,
      money: Math.max(0, prev.money + choice.moneyChange),
      timeEnergy: Math.max(10, Math.min(100, prev.timeEnergy + choice.timeEnergyChange)),
      skillScores: updatedSkills,
      unlockedAchievementIds: newUnlocked,
    }));

    setActiveLifeEvent(null);
  };

  const clearLifeEvent = () => setActiveLifeEvent(null);

  const completeArenaChallenge = (bonusXp: number) => {
    setGameState((prev) => {
      const newXp = prev.xp + bonusXp;
      const newLevel = Math.floor(newXp / 200) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {
      // safe
    }
  };

  const resetGame = () => {
    setGameState({
      xp: 0,
      level: 1,
      money: 10000,
      timeEnergy: 100,
      activeJourneyId: null,
      currentMissionIndex: 0,
      completedMissionsCount: 0,
      completedLevels: 0,
      totalLevels: 8,
      isCertificateUnlocked: false,
      completedScenarioIds: [],
      skillScores: { ...INITIAL_SKILLS },
      decisionsHistory: [],
      unlockedAchievementIds: [],
      isDemoMode: false,
    });
  };

  const clearUnlockedBadge = () => setRecentUnlockedBadge(null);
  const closeLevelUpModal = () => setShowLevelUpModal(false);

  // Admin Actions
  const addScenario = (journeyId: string, scenarioData: Omit<Scenario, 'id'>) => {
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id === journeyId) {
          const newScenario: Scenario = {
            ...scenarioData,
            id: `${journeyId}_m${j.scenarios.length + 1}_custom_${Date.now()}`,
          };
          return {
            ...j,
            scenarios: [...j.scenarios, newScenario],
            totalMissions: j.scenarios.length + 1,
          };
        }
        return j;
      })
    );
  };

  const updateScenario = (updated: Scenario) => {
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id === updated.journeyId) {
          return {
            ...j,
            scenarios: j.scenarios.map((s) => (s.id === updated.id ? updated : s)),
          };
        }
        return j;
      })
    );
  };

  const deleteScenario = (journeyId: string, scenarioId: string) => {
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id === journeyId) {
          return {
            ...j,
            scenarios: j.scenarios.filter((s) => s.id !== scenarioId),
            totalMissions: Math.max(1, j.scenarios.length - 1),
          };
        }
        return j;
      })
    );
  };

  return (
    <GameContext.Provider
      value={{
        user,
        profile,
        gameState,
        journeys,
        achievements,
        activeJourney,
        currentScenario,
        theme,
        soundEnabled,
        toggleSound,
        toggleTheme,
        login,
        signup,
        logout,
        updateProfile,
        startDemoMode,
        startJourney,
        advanceToNextMission,
        makeDecision,
        resolveLifeEvent,
        activeLifeEvent,
        clearLifeEvent,
        resetGame,
        completeArenaChallenge,
        addScenario,
        updateScenario,
        deleteScenario,
        registeredStudents,
        recentUnlockedBadge,
        clearUnlockedBadge,
        showLevelUpModal,
        closeLevelUpModal,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
