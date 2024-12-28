import { UserAvatar } from '@/components/molecules'
import { useRatingInfo } from '@/hooks/use-rating-info'
import { UserData } from '@/models/users/user'
import { UserDto } from '@/types/dtos/user'
import { getAcrylicProps } from '@/utils/style-helpers'
import { getIconUrl } from '@/utils/utils'
import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
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
import { useState } from 'react'

const iconIds = [..._.range(0, 30), ..._.range(3455, 3464)]

interface Props extends Omit<ModalProps, 'children'> {
  user: UserData
  onSave: (iconId: number) => void
}

export function ChangeIconModal({ user, onSave, ...props }: Props) {
  const { getRankInfo } = useRatingInfo()
  const rinfo = getRankInfo(UserDto.fromModel(user).rating)

  const [selectedIcon, setSelectedIcon] = useState(user.summoner_icon)

  function handleSelectIcon(iconId: number) {
    setSelectedIcon(iconId)
  }

  function handleSave() {
    onSave(selectedIcon)
    props.onClose()
  }

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
                tier={rinfo.tier}
                division={rinfo.division}
                m={{ base: '0', md: '70px 80px 0 70px' }}
              />
              <Text fontSize="24px">{user.identification?.nickname}</Text>
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
                {iconIds.map((iconId) => {
                  return (
                    <Image
                      key={iconId}
                      w="full"
                      src={getIconUrl(iconId)}
                      cursor="pointer"
                      transition="all 200ms"
                      onClick={() => handleSelectIcon(iconId)}
                      border={
                        iconId === selectedIcon
                          ? '2px solid #ffffff'
                          : '1px solid #ffffff40'
                      }
                      boxShadow={
                        iconId === selectedIcon
                          ? '0 0 5px 0 #ffffff80'
                          : '0 0 10px 0 #00000040'
                      }
                      _hover={{
                        filter: 'saturate(1.5) brightness(1.1)',
                        borderColor: '#ffffff',
                      }}
                    />
                  )
                })}
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
