import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  MessageContextMenuCommandInteraction,
  REST,
  Routes,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import 'reflect-metadata';

// eslint-disable-next-line no-unused-vars
enum MetadataKeys {
  // eslint-disable-next-line no-unused-vars
  command = 'command',
  // eslint-disable-next-line no-unused-vars
  description = 'description',
}

export function registCommands(
  rest: REST,
  userID: string,
  modules: ModuleInterface[]
) {
  for (const module of modules) {
    const commands = Object.keys(module.prototype)
      .map((key) => {
        const command = Reflect.getMetadata(
          MetadataKeys.command,
          module.prototype,
          key
        );
        const description = Reflect.getMetadata(
          MetadataKeys.description,
          module.prototype,
          key
        );
        if (command && description) {
          return {
            name: command,
            description,
          };
        }
      })
      .filter((x) => x);
    rest.put(Routes.applicationCommands(userID), {
      body: commands,
    });
  }
}

export function attachCommands(client: Client, modules: ModuleInterface[]) {
  for (const module of modules) {
    Object.keys(module.prototype).forEach((key) => {
      const handler = module.prototype[key] as CommandHandler;
      const command = Reflect.getMetadata(
        MetadataKeys.command,
        module.prototype,
        key
      );

      client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        if (!interaction.isRepliable()) return;

        if (interaction.commandName === command) {
          handler(interaction);
        }
      });
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
    target.prototype.commands = [];
    Object.keys(target.prototype).forEach((key) => {
      const command = Reflect.getMetadata(
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

export function Command({
  command,
  description,
}: {
  command: string;
  description: string;
}) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(MetadataKeys.command, command, target, propertyKey);
    Reflect.defineMetadata(
      MetadataKeys.description,
      description,
      target,
      propertyKey
    );
  };
}
