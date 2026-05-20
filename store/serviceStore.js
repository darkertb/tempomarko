const TimezoneService = require('../service/timezoneService');
const CodexService = require('../service/codexService');

module.exports = {
  timezoneService: new TimezoneService(),
  codexService: new CodexService(),
};
