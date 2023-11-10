import {
  collection,
  doc,
  limit,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore/lite'
import { getConverter } from '../getConverter'
import { Match } from './Match'
import { WithId } from '@/types/WithId'
import { NotFoundError } from '../errors/NotFoundError'
import { firestore, getDoc, getDocs } from '@/services/firestore'

const converter = getConverter<Match>()

const col = collection(firestore, 'matches').withConverter(converter)

async function listByPlayerId(uid: string): Promise<WithId<Match>[]> {
  const q = query(
    col,
    or(where('black.uid', '==', uid), where('white.uid', '==', uid)),
    orderBy('timestamp', 'desc'),
    limit(20),
  )
  const snap = await getDocs(q)

  if (import.meta.env.DEV)
    console.info(
      `%cFirestore: Get ${snap.docs.length} matches`,
      'color: #FFCA28',
    )

  return snap.docs.map((doc) => doc.data())
}

async function getById(id: string) {
  const snap = await getDoc(doc(col, id))
  const data = snap.data()
  if (!data) throw new NotFoundError('matches', id)
  if (import.meta.env.DEV)
    console.info('%cFirestore: Get match by id', 'color: #FFCA28')
  return data
}

export const matches = { getById, listByPlayerId }
