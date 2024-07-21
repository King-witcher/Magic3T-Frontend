import type { ModifyProp } from '@/types/modifyProp.ts'
import type { DocumentData, Timestamp } from 'firebase/firestore'

export type Firestorify<T extends DocumentData> = ModifyProp<T, Date, Timestamp>
