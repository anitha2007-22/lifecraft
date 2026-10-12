import { Router, Request, Response } from 'express';
import {
  generateGameMasterCommentary,
  analyzeStudentInterests,
  generatePeriodicFeedback,
} from './geminiService.ts';

export const apiRouter = Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'LIFECRAFT AI',
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

apiRouter.post('/ai/game-master', async (req: Request, res: Response) => {
  try {
    const { studentName, journeyTitle, missionTitle, situation, choiceSelected, consequences, currentSkills } = req.body;
    const commentary = await generateGameMasterCommentary({
      studentName: studentName || 'Explorer',
      journeyTitle: journeyTitle || 'Career Mission',
      missionTitle: missionTitle || 'Current Challenge',
      situation: situation || '',
      choiceSelected: choiceSelected || '',
      consequences: consequences || '',
      currentSkills: currentSkills || {},
    });
    res.json({ commentary });
  } catch (error) {
    console.error('API /ai/game-master error:', error);
    res.status(500).json({
      commentary: 'Tactical decision recorded! Your choice reflects pragmatic problem-solving under active constraints.',
    });
  }
});

apiRouter.post('/ai/analyze-interests', async (req: Request, res: Response) => {
  try {
    const { studentName, answers, favouriteSubjects, interests } = req.body;
    const result = await analyzeStudentInterests({
      studentName: studentName || 'Explorer',
      answers: Array.isArray(answers) ? answers : [],
      favouriteSubjects: Array.isArray(favouriteSubjects) ? favouriteSubjects : [],
      interests: Array.isArray(interests) ? interests : [],
    });
    res.json(result);
  } catch (error) {
    console.error('API /ai/analyze-interests error:', error);
    res.status(500).json({
      archetype: 'Strategic Systems Innovator',
      tagline: 'Driven by curiosity, analytical clarity, and collaborative execution.',
      summary: 'Your gameplay choices suggest a natural inclination toward tackling systemic challenges where technology, planning, and teamwork intersect.',
      suggestedJourneys: ['Technology', 'Engineering', 'Business'],
      recommendedFocus: 'Iterative problem-solving',
    });
  }
});

apiRouter.post('/ai/mission-feedback', async (req: Request, res: Response) => {
  try {
    const { studentName, recentMissions, skillScores } = req.body;
    const feedback = await generatePeriodicFeedback({
      studentName: studentName || 'Explorer',
      recentMissions: Array.isArray(recentMissions) ? recentMissions : [],
      skillScores: skillScores || {},
    });
    res.json(feedback);
  } catch (error) {
    console.error('API /ai/mission-feedback error:', error);
    res.status(500).json({
      feedbackText: 'Your decisions show balanced planning and active engagement with project trade-offs.',
      skillToImprove: 'Teamwork',
    });
  }
});
