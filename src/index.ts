import { ActivityType, Client, GatewayIntentBits, REST } from 'discord.js';
import { Config } from './config';
import {
  attachCommands,
  ModuleInterface,
  registCommands,
} from './decorator/discord';
import path from 'path';
import glob from 'fast-glob';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(Config.get('TOKEN'));

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
  client.user?.setActivity('이미지 생성', { type: ActivityType.Playing });

  (async () => {
    const modules = await getModules();
    registCommands(rest, client.user!.id, modules);
    attachCommands(client, modules);
  })();
});

async function getModules() {
  return await glob('commands/**/([a-zA-Z-_])+.module.{ts,js}', {
    cwd: __dirname,
  }).then((files) => {
    return Promise.all(
      files.map(async (file) => {
        return require(path.join(__dirname, file)).default as ModuleInterface;
      })
    );
  });
}

client.login(Config.get('TOKEN'));
