import { CopyButton } from '@/components/atoms/copy-button/copy-button'
import { MovesView } from '@/components/templates/match/components'
import type { MatchModel } from '@/models'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Flex, Stack, Text, Tooltip } from '@chakra-ui/react'
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
      <MovesView moves={match.events} />
    </Stack>
  )
}
