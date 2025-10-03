'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'


interface AIAgentSphereProps {
  isActive?: boolean
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
  onActivate, 
  className,
  size = 'xl'
}: AIAgentSphereProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Radial gradient styles
  const activeGradient = {
    background: 'radial-gradient(circle, #f87171 0%, #fb923c 35%, #fbbf24 70%, #fde047 100%)'
  }
  
  const dormantGradient = {
    background: 'radial-gradient(circle, #d1d5db 0%, #e5e7eb 50%, #f3f4f6 100%)'
  }
  
  const hoveredDormantGradient = {
    background: 'radial-gradient(circle, #9ca3af 0%, #d1d5db 50%, #e5e7eb 100%)'
  }

  const sphereClasses = cn(
    sizeClasses[size],
    "rounded-full cursor-pointer transition-all duration-500 ease-in-out transform",
    "relative overflow-hidden shadow-lg",
    isHovered && "scale-105",
    className
  )

  const getGradientStyle = () => {
    if (isActive) return activeGradient
    if (isHovered) return hoveredDormantGradient
    return dormantGradient
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* AI Agent Sphere */}
      <div
        className={sphereClasses}
        style={getGradientStyle()}
        onClick={onActivate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Inner glow effect */}
        <div 
          className="absolute inset-2 rounded-full transition-opacity duration-500"
          style={{
            background: isActive 
              ? 'radial-gradient(circle, rgba(254, 240, 138, 0.4) 0%, rgba(251, 146, 60, 0.2) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(243, 244, 246, 0.2) 50%, transparent 100%)',
            opacity: isActive ? 1 : 0.6
          }}
        />
        
        {/* Pulsing animation when active */}
        {isActive && (
          <div 
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)'
            }}
          />
        )}
        
        {/* Highlight shine */}
        <div 
          className="absolute top-4 left-4 w-8 h-8 rounded-full transition-all duration-500"
          style={{
            background: isActive 
              ? 'radial-gradient(circle, rgba(254, 243, 199, 0.6) 0%, transparent 100%)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Status Text */}
      {!isActive &&
        <div className="text-center">
          <p className={cn(
            "text-xs font-medium transition-colors duration-300 text-orange-400"
          )}>
            Click to start conversing
          </p>
        </div>
      }


      {/* Activation Button */}
      {/* {!isActive && (
        <button
          onClick={onActivate}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          Start Session
        </button>
      )} */}
    </div>
  )
}