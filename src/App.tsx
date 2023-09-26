import { RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { router } from '@/router'
import { theme } from './theme'
import { QueueProvider } from './contexts/QueueContext'
import { ServiceStatusProvider } from './contexts/ServiceStatusContext'
import { AuthProvider } from './contexts/AuthContext'
import { GameProvider } from './contexts/GameContext'

function App() {
  return (
    <ServiceStatusProvider>
      <AuthProvider>
        <GameProvider>
          <QueueProvider>
            <ChakraProvider theme={theme}>
              <RouterProvider router={router} />
            </ChakraProvider>
          </QueueProvider>
        </GameProvider>
      </AuthProvider>
    </ServiceStatusProvider>
  )
}

export default App
