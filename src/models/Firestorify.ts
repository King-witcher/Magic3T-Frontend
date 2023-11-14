import { ModifyProp } from '@/types/ModifyProp'
import { DocumentData, Timestamp } from 'firebase/firestore'

export type Firestorify<T extends DocumentData> = ModifyProp<T, Date, Timestamp>
