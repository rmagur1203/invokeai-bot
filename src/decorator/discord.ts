import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  MessageContextMenuCommandInteraction,
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import 'reflect-metadata';
import { injectDependency } from './inject';

// eslint-disable-next-line no-unused-vars
enum MetadataKeys {
  // eslint-disable-next-line no-unused-vars
  command = 'command',
  // eslint-disable-next-line no-unused-vars
  description = 'description',
  // eslint-disable-next-line no-unused-vars
  body = 'body',
}

export function registCommands(
  rest: REST,
  userID: string,
  modules: ModuleInterface[]
) {
  const commands: any[] = [];
  for (const module of modules) {
    for (const key of Object.keys(module.prototype) as string[]) {
      const body = Reflect.getMetadata(
        MetadataKeys.body,
        module.prototype,
        key
      ) as RESTPostAPIApplicationCommandsJSONBody;
      if (body) {
        commands.push(body);
      }
    }
  }
  rest.put(Routes.applicationCommands(userID), {
    body: commands,
  });
}

export function injectClient(client: Client, modules: ModuleInterface[]) {
  injectDependency('DISCORD_CLIENT', client, modules);
}

export function attachCommands(client: Client, modules: ModuleInterface[]) {
  for (const module of modules) {
    Object.keys(module.prototype).forEach((key) => {
      const handler = module.prototype[key] as CommandHandler;
      const body = Reflect.getMetadata(
        MetadataKeys.body,
        module.prototype,
        key
      ) as RESTPostAPIApplicationCommandsJSONBody;

      if (body) {
        client.on('interactionCreate', async (interaction) => {
          if (!interaction.isCommand()) return;

          if (interaction.commandName === body.name) {
            handler.bind(new module())(interaction);
          }
        });
      }
    });
  }
}

export interface ModuleInterface extends Function {
  new (...args: any[]): any;
}

export type CommandHandler = (interaction: Interaction) => void;

export type Interaction<T extends CacheType = CacheType> =
  | ChatInputCommandInteraction<T>
  | MessageContextMenuCommandInteraction<T>
  | UserContextMenuCommandInteraction<T>;

export function Module() {
  return function (target: any) {
    // target.prototype.commands = [];
    Object.keys(target.prototype).forEach((key) => {
      // const body = Reflect.getMetadata(
      //   MetadataKeys.body,
      //   target.prototype,
      //   key
      // ) as RESTPostAPIApplicationCommandsJSONBody;
      //
      // if (body.name) {
      //   target.prototype.commands.push(body.name);
      // }
    });
  };
}

export function Command(body: RESTPostAPIApplicationCommandsJSONBody) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(MetadataKeys.body, body, target, propertyKey);
  };
}
