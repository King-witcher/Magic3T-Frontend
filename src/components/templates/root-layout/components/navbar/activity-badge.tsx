import type { LiveActivity } from '@/contexts/live-activity.context.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
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
