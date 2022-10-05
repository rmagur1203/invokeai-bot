import { Client, GatewayIntentBits, REST } from 'discord.js';
import { Config } from './config';
import {
  attachCommands,
  ModuleInterface,
  registCommands,
} from './decorator/discord';
import path from 'path';
import glob from 'fast-glob';
import { registCacheManager } from './decorator';
import * as redisStore from 'cache-manager-redis-store';
import ms from 'ms';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(Config.get('TOKEN'));

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);

  (async () => {
    const modules = await getModules();
    const files = await getFiles();
    registCommands(rest, client.user!.id, modules);
    registCacheManager(
      redisStore.create,
      {
        host: Config.get('REDIS_HOST'),
        port: Config.get('REDIS_PORT'),
        ttl: ms('10m'),
      },
      files
    );
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

async function getFiles() {
  return await glob(
    'commands/**/([a-zA-Z-_])+.{module,controller,service}.{ts,js}',
    {
      cwd: __dirname,
    }
  ).then((files) => {
    return Promise.all(
      files.map(async (file) => {
        return require(path.join(__dirname, file)).default as ModuleInterface;
      })
    );
  });
}

client.login(Config.get('TOKEN'));
