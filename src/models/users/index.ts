import { collection, doc, getDoc } from 'firebase/firestore/lite'
import { getConverter } from '../getConverter'
import { UserData } from './User'
import { firestore } from '@/services/firebase'
import { WithId } from '@/types/WithId'
import { NotFoundError } from '../errors/NotFoundError'

const converter = getConverter<UserData>()

const usersCollection = collection(firestore, 'users').withConverter(converter)

async function getbyId(id: string): Promise<WithId<UserData>> {
  const snap = await getDoc(doc(usersCollection, id))
  const data = snap.data()
  if (!data) throw new NotFoundError('users', id)

  return data
}

export const users = { getbyId }
