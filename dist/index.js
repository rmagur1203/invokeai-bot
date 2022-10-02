'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var discord_js_1 = require('discord.js');
var ping_1 = __importDefault(require('./commands/ping'));
var config_1 = require('./config');
var discord_1 = require('./decorator/discord');
var client = new discord_js_1.Client({
  intents: [discord_js_1.GatewayIntentBits.Guilds],
});
var rest = new discord_js_1.REST({ version: '10' }).setToken(
  config_1.Config.get('TOKEN')
);
client.on('ready', function () {
  console.log('Logged in as '.concat(client.user.tag, '!'));
  (0, discord_1.registCommands)(rest, client.user.id, [ping_1.default]);
  (0, discord_1.attachCommands)(client, [ping_1.default]);
});
client.login(config_1.Config.get('TOKEN'));
//# sourceMappingURL=index.js.map
