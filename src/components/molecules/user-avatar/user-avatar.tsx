import { leaguesMap } from '@/utils/ranks'
import { getIconUrl } from '@/utils/utils'
import { ComponentProps } from 'react'
import { RiEdit2Fill } from 'react-icons/ri'
import { twMerge } from 'tailwind-merge'
import styles from './styles.module.sass'
import { Division, League } from '@magic3t/types'

interface Props extends ComponentProps<'div'> {
  icon: number
  league: League
  division?: Division | null
  type?: 'wing' | 'plate'
  showPencil?: boolean
  className?: string
  /** Uses the space of the full plate container instead of only the central picture. */
  fullPlate?: boolean
}

const numbers = ['', 'I', 'II', 'III', 'IV', 'V']

export function UserAvatar({
  icon,
  league,
  division,
  showPencil,
  type = 'plate',
  className,
  fullPlate,
  ...rest
}: Props) {
  const leagueInfo = leaguesMap[league]

  return (
    <div
      className={twMerge(
        `${styles.container} ${fullPlate ? styles.full_container : ''} relative center size-[1em] text-[30px]`,
        className
      )}
      {...rest}
    >
      <img
        alt="icon"
        className={`${styles.icon} ${league === League.Provisional ? styles.provisional : ''}`}
        src={getIconUrl(icon)}
      />
      {league !== League.Provisional && (
        <img
          alt="wing"
          className={styles.wing}
          src={type === 'plate' ? leagueInfo.plate : leagueInfo.wing}
        />
      )}
      {division && type === 'wing' && (
        <p className="absolute !text-[0.16em] !font-serif top-[-0.95em]">
          {numbers[division]}
        </p>
      )}
      {showPencil && (
        <div className={styles.edit_button}>
          <RiEdit2Fill size="0.15em" />
        </div>
      )}
    </div>
  )
}
