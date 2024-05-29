import { AuthProvider } from '@/contexts/auth.context.tsx'
import { ConfigProvider } from '@/contexts/config.context.tsx'
import { LiveActivityProvider } from '@/contexts/live-activity.context.tsx'
import { ServiceStatusProvider } from '@/contexts/service-status.context.tsx'
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
