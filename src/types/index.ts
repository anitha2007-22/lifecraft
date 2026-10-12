export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  name: string;
  classGrade: string;
  ageRange: string;
  favouriteSubjects: string[];
  interests: string[];
  selectedSkills: string[];
  exploratoryArchetype?: string;
  avatarIcon?: string; // e.g. '🚀', '⚡', '🧠', '🌐', '🛡️'
  onboardingCompleted: boolean;
}

export interface SkillScores {
  problemSolving: number; // 0-100
  decisionMaking: number; // 0-100
  creativity: number; // 0-100
  teamwork: number; // 0-100
  planning: number; // 0-100
  financialManagement: number; // 0-100
}

export type CharacterExpression =
  | 'happy'
  | 'worried'
  | 'surprised'
  | 'thinking'
  | 'confident'
  | 'stressed'
  | 'frustrated'
  | 'excited'
  | 'neutral';

export interface StoryDialogue {
  speaker: 'maya' | 'arjun' | 'luma' | 'drNova' | 'player' | string;
  speakerName: string;
  text: string;
  expression?: CharacterExpression;
}

export interface ComicPanel {
  panelNumber: number;
  title: string;
  caption: string;
  speaker?: string;
  speakerDialogue?: string;
  image?: string;
  icon?: string;
}

export interface NPCCharacter {
  id?: string;
  name: string;
  role: string;
  avatarEmoji: string;
  avatarColor: string;
  avatarImage?: string;
  dialogue: string;
  defaultExpression?: CharacterExpression;
}

export interface Choice {
  id: string;
  icon: string; // e.g. '🛰️', '📚', '🚁'
  tag: string; // e.g. 'EDGE AI'
  title: string; // e.g. 'Disaster Alert System'
  text: string; // e.g. 'Build technology for real-time emergency alerts.'
  simpleChoiceText?: string;
  tamilChoiceText?: string;
  rationale?: string;
  choiceIllustration?: string;
  consequenceHeadline?: string; // e.g. "🚨 ALERT DETECTED"
  consequenceStory: string; // e.g. "You chose the disaster alert project..."
  consequenceImage?: string; // image path for visual consequence scene
  consequenceReaction?: {
    speaker: 'maya' | 'arjun' | 'luma' | 'drNova';
    speakerName: string;
    expression: CharacterExpression;
    dialogue: string;
  };
  comicPanels?: ComicPanel[];
  unlockedChallengeTitle?: string; // e.g. "Emergency Response"
  skillImpacts: Partial<SkillScores>;
  xpReward: number;
  moneyChange: number;
  timeEnergyChange: number;
  consequenceText: string;
  aiInsightNote?: string;
}

export interface SimpleWordHelper {
  word: string;
  meaning: string;
}

export interface SimpleExplanation {
  simpleSummary: string;
  studentContext: string;
  keyWords: SimpleWordHelper[];
  tamilSummary: string;
  tamilStudentContext: string;
  tamilKeywords: SimpleWordHelper[];
}

export interface Scenario {
  id: string;
  journeyId: string;
  missionNumber: number;
  worldRegion: string; // e.g. "TECHNOLOGY VALLEY"
  title: string; // e.g. "THE FIRST PROJECT"
  subtitle?: string; // e.g. "Mission 01 · Beginner"
  story: string; // Plain English story
  situation: string; // Clear question or situation
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sceneVisual: string;
  sceneBackground?: string;
  sceneLocationName?: string;
  charactersInScene?: string[]; // ['maya', 'arjun', 'luma']
  storyDialogues?: StoryDialogue[];
  lumaDialogue: string;
  lumaHint: string;
  simpleExplanation?: SimpleExplanation;
  npc?: NPCCharacter;
  choices: Choice[];
  contextBadge?: string;
}

export interface LifeEvent {
  id: string;
  title: string;
  situation: string;
  icon: string;
  storyDialogues?: StoryDialogue[];
  comicSceneTitle?: string;
  choices: Choice[];
}

export interface Journey {
  id: string;
  title: string;
  worldName: string; // e.g. "Technology Valley", "Bio-Genesis District"
  category: 'Technology' | 'Healthcare' | 'Engineering' | 'Business' | 'Design' | 'Research';
  tagline: string;
  description: string;
  icon: string;
  heroImage: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  totalMissions: number;
  scenarios: Scenario[];
}

export interface DecisionRecord {
  scenarioId: string;
  missionTitle: string;
  selectedChoiceId: string;
  choiceTag: string;
  choiceTitle: string;
  choiceText: string;
  consequenceStory: string;
  consequence: string;
  timestamp: string;
  skillDelta: Partial<SkillScores>;
  xpEarned: number;
}

export interface GameState {
  xp: number;
  level: number;
  money: number;
  timeEnergy: number;
  activeJourneyId: string | null;
  currentMissionIndex: number;
  completedMissionsCount: number;
  completedLevels: number;
  totalLevels: number;
  isCertificateUnlocked: boolean;
  completedScenarioIds: string[];
  skillScores: SkillScores;
  decisionsHistory: DecisionRecord[];
  unlockedAchievementIds: string[];
  isDemoMode: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'milestone' | 'mastery' | 'skill';
  xpBonus: number;
  conditionDescription: string;
}

export interface SkillPassportData {
  id: string;
  userId: string;
  studentName: string;
  classGrade: string;
  journeyTitle: string;
  journeyCategory: string;
  level: number;
  totalXp: number;
  missionsCompleted: number;
  skillScores: SkillScores;
  dominantSkills: string[];
  achievements: Achievement[];
  issuedAt: string;
  aiEvaluationSummary: string;
  verificationCode: string;
}

export interface CertificateData {
  id: string;
  studentName: string;
  journeyTitle: string;
  journeyCategory: string;
  issuedAt: string;
  completionScore: number;
  honorTitle: string;
  verificationCode: string;
}

export interface ArenaChallenge {
  id: string;
  category: 'Logic Battle' | 'Coding Challenge' | 'Money Challenge' | 'Quick Decision' | 'Problem Solving';
  title: string;
  description: string;
  timeLimitSeconds: number;
  xpReward: number;
  options: { id: string; text: string; isCorrect: boolean; explanation: string }[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarSeed: string;
  level: number;
  xp: number;
  missionsCompleted: number;
  badgeCount: number;
  archetype: string;
}
