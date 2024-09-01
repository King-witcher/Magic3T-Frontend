import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { type IconProps, useClipboard } from '@chakra-ui/react'

interface Props extends IconProps {
  value: string
}

export function CopyButton({ value, ...rest }: Props) {
  const { onCopy, hasCopied } = useClipboard(value, 1000)

  if (hasCopied) return <CheckIcon {...rest} />
  return <CopyIcon cursor="pointer" {...rest} onClick={onCopy} />
}
