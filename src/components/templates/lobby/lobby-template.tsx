import { ButtonsContainer } from '@/components/atoms'
import { useQueue } from '@/contexts/queue.context'
import {
  ServerStatus,
  useServiceStatus,
} from '@/contexts/service-status.context'
import { GameMode } from '@/types/queue'
import { QueueModeButton } from './queue-mode-button'

export function LobbyTemplate() {
  const { queueUserCount, queueModes } = useQueue()
  const { serverStatus } = useServiceStatus()

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col w-full max-w-[800px]">
        <h1 className="text-center !text-4xl">Play Magic3T</h1>
        <p className="text-center text-[0.8rem] xs:text-[0.9rem] text-[#ffffffc0] !mt-[10px]">
          Be the first to select three numbers that add up to exactly 15.
        </p>

        <ButtonsContainer
          opacity={serverStatus !== ServerStatus.On ? 0.5 : 1}
          mt="20px"
        >
          <QueueModeButton
            name="Easy"
            isLoading={!!queueModes['bot-0']}
            gameMode={GameMode.Bot0}
          />
          <QueueModeButton
            name="Medium"
            isLoading={!!queueModes['bot-1']}
            gameMode={GameMode.Bot1}
          />
          <QueueModeButton
            name="Hard"
            isLoading={!!queueModes['bot-2']}
            gameMode={GameMode.Bot2}
          />
          <QueueModeButton
            name="Invincible"
            isLoading={!!queueModes['bot-3']}
            gameMode={GameMode.Bot3}
          />
        </ButtonsContainer>
        <ButtonsContainer
          opacity={serverStatus !== ServerStatus.On ? 0.5 : 1}
          my="20px"
        >
          <QueueModeButton
            name="Human"
            isLoading={!!queueModes.ranked}
            playersInQueue={queueUserCount.ranked.queue}
            gameMode={GameMode.Ranked}
          />
        </ButtonsContainer>
        {serverStatus === ServerStatus.On &&
          (queueUserCount.connected > 1 ? (
            <p className="text-center text-green-400">
              {queueUserCount.connected} players online
            </p>
          ) : (
            <p className="text-center text-gray-400">
              Only you are online. <br />
              Invite your friends to play Magic3T!
            </p>
          ))}
        {serverStatus === ServerStatus.Loading && (
          <p className="text-center text-blue-400">
            The server is rebooting...
          </p>
        )}
        {serverStatus === ServerStatus.Off && (
          <p className="text-center text-red-600">The server is offline.</p>
        )}
      </div>
    </div>
  )
}
