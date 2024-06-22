import { LazyLoadData } from '@/hooks/useLazy'
import { Center } from '@chakra-ui/react'
import { useEffect } from 'react'

interface Props<ReturnType> {
  lazyLoadData: LazyLoadData<ReturnType>
}

export function LazyLoadingPage<ReturnType>({
  lazyLoadData: [resource, loading, load],
}: Props<ReturnType>) {
  useEffect(() => {
    if (!resource && !loading) {
      load()
    }
  }, [resource, loading, load])
  return <Center>Carregando</Center>
}
