import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export async function generateGameMasterCommentary(params: {
  studentName: string;
  journeyTitle: string;
  missionTitle: string;
  situation: string;
  choiceSelected: string;
  consequences: string;
  currentSkills: Record<string, number>;
}): Promise<string> {
  const ai = getAiClient();
  if (!ai) {
    return `Notable tactical choice! By selecting this approach in "${params.missionTitle}", you balanced immediate operational stability with strategic clarity. Keep monitoring your team energy and resources in upcoming missions.`;
  }

  try {
    const prompt = `You are the LIFECRAFT AI Game Master for a 12th-grade career simulation platform.
Student Name: ${params.studentName}
Journey: ${params.journeyTitle}
Mission: ${params.missionTitle}
Situation: ${params.situation}
Student's Choice: ${params.choiceSelected}
Outcome: ${params.consequences}

Write a concise, engaging 2-3 sentence commentary as the AI Game Master.
Guidelines:
- Speak directly to the student in an encouraging, gaming-oriented mentor tone.
- Explain the real-world career trade-off of their decision.
- Never claim to predict their lifelong destiny; focus on the skills demonstrated right now in this simulation.
- Keep it under 65 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text) return text;
  } catch (error) {
    console.error('Gemini GameMaster call error:', error);
  }

  return `Sharp instinct, ${params.studentName}! Your decision demonstrates proactive reasoning under pressure. In real-world environments, balancing immediate resolution with long-term trust is what defines resilient leadership.`;
}

export async function analyzeStudentInterests(params: {
  studentName: string;
  answers: Array<{ question: string; chosenText: string; archetype: string }>;
  favouriteSubjects: string[];
  interests: string[];
}): Promise<{
  archetype: string;
  tagline: string;
  summary: string;
  suggestedJourneys: string[];
  recommendedFocus: string;
}> {
  const ai = getAiClient();

  const fallback = {
    archetype: 'Strategic Systems Innovator',
    tagline: 'Driven by curiosity, analytical clarity, and collaborative execution.',
    summary: 'Your gameplay choices suggest a natural inclination toward tackling systemic challenges where technology, planning, and teamwork intersect. You tend to weigh empirical evidence while maintaining empathy for project stakeholders.',
    suggestedJourneys: ['Technology', 'Engineering', 'Business'],
    recommendedFocus: 'Iterative problem-solving and cross-functional team leadership',
  };

  if (!ai) return fallback;

  try {
    const prompt = `You are the LIFECRAFT AI Career & Skill Discovery Engine analyzing a 12th-grade student's gameplay decisions.
Student: ${params.studentName}
Favorite Subjects: ${params.favouriteSubjects.join(', ')}
Stated Interests: ${params.interests.join(', ')}
Decisions made in discovery challenges:
${params.answers.map((a, i) => `${i + 1}. ${a.question} -> Selected: ${a.chosenText} (${a.archetype})`).join('\n')}

Analyze their simulation style and return valid JSON with:
{
  "archetype": "Short 2-4 word Title (e.g. Adaptive Systems Architect, Collaborative Impact Strategist)",
  "tagline": "One punchy sentence capturing their problem-solving mindset",
  "summary": "2-3 sentences explaining what their simulation choices suggest they might enjoy exploring. Strictly use phrasing like 'Your gameplay suggests areas you may enjoy exploring' and NEVER claim to predict their future.",
  "suggestedJourneys": ["Array of 3 categories from: Technology, Healthcare, Engineering, Business, Design, Research"],
  "recommendedFocus": "Short skill domain to develop further"
}
Ensure the response is raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return {
        archetype: parsed.archetype || fallback.archetype,
        tagline: parsed.tagline || fallback.tagline,
        summary: parsed.summary || fallback.summary,
        suggestedJourneys: Array.isArray(parsed.suggestedJourneys) ? parsed.suggestedJourneys : fallback.suggestedJourneys,
        recommendedFocus: parsed.recommendedFocus || fallback.recommendedFocus,
      };
    }
  } catch (error) {
    console.error('Gemini Interest Analysis error:', error);
  }

  return fallback;
}

export async function generatePeriodicFeedback(params: {
  studentName: string;
  recentMissions: Array<{ title: string; choice: string }>;
  skillScores: Record<string, number>;
}): Promise<{
  feedbackText: string;
  skillToImprove: string;
}> {
  const ai = getAiClient();

  // Find lowest skill
  const entries = Object.entries(params.skillScores);
  entries.sort((a, b) => a[1] - b[1]);
  const lowestSkill = entries[0] ? entries[0][0] : 'Teamwork';
  const formatSkillName = (s: string) => {
    switch (s) {
      case 'problemSolving': return 'Problem Solving';
      case 'decisionMaking': return 'Decision Making';
      case 'creativity': return 'Creativity';
      case 'teamwork': return 'Teamwork';
      case 'planning': return 'Planning';
      case 'financialManagement': return 'Financial Management';
      default: return 'Teamwork';
    }
  };

  const defaultImprove = formatSkillName(lowestSkill);

  const fallback = {
    feedbackText: `Your recent decisions show strong analytical composure and steady planning under pressure. You consistently weigh long-term operational health over reckless shortcuts.`,
    skillToImprove: defaultImprove,
  };

  if (!ai) return fallback;

  try {
    const prompt = `You are the LIFECRAFT AI Game Master providing milestone feedback to high school student ${params.studentName}.
Current Simulation Skills:
${JSON.stringify(params.skillScores, null, 2)}
Recent Actions:
${params.recentMissions.map((m) => `- ${m.title}: ${m.choice}`).join('\n')}

Generate short, punchy feedback in JSON format:
{
  "feedbackText": "2 sentences summarizing their decision tendencies and strengths shown so far in the game.",
  "skillToImprove": "One specific skill name (Problem Solving, Decision Making, Creativity, Teamwork, Planning, or Financial Management) where they can push further."
}
Raw JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return {
        feedbackText: parsed.feedbackText || fallback.feedbackText,
        skillToImprove: parsed.skillToImprove || defaultImprove,
      };
    }
  } catch (error) {
    console.error('Gemini Feedback error:', error);
  }

  return fallback;
}
