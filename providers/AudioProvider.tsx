'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { AudioContextType, AudioProps } from '@/types'

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const [audio, setAudio] = useState<AudioProps | undefined>()

  useEffect(() => {
    if (pathname === '/create-podcast') setAudio(undefined)
  }, [pathname])

  return (
    <AudioContext.Provider value={{ audio, setAudio }}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)

  if (!context) throw new Error('useAudio must be used within an AudioProvider')

  return context
}
