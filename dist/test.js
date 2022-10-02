'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var ping_1 = __importDefault(require('./commands/ping'));
var command_module_1 = require('./decoraters/command-module');
console.log(new ping_1.default().commands);
(0, command_module_1.attachCommands)(null, [ping_1.default]);
//# sourceMappingURL=test.js.map
