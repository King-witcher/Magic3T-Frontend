import { ModifyProp } from '@/types/modifyProp.ts'
import { DocumentData, Timestamp } from 'firebase/firestore'

export type Firestorify<T extends DocumentData> = ModifyProp<T, Date, Timestamp>
