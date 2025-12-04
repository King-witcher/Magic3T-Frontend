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

export enum SystemCvars {
  ClStatusPoll = 'cl_statuspoll',
  ConStyle = 'con_style',
  SvApiUrl = 'sv_apiurl',
  Ui3TMode = 'ui_3tmode',
  UiPugMode = 'ui_pugmode',
}

export enum ConStyle {
  Default = 0,
  Q3 = 1,
}

export const INITIAL_CVARS: CVar[] = [
  {
    name: SystemCvars.ClStatusPoll,
    type: 'number',
    default: 5000,
    value: 5000,
    readonly: false,
    description: 'Interval for status polling',
    min: 50,
    max: Number.POSITIVE_INFINITY,
    integer: true,
  },
  {
    name: SystemCvars.ConStyle,
    type: 'number',
    default: ConStyle.Default,
    value: ConStyle.Default,
    min: ConStyle.Default,
    max: ConStyle.Q3,
    integer: true,
    readonly: false,
    description: 'Console style',
  },
  {
    name: SystemCvars.SvApiUrl,
    type: 'string',
    default: import.meta.env.VITE_API_URL,
    value: import.meta.env.VITE_API_URL,
    readonly: false,
    description: 'URL of the backend API',
  },
  {
    name: SystemCvars.Ui3TMode,
    type: 'boolean',
    value: false,
    default: false,
    readonly: false,
    description: 'Enable 3T mode cheat in the UI',
  },
  {
    name: SystemCvars.UiPugMode,
    type: 'boolean',
    value: false,
    default: false,
    readonly: false,
    description: 'Enable PUG mode in the UI',
  },
]
