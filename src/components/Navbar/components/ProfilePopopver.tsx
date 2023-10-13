import { Popover, PopoverContent, Stack } from '@chakra-ui/react'
import Option from './Option'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePopover() {
  const { signOut } = useAuth()

  return (
    <PopoverContent>
      <Stack gap="5px">
        <Option icon="/images/icons/profile.svg" label="Perfil" />
        <Option
          icon="/images/icons/logout.svg"
          label="Sair"
          onClick={signOut}
        />
      </Stack>
    </PopoverContent>
  )
}
