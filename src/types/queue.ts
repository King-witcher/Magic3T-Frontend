export enum QueueMode {
  Bot0 = 'bot-0',
  Bot1 = 'bot-1',
  Bot2 = 'bot-2',
  Bot3 = 'bot-3',
  Casual = 'casual',
  Ranked = 'ranked',
}

export type QueueModesType = {
  'bot-0'?: boolean
  'bot-1'?: boolean
  'bot-2'?: boolean
  'bot-3'?: boolean
  casual?: boolean
  ranked?: boolean
}

export interface QueueUserCount {
  casual: {
    inGame: number
    queue: number
  }
  connected: number
  ranked: {
    inGame: number
    queue: number
  }
}
