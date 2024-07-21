import type { WithId } from '@/types/withId.ts'
import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import type { Firestorify } from './Firestorify'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function convert(data: Record<string, any>) {
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      data[key] = value.toDate()
    } else if (value instanceof Object) {
      convert(data[key])
    }
  }
}

export function getConverter<
  T extends DocumentData & WithId,
>(): FirestoreDataConverter<T> {
  return {
    fromFirestore(snap: QueryDocumentSnapshot) {
      const data = snap.data()
      convert(data)
      return {
        ...data,
        _id: snap.id,
      } as T
    },
    toFirestore: (data) => data as Firestorify<T>,
  }
}
