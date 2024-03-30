import { firestore, getDoc } from '@/services/firestore'
import { RatingConfig } from './RatingConfig'
import { doc } from 'firebase/firestore'

async function getRatingConfig(): Promise<RatingConfig> {
  const snap = await getDoc(doc(firestore, 'config/rating'))
  import.meta.env.DEV &&
    console.info('%cFirestore: Get rating config', 'color: #FFCA28')
  return snap.data() as RatingConfig
}

export const configs = { getRatingConfig }
