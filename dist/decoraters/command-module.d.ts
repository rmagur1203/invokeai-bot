import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  MessageContextMenuCommandInteraction,
  REST,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import 'reflect-metadata';
export declare function registCommands(
  rest: REST,
  userID: string,
  modules: ModuleInterface[]
): void;
export declare function attachCommands(
  client: Client,
  modules: ModuleInterface[]
): void;
export interface ModuleInterface extends Function {
  new (...args: any[]): any;
}
export declare type CommandHandler = (interaction: Interaction) => void;
export declare type Interaction<T extends CacheType = CacheType> =
  | ChatInputCommandInteraction<T>
  | MessageContextMenuCommandInteraction<T>
  | UserContextMenuCommandInteraction<T>;
export declare function Module(): (target: any) => void;
export declare function Command({
  command,
  description,
}: {
  command: string;
  description: string;
}): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
//# sourceMappingURL=command-module.d.ts.map
