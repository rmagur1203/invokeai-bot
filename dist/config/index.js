'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Config = void 0;
require('dotenv.config');
var Config = /** @class */ (function () {
  function Config() {}
  Config.get = function (key) {
    return process.env[key] || '';
  };
  return Config;
})();
exports.Config = Config;
//# sourceMappingURL=index.js.map
