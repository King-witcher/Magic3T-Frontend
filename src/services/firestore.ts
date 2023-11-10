import {
  getDoc as firestoreGetDoc,
  getDocs as firestoreGetDocs,
  getFirestore,
} from 'firebase/firestore/lite'
import './firebase'
import { DocumentData } from 'firebase/firestore'

export const firestore = getFirestore()

const PERIOD = 1000
const MAX_READS = 50
const MAX_QUERIES = 5

let BLOCK_TIME = 5000

let readCount = 0
let queryCount = 0
let blocked = false

setInterval(() => {
  if (readCount > MAX_READS || queryCount > MAX_QUERIES) {
    BLOCK_TIME *= 2
    console.log(
      `${readCount} document reads and ${queryCount} queries were detected within ${
        PERIOD / 1000
      } seconds.`,
    )
    console.error(
      `Firestore access blocked for ${BLOCK_TIME}ms due to excessive requests.`,
    )
    blocked = true
    setTimeout(() => {
      blocked = false
    }, BLOCK_TIME)
  }
  readCount = 0
  queryCount = 0
}, PERIOD)

setInterval(() => {
  if (readCount > MAX_READS || queryCount > MAX_QUERIES) {
    BLOCK_TIME *= 2
    console.log(
      `${readCount} document reads and ${queryCount} queries were detected within ${
        PERIOD / 1000
      } seconds.`,
    )
    console.error(
      `Firestore access blocked for ${BLOCK_TIME}ms due to excessive requests.`,
    )
    blocked = true
    setTimeout(() => {
      blocked = false
    }, BLOCK_TIME)
  }
  readCount = 0
  queryCount = 0
}, PERIOD)

export async function getDoc<AppModelType, DbModelType extends DocumentData>(
  ...params: Parameters<typeof firestoreGetDoc<AppModelType, DbModelType>>
): ReturnType<typeof firestoreGetDoc<AppModelType, DbModelType>> {
  if (blocked) throw new Error('Firestore access blocked.')
  readCount++
  queryCount++
  return firestoreGetDoc<AppModelType, DbModelType>(...params)
}

export async function getDocs<AppModelType, DbModelType extends DocumentData>(
  ...params: Parameters<typeof firestoreGetDocs<AppModelType, DbModelType>>
): ReturnType<typeof firestoreGetDocs<AppModelType, DbModelType>> {
  if (blocked) throw new Error('Firestore access blocked.')
  const result = await firestoreGetDocs<AppModelType, DbModelType>(...params)
  readCount += result.size
  queryCount++
  return result
}
