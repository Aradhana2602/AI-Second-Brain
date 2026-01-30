const { OpenAI } = require('openai');
const { addDays, differenceInDays } = require('date-fns');
const CycleService = require('./CycleService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

class NotificationService {
  static async generateSmartNotifications(logs, cycleInfo) {
    if (!cycleInfo || !cycleInfo.isConfigured || logs.length < 2) {
      return [];
    }

    try {
      const notifications = [];
      const today = new Date();
      const tomorrow = addDays(today, 1);
      const nextWeek = addDays(today, 7);

      // Get today's and tomorrow's phase
      const todayPhase = CycleService.predictCyclePhase(
        cycleInfo.cycleLength,
        cycleInfo.periodDuration,
        cycleInfo.lastPeriodStartDate,
        today.toISOString().split('T')[0]
      );

      const tomorrowPhase = CycleService.predictCyclePhase(
        cycleInfo.cycleLength,
        cycleInfo.periodDuration,
        cycleInfo.lastPeriodStartDate,
        tomorrow.toISOString().split('T')[0]
      );

      // Get recent logs for context
      const recentLogs = logs.slice(0, 7);
      const avgEnergyLevel = recentLogs.reduce((sum, log) => sum + log.energyLevel, 0) / recentLogs.length;
      const commonSymptoms = this.getCommonSymptoms(recentLogs);
      const averageMood = this.getAverageMood(recentLogs);

      // Build context for OpenAI
      const context = `
User's Menstrual Cycle Data:
- Cycle Length: ${cycleInfo.cycleLength} days
- Period Duration: ${cycleInfo.periodDuration} days
- Last Period: ${cycleInfo.lastPeriodStartDate}

Current Status:
- Today's Phase: ${todayPhase.phase}
- Tomorrow's Phase: ${tomorrowPhase.phase}
- Average Energy (7 days): ${avgEnergyLevel.toFixed(1)}/5
- Most Common Symptoms: ${commonSymptoms.join(', ') || 'none'}
- Average Mood: ${averageMood}

Recent Logs (last 7 days):
${recentLogs.map(log => 
  `- ${log.date}: Energy ${log.energyLevel}/5, Mood: ${log.mood}, Symptoms: ${log.symptoms.join(', ') || 'none'}`
).join('\n')}

Generate 3-4 personalized, actionable notifications for this user. Each notification should:
1. Be specific to their cycle phase
2. Reference their actual data/patterns
3. Include an emoji
4. Be motivational and helpful
5. Include a specific action they can take

Format as JSON array with objects: { emoji, title, message, actionable: true/false }
`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a personalized health and wellness coach specializing in menstrual cycle optimization. Generate helpful, actionable notifications.'
          },
          {
            role: 'user',
            content: context
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const parsedNotifications = JSON.parse(jsonMatch[0]);
        return parsedNotifications.slice(0, 4);
      }

      // Fallback notifications if AI fails
      return this.generateFallbackNotifications(todayPhase, tomorrowPhase, avgEnergyLevel, commonSymptoms);
    } catch (error) {
      console.error('OpenAI Error:', error.message);
      // Return fallback notifications without API key error
      return this.generateBasicNotifications(cycleInfo, logs);
    }
  }

  static generateBasicNotifications(cycleInfo, logs) {
    const notifications = [];
    const today = new Date();
    const tomorrow = addDays(today, 1);

    const todayPhase = CycleService.predictCyclePhase(
      cycleInfo.cycleLength,
      cycleInfo.periodDuration,
      cycleInfo.lastPeriodStartDate,
      today.toISOString().split('T')[0]
    );

    const tomorrowPhase = CycleService.predictCyclePhase(
      cycleInfo.cycleLength,
      cycleInfo.periodDuration,
      cycleInfo.lastPeriodStartDate,
      tomorrow.toISOString().split('T')[0]
    );

    const recentLogs = logs.slice(0, 7);
    const avgEnergy = recentLogs.reduce((sum, log) => sum + log.energyLevel, 0) / recentLogs.length;

    // Phase-specific notifications
    if (todayPhase.phase === 'menstrual') {
      notifications.push({
        emoji: '❤️',
        title: 'Period Phase - Self Care Day',
        message: 'You\'re in your menstrual phase. Focus on rest, hydration, and gentle movement today.',
        actionable: true
      });
    } else if (todayPhase.phase === 'follicular') {
      notifications.push({
        emoji: '🌱',
        title: 'Energy Rising!',
        message: 'Follicular phase = rising energy! Great time to start that new project or workout routine.',
        actionable: true
      });
    } else if (todayPhase.phase === 'ovulation') {
      notifications.push({
        emoji: '⭐',
        title: 'Peak Energy & Confidence',
        message: 'This is your POWER day! 💪 Schedule important meetings, presentations, or social events.',
        actionable: true
      });
    } else if (todayPhase.phase === 'luteal') {
      notifications.push({
        emoji: '🎯',
        title: 'Deep Work Phase',
        message: 'Luteal phase = introspection time. Perfect for analysis, planning, and detailed work.',
        actionable: true
      });
    }

    // Predict next phase change
    if (tomorrowPhase.phase !== todayPhase.phase) {
      notifications.push({
        emoji: '🔄',
        title: `Tomorrow: ${tomorrowPhase.phase} Phase Begins`,
        message: `Get ready for phase transition! Expect ${tomorrowPhase.typicalEnergy}/5 energy tomorrow.`,
        actionable: false
      });
    }

    // Energy-based recommendation
    if (avgEnergy < 3) {
      notifications.push({
        emoji: '💧',
        title: 'Low Energy Pattern Detected',
        message: 'Your energy is averaging below 3/5. Try increasing water intake, iron-rich foods, and sleep.',
        actionable: true
      });
    }

    return notifications;
  }

  static generateFallbackNotifications(todayPhase, tomorrowPhase, avgEnergy, symptoms) {
    const notifications = [];

    const phaseMessages = {
      menstrual: {
        emoji: '❤️',
        title: 'Period Phase - Rest & Recover',
        message: 'You\'re menstruating. Prioritize sleep, hydration, and light exercise today.',
        actions: ['Drink 3L water', 'Get 8 hours sleep', 'Take a warm bath']
      },
      follicular: {
        emoji: '🌱',
        title: 'Follicular Phase - Energy Rising!',
        message: 'Your energy is increasing! Perfect time to start new projects or challenging workouts.',
        actions: ['Start something new', 'Intense workout', 'Schedule meetings']
      },
      ovulation: {
        emoji: '✨',
        title: 'PEAK ENERGY - Your Power Days!',
        message: 'You\'re at your PEAK! Maximum energy, confidence, and social skills. Use this wisely!',
        actions: ['Schedule presentations', 'Important meetings', 'Job interviews']
      },
      luteal: {
        emoji: '🎯',
        title: 'Luteal Phase - Deep Work Time',
        message: 'Introspective phase ahead. Best for detailed work, planning, and analysis.',
        actions: ['Plan next month', 'Deep work sessions', 'Journaling']
      }
    };

    notifications.push({
      emoji: phaseMessages[todayPhase.phase].emoji,
      title: phaseMessages[todayPhase.phase].title,
      message: phaseMessages[todayPhase.phase].message,
      actionable: true,
      suggestions: phaseMessages[todayPhase.phase].actions
    });

    // Period prediction
    if (todayPhase.phase === 'luteal' && todayPhase.dayInPhase > 5) {
      notifications.push({
        emoji: '📅',
        title: 'Period Coming Soon',
        message: 'Your period is coming in 2-3 days. Stock up on supplies and plan light workload.',
        actionable: true
      });
    }

    return notifications.slice(0, 4);
  }

  static getCommonSymptoms(logs) {
    const symptomCount = {};
    logs.forEach(log => {
      log.symptoms.forEach(symptom => {
        symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
      });
    });
    return Object.entries(symptomCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([symptom]) => symptom);
  }

  static getAverageMood(logs) {
    const moodScore = { great: 5, good: 4, neutral: 3, low: 2, irritable: 1 };
    const total = logs.reduce((sum, log) => sum + (moodScore[log.mood] || 3), 0);
    const avg = total / logs.length;
    if (avg >= 4) return 'Great';
    if (avg >= 3.5) return 'Good';
    if (avg >= 2.5) return 'Neutral';
    return 'Could be better';
  }
}

module.exports = NotificationService;
