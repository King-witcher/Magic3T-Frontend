import { PopoverContent, Stack } from '@chakra-ui/react'
import Option from './Option'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProfilePopover() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <PopoverContent>
      <Stack gap="5px">
        <Option
          icon="/images/icons/profile.svg"
          label="Perfil"
          onClick={() => navigate('/profile')}
        />
        <Option
          icon="/images/icons/logout.svg"
          label="Sair"
          onClick={signOut}
        />
      </Stack>
    </PopoverContent>
  )
}
