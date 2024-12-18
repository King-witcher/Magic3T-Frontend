import { CopyButton } from '@/components/atoms/copy-button/copy-button'
import { MovesView, PlayerCard } from '@/components/templates/match/components'
import type { MatchModel } from '@/models'
import { getAcrylicProps } from '@/utils/style-helpers'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Avatar, Flex, Stack, Text, Tooltip } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'

interface Props {
  match: MatchModel
}

export function MatchBody({ match }: Props) {
  return (
    <Stack gap="20px">
      <Flex mt="10px" gap="8px" align="center" justify="right">
        <Text fontSize="14px">Id: {match._id}</Text>
        <Tooltip label="Copiar id">
          <span>
            <CopyButton value={`${match._id}`} />
          </span>
        </Tooltip>
        <Tooltip label="Abrir link da partida">
          <Link to={`/match/${match._id}`}>
            <ExternalLinkIcon cursor="pointer" />
          </Link>
        </Tooltip>
      </Flex>
      <Flex gap="20px" justify="center">
        <Stack align="center" spacing="10px">
          <PlayerCard matchPlayer={match.white} />
          <Text>vs</Text>
          <PlayerCard matchPlayer={match.black} />
        </Stack>
        <MovesView moves={match.events} />
      </Flex>
    </Stack>
  )
}
