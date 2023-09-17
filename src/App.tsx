import { RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { router } from '@/router'
import { theme } from './theme'
import { QueueProvider } from './contexts/QueueContext'

function App() {
  return (
    <QueueProvider>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueueProvider>
  )
}

export default App
