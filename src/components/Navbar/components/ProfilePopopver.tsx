import {
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  PopoverContent,
  Stack,
} from '@chakra-ui/react'
import Option from './Option'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProfileMenu() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <MenuList>
      <MenuItem onClick={() => navigate('/')}>Jogar</MenuItem>
      <MenuItem isDisabled>Como jogar</MenuItem>
      <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>
      <MenuDivider color="pink.100" />
      <MenuItem onClick={signOut}>Sair</MenuItem>
    </MenuList>
  )
}
