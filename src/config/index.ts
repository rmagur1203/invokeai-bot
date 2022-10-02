import 'dotenv/config';

export class Config {
  static get(key: string) {
    return process.env[key] || '';
  }
}
