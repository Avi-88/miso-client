'use client'

import { useEffect, useState } from 'react'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  AudioTrack,
  useParticipants,
  useTracks,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import '@livekit/components-styles'

interface VoiceRoomProps {
  token: string
  serverUrl: string
  roomName: string
  onDisconnect?: () => void
}

function VoiceRoomContent() {
  const participants = useParticipants()
  const tracks = useTracks([Track.Source.Microphone], { onlySubscribed: false })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Voice Therapy Session
        </h2>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600">
              Connected participants: {participants.length}
            </p>
          </div>

          {tracks.map((track) => (
            <div key={track.participant.identity} className="p-4 border rounded-lg">
              <p className="font-medium text-gray-700">
                {track.participant.identity}
              </p>
              {track.publication && (
                <AudioTrack trackRef={track} />
              )}
            </div>
          ))}

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Speak naturally. The AI therapist is listening and will respond.
            </p>
          </div>
        </div>
      </div>
      
      <RoomAudioRenderer />
      <StartAudio label="Click to enable audio" />
    </div>
  )
}

export default function VoiceRoom({ token, serverUrl, roomName, onDisconnect }: VoiceRoomProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={() => {
        console.log('Disconnected from room')
        onDisconnect?.()
      }}
      className="h-screen"
    >
      <VoiceRoomContent />
    </LiveKitRoom>
  )
}