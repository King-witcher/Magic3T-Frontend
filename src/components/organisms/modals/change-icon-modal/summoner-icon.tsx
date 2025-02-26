import { getIconUrl } from '@/utils/utils'
import { memo, useCallback } from 'react'
import styles from './styles.module.sass'

interface Props {
  id: number
  selected: boolean
  onSelect: (id: number) => void
}

export const SummonerIcon = memo(({ id, selected, onSelect }: Props) => {
  const handleSelect = useCallback(() => {
    onSelect(id)
  }, [id, onSelect])

  return (
    <img
      className={`${styles.icon} ${selected ? styles.selected : ''}`}
      alt="icon"
      src={getIconUrl(id)}
      onClick={handleSelect}
    />
  )
})
