import { IStorageAdapter } from './storage.port';
import { LocalStorageAdapter } from './local-storage.adapter';

let storageAdapterInstance: IStorageAdapter;

export function getStorageAdapter(): IStorageAdapter {
  if (!storageAdapterInstance) {
    // Default to LocalStorageAdapter for local demonstration
    storageAdapterInstance = new LocalStorageAdapter();
  }
  return storageAdapterInstance;
}

export const storage = getStorageAdapter();

