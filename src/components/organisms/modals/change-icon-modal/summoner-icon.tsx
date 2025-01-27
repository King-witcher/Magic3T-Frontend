import { getIconUrl } from '@/utils/utils'
import { Image } from '@chakra-ui/react'
import { memo, useCallback } from 'react'

interface Props {
  id: number
  selected: boolean
  onSelect: (id: number) => void
}

export const SummonerIcon = memo(({ id, selected, onSelect }: Props) => {
  const handleSelect = useCallback(() => {
    onSelect(id)
  }, [id, onSelect])

  return (
    <Image
      w="full"
      src={getIconUrl(id)}
      cursor="pointer"
      transition="all 200ms"
      aspectRatio={1}
      onClick={handleSelect}
      border={selected ? '2px solid #ffffff' : '1px solid #ffffff40'}
      boxShadow={selected ? '0 0 5px 0 #ffffff80' : '0 0 10px 0 #00000040'}
      _hover={{
        filter: 'saturate(1.5) brightness(1.1)',
        borderColor: '#ffffff',
      }}
    />
  )
})
