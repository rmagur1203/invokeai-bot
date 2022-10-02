'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var command_module_1 = require('../decoraters/command-module');
var PingModule = /** @class */ (function () {
  function PingModule() {}
  PingModule.prototype.ping = function (interaction) {
    interaction.reply('Pong!');
  };
  var _a;
  __decorate(
    [
      (0, command_module_1.Command)({
        command: 'ping',
        description: 'Replies with Pong!',
      }),
      __metadata('design:type', Function),
      __metadata('design:paramtypes', [
        typeof (_a =
          typeof command_module_1.Interaction !== 'undefined' &&
          command_module_1.Interaction) === 'function'
          ? _a
          : Object,
      ]),
      __metadata('design:returntype', void 0),
    ],
    PingModule.prototype,
    'ping',
    null
  );
  PingModule = __decorate([(0, command_module_1.Module)()], PingModule);
  return PingModule;
})();
exports.default = PingModule;
//# sourceMappingURL=ping.js.map
