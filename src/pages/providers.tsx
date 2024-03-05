import { AuthProvider } from '@/contexts/AuthContext'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { LiveActivityProvider } from '@/contexts/LiveActivityContext'
import { ServiceStatusProvider } from '@/contexts/ServiceStatusContext'
import { chakraTheme } from '@/styles/chakraTheme'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <LiveActivityProvider>
      <ServiceStatusProvider>
        <ConfigProvider>
          <AuthProvider>
            <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>
          </AuthProvider>
        </ConfigProvider>
      </ServiceStatusProvider>
    </LiveActivityProvider>
  )
}
