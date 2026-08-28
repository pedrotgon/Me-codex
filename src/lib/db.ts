// Camada única de persistência frontend IndexedDB para o Knowledge Intake do Më Life OS

export type NodeType = 'project' | 'area' | 'resource' | 'archive' | 'task' | 'markdown' | 'source';

export type RelationType = 
  | 'belongs_to' 
  | 'supports' 
  | 'produces' 
  | 'depends_on' 
  | 'references' 
  | 'task_for' 
  | 'related_to';

export interface KiNode {
  id: string;
  type: NodeType;
  title: string;
  metadata: Record<string, any>;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KiRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  weight: number;
  confidence: number;
  author: 'manual' | 'ai' | 'system';
  approved: boolean;
  createdAt: string;
}

export interface KiSourceAsset {
  id: string;
  name: string;
  relativePath: string;
  type: string;
  mimeType: string;
  size: number;
  modified: string;
  sha256: string;
  createdAt: string;
}

export interface KiMarkdownTwin {
  id: string;
  nodeId: string;
  title: string;
  filename: string;
  content: string;
  createdAt: string;
}

export interface KiIngestionJob {
  id: string;
  sourceCount: number;
  selectedCount: number;
  status: 'completed' | 'partial' | 'failed';
  createdAt: string;
}

export interface KiApprovalEvent {
  id: string;
  entityType: 'node' | 'relation' | 'proposal';
  entityId: string;
  action: 'approved' | 'rejected';
  timestamp: string;
}

const DB_NAME = 'me_life_os_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('nodes')) {
        const store = db.createObjectStore('nodes', { keyPath: 'id' });
        store.createIndex('by_type', 'type', { unique: false });
        store.createIndex('by_archived', 'archived', { unique: false });
      }

      if (!db.objectStoreNames.contains('relations')) {
        const store = db.createObjectStore('relations', { keyPath: 'id' });
        store.createIndex('by_source', 'sourceId', { unique: false });
        store.createIndex('by_target', 'targetId', { unique: false });
        store.createIndex('by_type', 'type', { unique: false });
        store.createIndex('by_approved', 'approved', { unique: false });
      }

      if (!db.objectStoreNames.contains('source_assets')) {
        const store = db.createObjectStore('source_assets', { keyPath: 'id' });
        store.createIndex('by_sha256', 'sha256', { unique: false });
      }

      if (!db.objectStoreNames.contains('markdown_twins')) {
        const store = db.createObjectStore('markdown_twins', { keyPath: 'id' });
        store.createIndex('by_node', 'nodeId', { unique: false });
      }

      if (!db.objectStoreNames.contains('ingestion_jobs')) {
        db.createObjectStore('ingestion_jobs', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('approval_events')) {
        db.createObjectStore('approval_events', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// Helpers Genéricos de Leitura / Escrita
export async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

export async function putInStore<T>(storeName: string, item: T): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function putBatchInStore<T>(storeName: string, items: T[]): Promise<void> {
  if (!items.length) return;
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    items.forEach(item => store.put(item));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteFromStore(storeName: string, id: string): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBatchFromStore(storeName: string, ids: string[]): Promise<void> {
  if (!ids.length) return;
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    ids.forEach(id => store.delete(id));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
