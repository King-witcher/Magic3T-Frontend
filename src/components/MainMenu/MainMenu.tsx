import {
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import LogoutModal from '@/components/modals/LogoutModal'
import { useAuth } from '@/contexts/auth.context.tsx'
import SecretCodeModal from '@/components/modals/SecretCodeModal'

export default function ProfileMenu() {
  const navigate = useNavigate()
  const { user, signInGoogle: signIn } = useAuth()

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
      {user && (
        <MenuItem as={Link} to="/me">
          Perfil
        </MenuItem>
      )}
      {user && <MenuItem onClick={() => navigate('/')}>Jogar</MenuItem>}
      {user && <MenuItem onClick={openSecretCode}>Códigos secretos</MenuItem>}
      <MenuItem as={Link} to="/tutorial">
        Como jogar
      </MenuItem>
      <MenuItem as={Link} to="/rating-system">
        Sistema de Ranking
      </MenuItem>
      <MenuDivider color="blue.100" />
      {user && <MenuItem onClick={openLogout}>Sair</MenuItem>}
      {!user && <MenuItem onClick={signIn}>Entrar</MenuItem>}
      <LogoutModal isOpen={logoutModalOpen} onClose={closeLogout} />
      <SecretCodeModal isOpen={secretCodeModalOpen} onClose={closeSecretCode} />
    </MenuList>
  )
}
