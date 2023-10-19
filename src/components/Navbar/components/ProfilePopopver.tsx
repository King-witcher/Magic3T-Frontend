import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuList,
  PopoverContent,
  Stack,
} from '@chakra-ui/react'
import Option from './Option'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProfilePopover() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <MenuList>
      <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>
      <MenuItem onClick={signOut}>Sair</MenuItem>
    </MenuList>
  )
}
