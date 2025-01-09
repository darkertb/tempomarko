#! /usr/bin/env node
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, './userConfig/timezone.json');

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify({ template: {}, timezone: 8 }));
}

const Tempomarko = require('./tempomarko');

(async () => {

  try {

    const tempomarko = new Tempomarko();
    // if contains alpha characters, parseInt(str, 36);
    tempomarko.run(process.argv.slice(2).map((arg) => {

      if (arg.startsWith('@')) {
        return arg.replace('@', '');
      }

      if (/^[0-9]+$/.test(arg)) {
        return arg;
      }
      if (arg.includes('-') || arg.includes(',') || arg.includes('+')) {
        return arg;
      }

      return parseInt(arg, 36).toString();
    }));
  }
  catch(error) {
    console.error(error);
  }
  finally {
    process.exit(0);
  }
})();
