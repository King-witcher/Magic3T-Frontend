import { ModifyProp } from '@/types/ModifyProp'
import { DocumentData, Timestamp } from 'firebase/firestore/lite'

export type Firestorify<T extends DocumentData> = ModifyProp<T, Date, Timestamp>
