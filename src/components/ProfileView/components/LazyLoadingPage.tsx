import { LazyLoadData } from '@/hooks/useLazy'
import { Center } from '@chakra-ui/react'
import { useEffect } from 'react'

interface Props<ReturnType, ArgsType = unknown> {
  lazyLoadData: LazyLoadData<ReturnType>
}

export default function LazyLoadingPage<ReturnType>({
  lazyLoadData: [resource, loading, load],
}: Props<ReturnType>) {
  useEffect(() => {
    if (!resource && !loading) {
      load()
    }
  }, [resource, loading, load])
  return <Center>Carregando</Center>
}
