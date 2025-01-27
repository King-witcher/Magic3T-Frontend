import { UserAvatar } from '@/components/molecules'
import { UserDto } from '@/services/nest-api'
import { getAcrylicProps } from '@/utils/style-helpers'
import {
  Box,
  Button,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react'
import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { SummonerIcon } from './summoner-icon'

const iconIds = [..._.range(0, 30), ..._.range(3455, 3464)]

interface Props extends Omit<ModalProps, 'children'> {
  user: UserDto
  onSave: (iconId: number) => void
}

export function ChangeIconModal({ user, onSave, ...props }: Props) {
  const [selectedIcon, setSelectedIcon] = useState(user.summonerIcon)

  const handleSelectIcon = useCallback((iconId: number) => {
    setSelectedIcon(iconId)
  }, [])

  const handleSave = useCallback(() => {
    onSave(selectedIcon)
    props.onClose()
  }, [props.onClose, selectedIcon, onSave])

  const icons = useMemo(() => {
    return iconIds.map((iconId) => {
      return (
        <SummonerIcon
          key={iconId}
          id={iconId}
          onSelect={handleSelectIcon}
          selected={iconId === selectedIcon}
        />
      )
    })
  }, [handleSelectIcon, selectedIcon])

  return (
    <Modal isCentered {...props} size="xl">
      <ModalOverlay />
      <ModalContent
        maxW="100%"
        maxH="100%"
        w="1000px"
        p="20px"
        overflowX="hidden"
        overflowY="auto"
      >
        <ModalHeader
          p={{ base: '10px', md: '20px' }}
          textAlign="center"
          fontSize={{ base: '1.5rem', md: '2rem' }}
        >
          Change icon
        </ModalHeader>
        <ModalBody>
          <Flex
            align="center"
            w="full"
            direction={{ base: 'column', md: 'row' }}
          >
            <VStack spacing="40px" mr="10px">
              <UserAvatar
                icon={selectedIcon}
                size={140}
                league={user.rating.league}
                division={user.rating.division}
                m={{ base: '0', md: '70px 80px 0 70px' }}
              />
              <Text fontSize="24px">{user.nickname}</Text>
            </VStack>
            <Box
              h={{ base: '200px', md: '470px' }}
              overflowY="scroll"
              overflowX="hidden"
            >
              <Grid
                templateColumns={{
                  base: 'repeat(3, 1fr)',
                  md: 'repeat(5, 1fr)',
                  lg: 'repeat(6, 1fr)',
                }}
                justifyContent="space-between"
                gap="20px"
                flex="1"
              >
                {icons}
              </Grid>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter p="10px" gap="20px">
          <Button
            {...getAcrylicProps()}
            color="white"
            onClick={props.onClose}
            _hover={{
              bg: '#ffffff80',
            }}
            w="200px"
          >
            Cancel
          </Button>
          <Button
            {...getAcrylicProps()}
            color="white"
            onClick={handleSave}
            _hover={{
              bg: '#ffffff80',
            }}
            w="200px"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
