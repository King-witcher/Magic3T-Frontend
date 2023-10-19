import {
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import LogoutModal from '@/components/modals/LogoutModal'

export default function ProfileMenu() {
  const navigate = useNavigate()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <MenuList>
      <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>
      <MenuItem onClick={() => navigate('/')}>Jogar</MenuItem>
      <MenuItem isDisabled>Como jogar</MenuItem>
      <MenuDivider color="pink.100" />
      <MenuItem onClick={onOpen}>Sair</MenuItem>
      <LogoutModal isOpen={isOpen} onClose={onClose} />
    </MenuList>
  )
}
