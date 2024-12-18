import type { MatchModel, MatchSide } from '@/models/matches/Match'
import { MatchResult } from '@/types'
import { Collapse, Stack, type StackProps } from '@chakra-ui/react'
import { MatchBody } from './match-body'
import { MatchHeader } from './match-header'

interface Props extends StackProps {
  match: MatchModel
  isExpanded: boolean
  referenceSide: MatchSide
}

export function HistoryRow({
  match,
  referenceSide,
  isExpanded,
  ...rest
}: Props) {
  const result: MatchResult =
    match.winner === null
      ? MatchResult.Draw
      : referenceSide === match.winner
        ? MatchResult.Victory
        : MatchResult.Defeat

  return (
    <Stack
      gap="0"
      bgColor="#ffffff30"
      p={['10px 15px', '10px 20px']}
      transition="background 80ms linear"
      color="light"
      userSelect="none"
      _hover={
        isExpanded
          ? undefined
          : {
              bgColor: '#ffffff60',
            }
      }
      borderLeft="solid 5px"
      borderLeftColor={
        result === 'defeat'
          ? '#ff3040'
          : result === 'draw'
            ? '#c0c0c0'
            : '#40cf40'
      }
      fontSize={{
        base: '0.6875rem',
        sm: '1rem',
      }}
      lineHeight={{
        base: '0.6875rem',
        sm: '1rem',
      }}
      {...rest}
    >
      <MatchHeader match={match} referenceSide={referenceSide} />
      <Collapse in={isExpanded} unmountOnExit>
        <MatchBody match={match} />
      </Collapse>
    </Stack>
  )
}
