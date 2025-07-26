import { Choice } from '@magic3t/types'
import styles from './styles.module.sass'

export type ChoiceStyle =
  | 'normal'
  | 'selectable'
  | 'blueSelected'
  | 'opponentSelected'
  | 'disabled'

interface Props {
  choice: Choice
  choiceStyle?: ChoiceStyle
  onClick?: () => void
  highlight?: boolean
}

const classesMap: Record<ChoiceStyle, string> = {
  blueSelected: 'blue_selected',
  opponentSelected: 'red_selected',
  disabled: 'disabled',
  normal: '',
  selectable: 'selectable',
}

export function ChoiceComponent({
  choice,
  highlight,
  onClick,
  choiceStyle = 'normal',
}: Props) {
  return (
    <button
      type="button"
      className={`${styles.container} ${styles[classesMap[choiceStyle]]} ${highlight ? styles.highlight : ''}`}
      onClick={onClick}
      key={choice}
    >
      {choice}
    </button>
  )
}
