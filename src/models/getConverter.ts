import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore/lite'
import { Firestorify } from './Firestorify'

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
  T extends DocumentData,
>(): FirestoreDataConverter<T> {
  return {
    fromFirestore(snap: QueryDocumentSnapshot) {
      const data = snap.data()
      convert(data)
      return data as T
    },
    toFirestore: (data) => data as Firestorify<T>,
  }
}
