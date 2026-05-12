/**
 * Mock FieldValue and Timestamp to replace firebase-admin/firestore imports.
 * Used by controllers via: import { FieldValue } from 'firebase-admin/firestore'
 * We re-export from here so the mock DB can resolve serverTimestamp() calls.
 */

export const FieldValue = {
  serverTimestamp: () => ({ __type: 'serverTimestamp' }),
  increment: (n: number) => ({ __type: 'increment', value: n }),
  arrayUnion: (...elements: any[]) => ({ __type: 'arrayUnion', elements }),
  arrayRemove: (...elements: any[]) => ({ __type: 'arrayRemove', elements }),
  delete: () => ({ __type: 'delete' }),
};

export class Timestamp {
  constructor(public seconds: number, public nanoseconds: number) {}

  static now(): Timestamp {
    const ms = Date.now();
    return new Timestamp(Math.floor(ms / 1000), (ms % 1000) * 1e6);
  }

  static fromDate(date: Date): Timestamp {
    const ms = date.getTime();
    return new Timestamp(Math.floor(ms / 1000), (ms % 1000) * 1e6);
  }

  toDate(): Date {
    return new Date(this.seconds * 1000 + this.nanoseconds / 1e6);
  }
}
