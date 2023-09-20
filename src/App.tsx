import { RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { router } from '@/router'
import { theme } from './theme'
import { QueueProvider } from './contexts/QueueContext'
import { ServiceStatusProvider } from './contexts/ServiceStatusContext'

function App() {
  return (
    <ServiceStatusProvider>
      <QueueProvider>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </QueueProvider>
    </ServiceStatusProvider>
  )
}

export default App
