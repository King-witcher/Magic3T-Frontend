export type CVarValue = string | number | boolean

export type CVar = {
  name: string
  readonly: boolean
  description?: string
} & (
  | {
      type: 'string'
      default: string
      value: string
    }
  | {
      type: 'number'
      default: number
      value: number
      integer: boolean
      min: number
      max: number
    }
  | {
      type: 'boolean'
      default: boolean
      value: boolean
    }
)
