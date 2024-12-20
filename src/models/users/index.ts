import { firestore, getDoc, getDocs } from '@/services/firestore'
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { NotFoundError } from '../errors/NotFoundError'
import { getConverter } from '../getConverter'
import type { UserData } from './user'

const converter = getConverter<UserData>()

const usersCollection = collection(firestore, 'users').withConverter(converter)

async function getById(id: string): Promise<UserData> {
  if (import.meta.env.DEV)
    console.info('%cFirestore: Get user', 'color: #FFCA28')
  const snap = await getDoc(doc(usersCollection, id))
  const data = snap.data()
  if (!data) throw new NotFoundError('users', id)

  return data
}

async function getRanking(): Promise<UserData[]> {
  const q = query(usersCollection, orderBy('glicko.rating', 'desc'), limit(30))
  const snap = await getDocs(q)

  import.meta.env.DEV &&
    console.info(
      `%cFirestore: Get ${snap.docs.length} users.`,
      'color: #FFCA28'
    )

  return snap.docs
    .map((doc) => doc.data())
    .filter((user) => !!user.identification)
}

function subscribe(uid: string, callback: (data: UserData) => void) {
  return onSnapshot(
    doc(firestore, 'users', uid).withConverter(converter),
    (snap) => {
      import.meta.env.DEV &&
        console.info('%cFirestore: Snap user', 'color: #FFCA28')
      const userData = snap.data()
      if (userData) callback(userData)
    }
  )
}

export const users = { getById, getRanking, subscribe }
