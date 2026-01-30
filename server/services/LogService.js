const { getDB } = require('../database');

class LogService {
  static getAllLogs() {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.all('SELECT * FROM logs ORDER BY date DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse symptoms and convert to arrays
          const parsedRows = rows.map(row => ({
            ...row,
            symptoms: this.parseSymptoms(row.symptoms)
          }));
          resolve(parsedRows);
        }
      });
    });
  }

  static getLogByDate(date) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.get('SELECT * FROM logs WHERE date = ?', [date], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            row.symptoms = this.parseSymptoms(row.symptoms);
          }
          resolve(row);
        }
      });
    });
  }

  static createOrUpdateLog(date, logData) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      const symptomsJson = JSON.stringify(logData.symptoms || []);

      // First check if log exists
      db.get('SELECT id FROM logs WHERE date = ?', [date], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row) {
          // Update existing
          db.run(
            `UPDATE logs SET energyLevel = ?, productivityRating = ?, mood = ?, symptoms = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP WHERE date = ?`,
            [logData.energyLevel, logData.productivityRating, logData.mood, symptomsJson, logData.notes, date],
            function(err) {
              if (err) {
                reject(err);
              } else {
                LogService.getLogByDate(date).then(resolve).catch(reject);
              }
            }
          );
        } else {
          // Insert new
          db.run(
            `INSERT INTO logs (date, energyLevel, productivityRating, mood, symptoms, notes) VALUES (?, ?, ?, ?, ?, ?)`,
            [date, logData.energyLevel, logData.productivityRating, logData.mood, symptomsJson, logData.notes],
            function(err) {
              if (err) {
                reject(err);
              } else {
                LogService.getLogByDate(date).then(resolve).catch(reject);
              }
            }
          );
        }
      });
    });
  }

  static deleteLog(date) {
    return new Promise((resolve, reject) => {
      const db = getDB();
      db.run('DELETE FROM logs WHERE date = ?', [date], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Log deleted successfully' });
        }
      });
    });
  }

  // Helper method to parse symptoms - handles both CSV and JSON formats
  static parseSymptoms(symptomsData) {
    if (!symptomsData) {
      return [];
    }
    
    try {
      // Try parsing as JSON first
      return JSON.parse(symptomsData);
    } catch (e) {
      // If JSON parse fails, treat as comma-separated string
      return symptomsData
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
  }
}

module.exports = LogService;
