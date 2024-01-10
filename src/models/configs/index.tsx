import { firestore, getDoc } from '@/services/firestore'
import { RatingConfig } from './RatingConfig'
import { doc } from 'firebase/firestore'

async function getRatingConfig(): Promise<RatingConfig> {
  const snap = await getDoc(doc(firestore, 'config/rating'))
  const data = snap.data() as RatingConfig
  return data
}

getRatingConfig().then(console.log)

export const configs = { getRatingConfig }
