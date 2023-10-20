import {
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import LogoutModal from '@/components/modals/LogoutModal'
import { useAuth } from '@/contexts/AuthContext'
import SecretCodeModal from '@/components/modals/SecretCodeModal'

export default function ProfileMenu() {
  const navigate = useNavigate()
  const { user, signIn } = useAuth()

  const {
    isOpen: logoutModalOpen,
    onOpen: openLogout,
    onClose: closeLogout,
  } = useDisclosure()
  const {
    isOpen: secretCodeModalOpen,
    onOpen: openSecretCode,
    onClose: closeSecretCode,
  } = useDisclosure()

  return (
    <MenuList>
      {user && <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>}
      {user && <MenuItem onClick={() => navigate('/')}>Jogar</MenuItem>}
      <MenuItem onClick={() => navigate('/tutorial')}>Como jogar</MenuItem>
      {user && <MenuItem onClick={openSecretCode}>Códigos secretos</MenuItem>}
      <MenuDivider color="pink.100" />
      {user && <MenuItem onClick={openLogout}>Sair</MenuItem>}
      {!user && <MenuItem onClick={signIn}>Entrar</MenuItem>}
      <LogoutModal isOpen={logoutModalOpen} onClose={closeLogout} />
      <SecretCodeModal isOpen={secretCodeModalOpen} onClose={closeSecretCode} />
    </MenuList>
  )
}
