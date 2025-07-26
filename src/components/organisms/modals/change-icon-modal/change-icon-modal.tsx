import { Spinner } from '@/components/atoms'
import { UserAvatar } from '@/components/molecules'
import { useAuth } from '@/contexts/auth.context'
import { useModalStore } from '@/contexts/modal.store'
import { NestApi } from '@/services/nest-api'
import styles from '@/styles/components/button.module.sass'
import { Profile } from '@magic3t/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { SummonerIcon } from './summoner-icon'

interface Props {
  user: Profile
  onSave: (iconId: number) => void
}

export function ChangeIconModal({ user, onSave }: Props) {
  const [selectedIcon, setSelectedIcon] = useState(user.summonerIcon)
  const auth = useAuth()
  const closeModal = useModalStore((state) => state.closeModal)

  const client = useQueryClient()

  const iconsQuery = useQuery({
    queryKey: ['available-icons', user.id],
    enabled: true,
    async queryFn() {
      const token = await auth.getToken()
      const icons = await NestApi.User.getIcons(token)
      return icons
    },
  })

  const updateIconMutation = useMutation({
    mutationKey: ['update-icon', selectedIcon],
    async mutationFn() {
      const token = await auth.getToken()
      await NestApi.User.updateIcon(token, selectedIcon)
    },
    onSuccess() {
      client.setQueryData(
        ['myself', user.id],
        (previous: Profile): Profile => ({
          ...previous,
          summonerIcon: selectedIcon,
        })
      )
      closeModal()
    },
  })

  const icons = useMemo(() => {
    return iconsQuery.data?.map((iconId) => {
      return (
        <SummonerIcon
          key={iconId}
          id={iconId}
          onSelect={setSelectedIcon}
          selected={iconId === selectedIcon}
        />
      )
    })
  }, [selectedIcon, iconsQuery.data])

  return (
    <div className="h-[calc(100dvh-42px)] w-[600px] md:h-[800px] md:w-[1000px] flex flex-col max-w-full p-[20px] gap-[10px]">
      <h2 className="!text-4xl font-serif text-center !my-4 text-gold-3">
        CHANGE ICON
      </h2>
      <div className="w-full h-full flex flex-col md:flex-row gap-[10px] items-center">
        <div className="flex flex-col gap-[5px] items-center pt-[25px]">
          <UserAvatar
            icon={selectedIcon}
            className="text-[120px]"
            league={user.rating.league}
            fullPlate
            division={user.rating.division}
          />
          <h3 className="!text-2xl font-serif">{user.nickname}</h3>
        </div>
        <div
          className={`w-full relative flex-1 self-stretch transition-opacity duration-200 ${updateIconMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="absolute inset-0 overflow-x-hidden overflow-y-scroll">
            {iconsQuery.isLoading && (
              <div className="center h-full">
                <Spinner className="size-[60px]" />
              </div>
            )}
            <div className="grid grid-cols-4 xs:grid-cols-5 md:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-[10px]">
              {icons}
            </div>
          </div>
        </div>
      </div>
      <footer className="flex justify-end gap-[10px]">
        <button
          type="button"
          className={`${styles.secondary} flex-1 md:flex-[0_0_200px]`}
          onClick={closeModal}
          disabled={updateIconMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`${styles.primary} relative flex-1 md:flex-[0_0_200px]`}
          onClick={() => updateIconMutation.mutate()}
          disabled={updateIconMutation.isPending}
        >
          {updateIconMutation.isPending && (
            <div className="absolute size-[1.4em] top-1/2 left-[20px] translate-y-[-50%]">
              <Spinner />
            </div>
          )}
          Save
        </button>
      </footer>
    </div>
  )
}
