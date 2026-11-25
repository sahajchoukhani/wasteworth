import fs from 'fs';
import path from 'path';
import {
  CustomCreationRequest,
  DecorEnquiry,
  RequestStatus,
  SubmissionsStore,
} from '@/types/wasteworth';

const PRIMARY_DATA_DIR = path.join(process.cwd(), 'data');
const PRIMARY_FILE = path.join(PRIMARY_DATA_DIR, 'submissions.json');
const FALLBACK_FILE = path.join('/tmp', 'wasteworth-submissions.json');

const EMPTY_STORE: SubmissionsStore = {
  requests: [],
  decorEnquiries: [],
};

function resolveStoreFile(): { filePath: string; mode: 'local-file' | 'tmp-ephemeral' } {
  try {
    if (!fs.existsSync(PRIMARY_DATA_DIR)) {
      fs.mkdirSync(PRIMARY_DATA_DIR, { recursive: true });
    }
    fs.accessSync(PRIMARY_DATA_DIR, fs.constants.W_OK);
    return { filePath: PRIMARY_FILE, mode: 'local-file' };
  } catch {
    return { filePath: FALLBACK_FILE, mode: 'tmp-ephemeral' };
  }
}

export function getStorageMode(): 'local-file' | 'tmp-ephemeral' {
  return resolveStoreFile().mode;
}

export function readStore(): SubmissionsStore {
  const { filePath } = resolveStoreFile();
  try {
    if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(EMPTY_STORE, null, 2), 'utf-8');
      return { ...EMPTY_STORE };
    }
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SubmissionsStore>;
    return {
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      decorEnquiries: Array.isArray(parsed.decorEnquiries)
        ? parsed.decorEnquiries
        : [],
    };
  } catch {
    return { ...EMPTY_STORE };
  }
}

export function writeStore(store: SubmissionsStore): void {
  const { filePath } = resolveStoreFile();
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
}

export function generateReferenceNumber(prefix: 'WW' | 'WWF'): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const alpha = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}-${year}-${randomPart}${alpha}`;
}

export function saveCustomRequest(
  payload: Omit<
    CustomCreationRequest,
    'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'status' | 'internalNotes'
  >
): CustomCreationRequest {
  const store = readStore();
  const now = new Date().toISOString();
  const record: CustomCreationRequest = {
    ...payload,
    id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    referenceNumber: generateReferenceNumber('WW'),
    createdAt: now,
    updatedAt: now,
    status: 'New',
    internalNotes: '',
  };
  store.requests.unshift(record);
  writeStore(store);
  return record;
}

export function updateCustomRequest(
  id: string,
  updates: { status?: RequestStatus; internalNotes?: string }
): CustomCreationRequest | null {
  const store = readStore();
  const idx = store.requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  store.requests[idx] = {
    ...store.requests[idx],
    ...(updates.status ? { status: updates.status } : {}),
    ...(typeof updates.internalNotes === 'string'
      ? { internalNotes: updates.internalNotes }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  return store.requests[idx];
}

export function saveDecorEnquiry(
  payload: Omit<
    DecorEnquiry,
    'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'status' | 'internalNotes'
  >
): DecorEnquiry {
  const store = readStore();
  const now = new Date().toISOString();
  const record: DecorEnquiry = {
    ...payload,
    id: `dec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    referenceNumber: generateReferenceNumber('WWF'),
    createdAt: now,
    updatedAt: now,
    status: 'New',
    internalNotes: '',
  };
  store.decorEnquiries.unshift(record);
  writeStore(store);
  return record;
}

export function updateDecorEnquiry(
  id: string,
  updates: { status?: RequestStatus; internalNotes?: string }
): DecorEnquiry | null {
  const store = readStore();
  const idx = store.decorEnquiries.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  store.decorEnquiries[idx] = {
    ...store.decorEnquiries[idx],
    ...(updates.status ? { status: updates.status } : {}),
    ...(typeof updates.internalNotes === 'string'
      ? { internalNotes: updates.internalNotes }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  return store.decorEnquiries[idx];
}
