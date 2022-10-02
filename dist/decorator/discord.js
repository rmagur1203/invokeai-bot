'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Command =
  exports.Module =
  exports.attachCommands =
  exports.registCommands =
    void 0;
var discord_js_1 = require('discord.js');
require('reflect-metadata');
// eslint-disable-next-line no-unused-vars
var MetadataKeys;
(function (MetadataKeys) {
  // eslint-disable-next-line no-unused-vars
  MetadataKeys['command'] = 'command';
  // eslint-disable-next-line no-unused-vars
  MetadataKeys['description'] = 'description';
})(MetadataKeys || (MetadataKeys = {}));
function registCommands(rest, userID, modules) {
  var _loop_1 = function (module_1) {
    var commands = Object.keys(module_1.prototype)
      .map(function (key) {
        var command = Reflect.getMetadata(
          MetadataKeys.command,
          module_1.prototype,
          key
        );
        var description = Reflect.getMetadata(
          MetadataKeys.description,
          module_1.prototype,
          key
        );
        if (command && description) {
          return {
            name: command,
            description: description,
          };
        }
      })
      .filter(function (x) {
        return x;
      });
    rest.put(discord_js_1.Routes.applicationCommands(userID), {
      body: commands,
    });
  };
  for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
    var module_1 = modules_1[_i];
    _loop_1(module_1);
  }
}
exports.registCommands = registCommands;
function attachCommands(client, modules) {
  var _this = this;
  var _loop_2 = function (module_2) {
    Object.keys(module_2.prototype).forEach(function (key) {
      var handler = module_2.prototype[key];
      var command = Reflect.getMetadata(
        MetadataKeys.command,
        module_2.prototype,
        key
      );
      client.on('interactionCreate', function (interaction) {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            if (!interaction.isCommand()) return [2 /*return*/];
            if (!interaction.isRepliable()) return [2 /*return*/];
            if (interaction.commandName === command) {
              handler(interaction);
            }
            return [2 /*return*/];
          });
        });
      });
    });
  };
  for (var _i = 0, modules_2 = modules; _i < modules_2.length; _i++) {
    var module_2 = modules_2[_i];
    _loop_2(module_2);
  }
}
exports.attachCommands = attachCommands;
function Module() {
  return function (target) {
    target.prototype.commands = [];
    Object.keys(target.prototype).forEach(function (key) {
      var command = Reflect.getMetadata(
        MetadataKeys.command,
        target.prototype,
        key
      );
      if (command) {
        target.prototype.commands.push(command);
      }
    });
  };
}
exports.Module = Module;
function Command(_a) {
  var command = _a.command,
    description = _a.description;
  return function (target, propertyKey, descriptor) {
    Reflect.defineMetadata(MetadataKeys.command, command, target, propertyKey);
    Reflect.defineMetadata(
      MetadataKeys.description,
      description,
      target,
      propertyKey
    );
  };
}
exports.Command = Command;
//# sourceMappingURL=discord.js.map
