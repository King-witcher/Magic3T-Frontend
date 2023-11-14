import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { Firestorify } from './Firestorify'
import { WithId } from '@/types/WithId'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
