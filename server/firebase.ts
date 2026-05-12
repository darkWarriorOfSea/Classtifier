/**
 * In-Memory Mock Firestore for local development / demo.
 * Mimics the Firestore Admin SDK API so all controllers work unchanged.
 * Data lives in memory — resets on server restart.
 */

import { FieldValue, Timestamp } from './mockFieldValue';

// ─── In-Memory Store ──────────────────────────────────────────────────────────

const store: Record<string, Record<string, any>> = {
  users: {},
  lectures: {},
  labs: {},
  announcements: {},
  notifications: {},
  attendance: {},
};

let idCounter = 1;
function generateId(): string {
  return `doc_${Date.now()}_${idCounter++}`;
}

// ─── Mock Document Reference ──────────────────────────────────────────────────

class MockDocRef {
  constructor(public collectionName: string, public id: string) {}

  async get(): Promise<MockDocSnapshot> {
    const data = store[this.collectionName]?.[this.id] || null;
    return new MockDocSnapshot(this.id, data, this);
  }

  async set(data: any): Promise<void> {
    store[this.collectionName][this.id] = resolveFieldValues({ ...data });
  }

  async update(data: any): Promise<void> {
    const existing = store[this.collectionName][this.id];
    if (!existing) throw new Error(`Document ${this.id} not found`);
    store[this.collectionName][this.id] = { ...existing, ...resolveFieldValues(data) };
  }

  async delete(): Promise<void> {
    delete store[this.collectionName][this.id];
  }
}

// ─── Mock Document Snapshot ───────────────────────────────────────────────────

class MockDocSnapshot {
  public exists: boolean;
  public ref: MockDocRef;

  constructor(public id: string, private _data: any | null, ref: MockDocRef) {
    this.exists = _data !== null;
    this.ref = ref;
  }

  data(): any | null {
    return this._data ? { ...this._data } : null;
  }
}

// ─── Mock Query Snapshot ──────────────────────────────────────────────────────

class MockQuerySnapshot {
  public empty: boolean;
  public size: number;

  constructor(public docs: MockDocSnapshot[]) {
    this.empty = docs.length === 0;
    this.size = docs.length;
  }
}

// ─── Mock Count Snapshot ──────────────────────────────────────────────────────

class MockCountSnapshot {
  constructor(private _count: number) {}
  data() {
    return { count: this._count };
  }
}

// ─── Mock Query ───────────────────────────────────────────────────────────────

class MockQuery {
  private filters: Array<{ field: string; op: string; value: any }> = [];
  private _orderBy: { field: string; dir: string } | null = null;
  private _limit: number = Infinity;

  constructor(public collectionName: string, filters?: any[], orderByVal?: any, limitVal?: number) {
    if (filters) this.filters = filters;
    if (orderByVal) this._orderBy = orderByVal;
    if (limitVal) this._limit = limitVal;
  }

  where(field: string, op: string, value: any): MockQuery {
    const q = new MockQuery(this.collectionName, [...this.filters, { field, op, value }], this._orderBy, this._limit);
    return q;
  }

  orderBy(field: string, dir: string = 'asc'): MockQuery {
    return new MockQuery(this.collectionName, [...this.filters], { field, dir }, this._limit);
  }

  limit(n: number): MockQuery {
    return new MockQuery(this.collectionName, [...this.filters], this._orderBy, n);
  }

  count(): { get: () => Promise<MockCountSnapshot> } {
    const self = this;
    return {
      async get() {
        const snap = await self.get();
        return new MockCountSnapshot(snap.size);
      }
    };
  }

  async get(): Promise<MockQuerySnapshot> {
    const collection = store[this.collectionName] || {};
    let docs = Object.entries(collection).map(([id, data]) => ({
      id,
      data: { ...data },
    }));

    // Apply filters
    for (const filter of this.filters) {
      docs = docs.filter(doc => {
        const val = doc.data[filter.field];
        switch (filter.op) {
          case '==': return val === filter.value;
          case '!=': return val !== filter.value;
          case '>': return val > filter.value;
          case '>=': return val >= filter.value;
          case '<': return val < filter.value;
          case '<=': return val <= filter.value;
          case 'in': return Array.isArray(filter.value) && filter.value.includes(val);
          case 'array-contains': return Array.isArray(val) && val.includes(filter.value);
          default: return true;
        }
      });
    }

    // Apply orderBy
    if (this._orderBy) {
      const { field, dir } = this._orderBy;
      docs.sort((a, b) => {
        const aVal = a.data[field];
        const bVal = b.data[field];
        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    docs = docs.slice(0, this._limit);

    const snapshots = docs.map(d => {
      const ref = new MockDocRef(this.collectionName, d.id);
      return new MockDocSnapshot(d.id, d.data, ref);
    });

    return new MockQuerySnapshot(snapshots);
  }
}

// ─── Mock Collection Reference ────────────────────────────────────────────────

class MockCollectionRef extends MockQuery {
  public firestore = { batch: () => new MockBatch() };

  constructor(name: string) {
    super(name);
    if (!store[name]) store[name] = {};
  }

  doc(id?: string): MockDocRef {
    const docId = id || generateId();
    return new MockDocRef(this.collectionName, docId);
  }

  async add(data: any): Promise<MockDocRef> {
    const id = generateId();
    store[this.collectionName][id] = resolveFieldValues({ ...data });
    return new MockDocRef(this.collectionName, id);
  }
}

// ─── Mock Batch ───────────────────────────────────────────────────────────────

class MockBatch {
  private ops: Array<() => void> = [];

  set(ref: MockDocRef, data: any): void {
    this.ops.push(() => {
      store[ref.collectionName][ref.id] = resolveFieldValues({ ...data });
    });
  }

  update(ref: MockDocRef, data: any): void {
    this.ops.push(() => {
      const existing = store[ref.collectionName][ref.id];
      if (existing) {
        store[ref.collectionName][ref.id] = { ...existing, ...resolveFieldValues(data) };
      }
    });
  }

  delete(ref: MockDocRef): void {
    this.ops.push(() => {
      delete store[ref.collectionName][ref.id];
    });
  }

  async commit(): Promise<void> {
    this.ops.forEach(op => op());
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveFieldValues(data: any): any {
  const resolved: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && (value as any).__type === 'serverTimestamp') {
      resolved[key] = new Date().toISOString();
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

// ─── Exports (same API as firebase.ts) ────────────────────────────────────────

export const db = { collection: (name: string) => new MockCollectionRef(name) };
export const usersCol        = new MockCollectionRef('users');
export const lecturesCol     = new MockCollectionRef('lectures');
export const labsCol         = new MockCollectionRef('labs');
export const announcementsCol = new MockCollectionRef('announcements');
export const notificationsCol = new MockCollectionRef('notifications');
export const attendanceCol   = new MockCollectionRef('attendance');

console.log('📦 Using IN-MEMORY mock database (demo mode — no Firebase)');
