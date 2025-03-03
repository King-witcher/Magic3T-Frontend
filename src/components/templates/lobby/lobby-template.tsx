import { ButtonsContainer } from '@/components/atoms'
import { useQueue } from '@/contexts/queue.context'
import {
  ServerStatus,
  useServiceStatus,
} from '@/contexts/service-status.context'
import { QueueMode } from '@/types/queue'
import { QueueModeButton } from './queue-mode-button'

export function LobbyTemplate() {
  const { queueUserCount, queueModes } = useQueue()
  const { serverStatus } = useServiceStatus()

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col w-full max-w-[800px]">
        <h1 className="text-center !text-5xl font-serif text-gold-4 !font-bold">
          <span className="text-2xl xs:text-5xl">PLAY</span>{' '}
          <br className="xs:hidden" />
          <span>MAGIC3T</span>
        </h1>
        <p className="text-center text-[0.8rem] xs:text-[0.9rem] text-grey-1 !mt-[10px]">
          Be the first to select three numbers that add up to exactly 15.
        </p>

        <ButtonsContainer
          className="mt-[20px]"
          disabled={serverStatus !== ServerStatus.On}
        >
          <QueueModeButton
            name="Easy"
            isLoading={!!queueModes['bot-0']}
            gameMode={QueueMode.Bot0}
          />
          <QueueModeButton
            name="Medium"
            isLoading={!!queueModes['bot-1']}
            gameMode={QueueMode.Bot1}
          />
          <QueueModeButton
            name="Hard"
            isLoading={!!queueModes['bot-2']}
            gameMode={QueueMode.Bot2}
          />
          <QueueModeButton
            name="Invincible"
            isLoading={!!queueModes['bot-3']}
            gameMode={QueueMode.Bot3}
          />
        </ButtonsContainer>
        <ButtonsContainer
          className="my-[20px]"
          disabled={serverStatus !== ServerStatus.On}
        >
          <QueueModeButton
            name="Human"
            isLoading={!!queueModes.ranked}
            playersInQueue={queueUserCount.ranked.queue}
            gameMode={QueueMode.Ranked}
          />
        </ButtonsContainer>
        {serverStatus === ServerStatus.On &&
          (queueUserCount.connected > 1 ? (
            <p className="text-center text-green-400">
              {queueUserCount.connected} players online
            </p>
          ) : (
            <p className="text-center text-grey-1">
              Only you are online. Invite a friends to play Magic3T!
            </p>
          ))}
        {serverStatus === ServerStatus.Loading && (
          <p className="text-center text-grey1">The server is rebooting...</p>
        )}
        {serverStatus === ServerStatus.Off && (
          <p className="text-center text-red-600">The server is offline.</p>
        )}
      </div>
    </div>
  )
}
