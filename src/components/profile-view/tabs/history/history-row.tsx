import type { MatchModel, MatchSide } from '@/models/matches/Match'
import { MatchResult } from '@/types'
import { Collapse, Stack, type StackProps } from '@chakra-ui/react'
import MatchBody from './match-body'
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
      bg="gray.100"
      p={['10px 15px', '10px 20px']}
      transition="background 80ms linear"
      color="#000000c0"
      userSelect="none"
      _hover={{
        bgColor: 'gray.200',
        borderColor:
          result === 'defeat'
            ? 'red.300'
            : result === 'draw'
              ? 'gray.300'
              : 'green.300',
      }}
      borderLeft="solid 10px"
      borderLeftColor={
        result === 'defeat'
          ? 'red.400'
          : result === 'draw'
            ? 'gray.400'
            : 'green.400'
      }
      fontSize={{
        base: '11px',
        sm: '16px',
      }}
      lineHeight={{
        base: '11px',
        sm: '16px',
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
