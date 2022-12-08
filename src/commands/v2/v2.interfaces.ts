import { ProgressUpdate } from '../../invokeai';

export interface Server {
  name: string;
  url: string;
  status: string;
  processing: ProgressUpdate;
}
