import { collection, doc } from 'firebase/firestore/lite'
import { getConverter } from '../getConverter'
import { UserData } from './User'
import { WithId } from '@/types/WithId'
import { NotFoundError } from '../errors/NotFoundError'
import { firestore, getDoc } from '@/services/firestore'

const converter = getConverter<UserData>()

const usersCollection = collection(firestore, 'users').withConverter(converter)

async function getbyId(id: string): Promise<WithId<UserData>> {
  if (import.meta.env.DEV)
    console.info('%cFirestore: Get user', 'color: #FFCA28')
  const snap = await getDoc(doc(usersCollection, id))
  const data = snap.data()
  if (!data) throw new NotFoundError('users', id)

  return data
}

export const users = { getbyId }
