const { getDB } = require('../database');
const { addDays, differenceInDays } = require('date-fns');

class CycleService {
  static getCycleInfo() {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.get('SELECT * FROM cycle_info WHERE id = 1', (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  static saveCycleInfo(cycleLength, periodDuration, lastPeriodStartDate) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.get('SELECT id FROM cycle_info WHERE id = 1', (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row) {
          db.run(
            `UPDATE cycle_info SET cycleLength = ?, periodDuration = ?, lastPeriodStartDate = ?, isConfigured = 1, updatedAt = CURRENT_TIMESTAMP WHERE id = 1`,
            [cycleLength, periodDuration, lastPeriodStartDate],
            function(err) {
              if (err) {
                reject(err);
              } else {
                CycleService.getCycleInfo().then(resolve).catch(reject);
              }
            }
          );
        } else {
          db.run(
            `INSERT INTO cycle_info (id, cycleLength, periodDuration, lastPeriodStartDate, isConfigured) VALUES (1, ?, ?, ?, 1)`,
            [cycleLength, periodDuration, lastPeriodStartDate],
            function(err) {
              if (err) {
                reject(err);
              } else {
                CycleService.getCycleInfo().then(resolve).catch(reject);
              }
            }
          );
        }
      });
    });
  }

  static predictPeriodDays(cycleLength, periodDuration, lastPeriodStartDate, monthDate) {
    const lastPeriod = new Date(lastPeriodStartDate);
    const predictedDays = [];

    // Calculate the next period starts
    let currentStart = new Date(lastPeriod);
    while (currentStart.getFullYear() < monthDate.getFullYear() || 
           (currentStart.getFullYear() === monthDate.getFullYear() && currentStart.getMonth() < monthDate.getMonth())) {
      currentStart = addDays(currentStart, cycleLength);
    }

    // If next period starts in the target month, add all days of period
    if (currentStart.getFullYear() === monthDate.getFullYear() && 
        currentStart.getMonth() === monthDate.getMonth()) {
      for (let i = 0; i < periodDuration; i++) {
        const periodDay = addDays(currentStart, i);
        if (periodDay.getMonth() === monthDate.getMonth()) {
          predictedDays.push(periodDay.toISOString().split('T')[0]);
        }
      }
    }

    return predictedDays;
  }

  static predictCyclePhase(cycleLength, periodDuration, lastPeriodStartDate, targetDate) {
    const lastPeriod = new Date(lastPeriodStartDate);
    const target = new Date(targetDate);

    let daysSinceLastPeriod = differenceInDays(target, lastPeriod);

    // Normalize to positive days
    if (daysSinceLastPeriod < 0) {
      const cyclesSince = Math.floor(Math.abs(daysSinceLastPeriod) / cycleLength);
      daysSinceLastPeriod += cyclesSince * cycleLength;
    }

    // Calculate position in current cycle
    const dayInCycle = daysSinceLastPeriod % cycleLength;

    // Determine phase
    if (dayInCycle < periodDuration) {
      return { phase: 'menstrual', dayInPhase: dayInCycle, typicalEnergy: 2 };
    } else if (dayInCycle < periodDuration + 7) {
      return { phase: 'follicular', dayInPhase: dayInCycle - periodDuration, typicalEnergy: 4 };
    } else if (dayInCycle < periodDuration + 14) {
      return { phase: 'ovulation', dayInPhase: dayInCycle - (periodDuration + 7), typicalEnergy: 5 };
    } else {
      return { phase: 'luteal', dayInPhase: dayInCycle - (periodDuration + 14), typicalEnergy: 3 };
    }
  }

  static getEnergyByPhase(logs, cycleLength, periodDuration, lastPeriodStartDate) {
    const phaseEnergy = {
      menstrual: [],
      follicular: [],
      ovulation: [],
      luteal: []
    };

    logs.forEach(log => {
      const phaseInfo = this.predictCyclePhase(cycleLength, periodDuration, lastPeriodStartDate, log.date);
      phaseEnergy[phaseInfo.phase].push(log.energyLevel);
    });

    const avgEnergy = {};
    for (const [phase, energies] of Object.entries(phaseEnergy)) {
      if (energies.length > 0) {
        avgEnergy[phase] = (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(2);
      } else {
        avgEnergy[phase] = 'N/A';
      }
    }

    return {
      phaseEnergy: avgEnergy,
      dataPoints: {
        menstrual: phaseEnergy.menstrual.length,
        follicular: phaseEnergy.follicular.length,
        ovulation: phaseEnergy.ovulation.length,
        luteal: phaseEnergy.luteal.length
      }
    };
  }
}

module.exports = CycleService;
