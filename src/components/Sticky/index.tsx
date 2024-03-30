import { Box, keyframes } from '@chakra-ui/react'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface Props {
  children: ReactNode
}

const stickyAnimation = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
  }
`

export default function Sticky({ children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [stickyHeight, setStickyHeight] = useState(0)

  useEffect(() => {
    setStickyHeight(wrapperRef.current!.clientHeight)
  }, [])

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > wrapperRef.current!.clientHeight) {
        setIsSticky(true)
      } else if (window.scrollY === 0) {
        setIsSticky(false)
      }
    }

    setStickyHeight(wrapperRef.current!.clientHeight)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isSticky])

  return (
    <>
      <Box
        zIndex={1}
        ref={wrapperRef}
        w="100%"
        transition="box-shadow 1s linear"
        sx={
          isSticky
            ? {
                position: 'fixed',
                animation: `${stickyAnimation} 200ms ease-out`,
                transition: 'box-shadow none',
                boxShadow: '0 0 10px 5px #00000040',
              }
            : {}
        }
      >
        {children}
      </Box>
      {isSticky && (
        <Box
          h="{`${stickyHeight}px`}"
          flex={`0 0 ${stickyHeight}px`}
          w="100%"
        ></Box>
      )}
    </>
  )
}
