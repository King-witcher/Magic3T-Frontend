import { LiveActivity } from '@/contexts/LiveActivityContext'
import {
  Flex,
  Tooltip,
  Text,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

interface Props {
  liveActivity: LiveActivity
}

export default function ActivityBadge({ liveActivity }: Props) {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

  return (
    <Popover>
      <PopoverTrigger>
        <Link to={liveActivity?.url || ''} onClick={onToggle}>
          <Tooltip hideBelow="md" label={liveActivity.tooltip}>
            <Flex
              as="button"
              gap="5px"
              alignItems="center"
              bg="whiteAlpha.300"
              p="5px 5px"
              borderRadius="10px"
              userSelect="none"
              cursor="pointer"
              _hover={{
                bg: 'whiteAlpha.400',
              }}
            >
              <Text color="white" fontSize="12px">
                {liveActivity.content}
              </Text>
            </Flex>
          </Tooltip>
        </Link>
      </PopoverTrigger>
      {liveActivity.tooltip && (
        <PopoverContent hideFrom="sm" w="fit-content">
          {liveActivity.tooltip}
        </PopoverContent>
      )}
    </Popover>
  )
}
