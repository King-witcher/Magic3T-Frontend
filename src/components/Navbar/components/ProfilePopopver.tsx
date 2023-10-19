import {
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  PopoverContent,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import Option from './Option'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import LogoutModal from '@/components/modals/LogoutModal'

export default function ProfileMenu() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <MenuList>
      <MenuItem onClick={() => navigate('/')}>Jogar</MenuItem>
      <MenuItem isDisabled>Como jogar</MenuItem>
      <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>
      <MenuDivider color="pink.100" />
      <MenuItem onClick={onOpen}>Sair</MenuItem>
      <LogoutModal isOpen={isOpen} onClose={onClose} />
    </MenuList>
  )
}
