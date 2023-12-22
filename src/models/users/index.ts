import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { getConverter } from '../getConverter'
import { UserData } from './User'
import { NotFoundError } from '../errors/NotFoundError'
import { firestore, getDoc, getDocs } from '@/services/firestore'

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

async function getStandings(): Promise<UserData[]> {
  const q = query(usersCollection, orderBy('glicko.rating', 'desc'), limit(30))
  const snap = await getDocs(q)

  import.meta.env.DEV &&
    console.info(
      `%cFirestore: Get ${snap.docs.length} users.`,
      'color: #FFCA28',
    )

  const result = snap.docs.map((doc) => doc.data())

  return result
}

function subscribe(uid: string, callback: (data: UserData) => void) {
  return onSnapshot(
    doc(firestore, 'users', uid).withConverter(converter),
    (snap) => {
      console.info('%cFirestore: Snap user', 'color: #FFCA28')
      const userData = snap.data()
      if (userData) callback(userData)
    },
  )
}

export const users = { getById, getStandings, subscribe }
