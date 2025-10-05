'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useRemoteParticipants, useTrackVolume } from '@livekit/components-react'
import { Track } from 'livekit-client'

interface AIAgentSphereProps {
  isActive?: boolean
  isConnecting?: boolean
  onActivate?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24', 
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
}

export function AIAgentSphere({ 
  isActive = false, 
  isConnecting,
  onActivate, 
  className,
  size = 'xl'
}: AIAgentSphereProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [scale, setScale] = useState(1)
  
  // Get agent's audio track directly
  const remoteParticipants = useRemoteParticipants()
  const agentParticipant = remoteParticipants[0]
  const agentAudioTrack = agentParticipant?.getTrackPublication(Track.Source.Microphone)?.track || null
  
  // Get volume from the agent's audio track
  const volume = useTrackVolume(agentAudioTrack)

  useEffect(() => {
    if (isActive && volume !== undefined) {
      const newScale = 1 + (volume * 0.3)
      setScale(newScale)
    } else {
      setScale(1)
    }
  }, [volume, isActive])

  const sphereClasses = cn(
    sizeClasses[size],
    "rounded-full cursor-pointer transform",
    "relative",
    className
  )

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* AI Agent Sphere */}
      <div
        className={sphereClasses}
        style={{
          transform: isActive ? `scale(${scale})` : (isHovered && !isActive ? 'scale(1.05)' : 'scale(1)'),
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={onActivate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main sphere with exact gradient */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: isActive
              ? 'radial-gradient(circle, hsla(17, 95%, 50%, 1) 9%, hsla(42, 94%, 57%, 1) 53%, hsla(0, 0%, 100%, 1) 89%)'
              : 'radial-gradient(circle, hsla(0, 0%, 85%, 1) 9%, hsla(0, 0%, 90%, 1) 53%, hsla(0, 0%, 98%, 1) 89%)',
            opacity: isActive ? 0.95 + (volume * 0.05) : (isHovered ? 0.9 : 0.85),
            transition: 'background 0.5s ease-in-out, opacity 0.3s ease-in-out',
            filter: 'blur(1px)' // Slight blur for softer edges
          }}
        />

        {(isConnecting && !isActive) &&
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className="relative flex size-8">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex size-8 blur-xs rounded-full bg-orange-400"></span>
            </span>
          </div>
        }

        {/* Edge softener - creates the dispersed edge effect */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: isActive
              ? 'radial-gradient(circle, transparent 0%, transparent 75%, hsla(42, 94%, 57%, 0.4) 85%, transparent 100%)'
              : 'radial-gradient(circle, transparent 0%, transparent 75%, hsla(0, 0%, 90%, 0.4) 85%, transparent 100%)',
            filter: 'blur(8px)',
            opacity: 0.8,
            transition: 'background 0.5s ease-in-out, opacity 0.3s ease-in-out'
          }}
        />

        {/* Outer glow layer */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: isActive
              ? 'radial-gradient(circle, hsla(17, 95%, 50%, 0.6) 0%, hsla(42, 94%, 57%, 0.4) 40%, transparent 70%)'
              : 'radial-gradient(circle, hsla(0, 0%, 85%, 0.5) 0%, hsla(0, 0%, 90%, 0.3) 40%, transparent 70%)',
            transform: `scale(${isActive ? 1.8 + (volume * 0.3) : 1.6})`,
            opacity: isActive ? 0.6 + (volume * 0.4) : (isHovered ? 0.5 : 0.4),
            filter: 'blur(40px)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out, background 0.5s ease-in-out'
          }}
        />

        {/* Soft blur overlay for depth */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: isActive
              ? 'radial-gradient(circle, transparent 0%, hsla(17, 95%, 50%, 0.3) 50%, transparent 100%)'
              : 'radial-gradient(circle, transparent 0%, hsla(0, 0%, 88%, 0.2) 50%, transparent 100%)',
            filter: 'blur(20px)',
            opacity: isActive ? 0.5 + (volume * 0.3) : 0.4,
            transition: 'opacity 0.3s ease-in-out, background 0.5s ease-in-out'
          }}
        />
      </div>

      {/* Status Text */}
      {(!isActive && !isConnecting) &&
        <div className="text-center">
          <p className={cn(
            "text-xs font-medium mt-2 transition-colors duration-300 text-orange-400"
          )}>
            Click the sphere to start conversing
          </p>
        </div>
      }
      {isConnecting &&
        <div className="text-center">
          <p className={cn(
            "text-xs font-medium mt-2 transition-colors duration-300 text-orange-400"
          )}>
            Waiting for agent to connect...
          </p>
        </div>
      }
    </div>
  )
}