import { LazyLoadData } from '@/hooks/useLazy'
import { Center } from '@chakra-ui/react'
import { useEffect } from 'react'

interface Props<ReturnType, ArgsType = unknown> {
  lazyLoadData: LazyLoadData<ReturnType, ArgsType>
}

export default function LazyLoadingPage<ReturnType, ArgsType = unknown>({
  lazyLoadData: [resource, loading, load],
}: Props<ReturnType, ArgsType>) {
  useEffect(() => {
    if (!resource && !loading) {
      load()
    }
  }, [resource, loading, load])
  return <Center>Loading</Center>
}
