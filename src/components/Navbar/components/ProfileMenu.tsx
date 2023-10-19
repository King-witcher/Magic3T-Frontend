import {
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import LogoutModal from '@/components/modals/LogoutModal'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfileMenu() {
  const navigate = useNavigate()
  const { user, signIn } = useAuth()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <MenuList>
      {user && <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>}
      {user && <MenuItem onClick={() => navigate('/')}>Jogar</MenuItem>}
      <MenuItem isDisabled>Como jogar</MenuItem>
      <MenuDivider color="pink.100" />
      {user && <MenuItem onClick={onOpen}>Sair</MenuItem>}
      {!user && <MenuItem onClick={signIn}>Entrar</MenuItem>}
      <LogoutModal isOpen={isOpen} onClose={onClose} />
    </MenuList>
  )
}
