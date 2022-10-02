import { Client, GatewayIntentBits, REST } from 'discord.js';
import PingModule from './commands/ping';
import { Config } from './config';
import { attachCommands, registCommands } from './decorator/discord';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(Config.get('TOKEN'));

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);

  registCommands(rest, client.user!.id, [PingModule]);
  attachCommands(client, [PingModule]);
});

client.login(Config.get('TOKEN'));
