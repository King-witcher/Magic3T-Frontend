import { LiveActivity } from '@/contexts/live-activity.context.tsx'
import {
  Tooltip,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { BadgeContainer } from './badge-container'

interface Props {
  liveActivity: LiveActivity
}

export function ActivityBadge({ liveActivity }: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <Link to={liveActivity?.url || ''}>
          <Tooltip hideBelow="md" label={liveActivity.tooltip}>
            <BadgeContainer>
              <Text color="white" fontSize="12px">
                {liveActivity.content}
              </Text>
            </BadgeContainer>
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
