const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../userConfig/codex.json');

class CodexService {
  constructor() { }

  getWeeklyResetTimestamp() {

    const codexInfo = this.readFile();

    return codexInfo.weeklyResetTimestamp || null;
  }

  setWeeklyResetTimestamp(timestamp) {

    const codexInfo = this.readFile();

    codexInfo.weeklyResetTimestamp = timestamp;

    this.writeFile(codexInfo);
  }

  readFile() {

    if (!fs.existsSync(FILE_PATH)) {
      this.writeFile({});
    }

    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  }

  writeFile(content) {

    fs.writeFileSync(FILE_PATH, JSON.stringify(content), 'utf8');
  }
}

module.exports = CodexService;
