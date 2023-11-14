import {
  DocumentSnapshot,
  collection,
  doc,
  onSnapshot,
} from 'firebase/firestore'
import { getConverter } from '../getConverter'
import { UserData } from './User'
import { NotFoundError } from '../errors/NotFoundError'
import { firestore, getDoc } from '@/services/firestore'

const converter = getConverter<UserData>()

const usersCollection = collection(firestore, 'users').withConverter(converter)

async function getbyId(id: string): Promise<UserData> {
  if (import.meta.env.DEV)
    console.info('%cFirestore: Get user', 'color: #FFCA28')
  const snap = await getDoc(doc(usersCollection, id))
  const data = snap.data()
  if (!data) throw new NotFoundError('users', id)

  return data
}

function subscribe(uid: string, callback: (data: UserData) => void) {
  return onSnapshot(
    doc(firestore, 'users', uid).withConverter(converter),
    (snap) => {
      const userData = snap.data()
      if (userData) callback(userData)
    },
  )
}

export const users = { getbyId, subscribe }
