'use client'

import { useState, useEffect, useMemo } from "react"
import { Room, RoomEvent } from 'livekit-client';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { apiClient } from '@/lib/api';
import { SessionView } from "@/components/SessionView"
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout"


export default function Page() {
  const room = useMemo(() => new Room(), []);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const onDisconnected = () => {
      console.log("disconnected")
      setSessionStarted(false);
      setIsConnecting(false);
    };
    const onMediaDevicesError = (error: Error) => {
      console.log("media error", error.message);
    };
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room]);

  const checkMediaPermissions = async (): Promise<boolean> => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately as we only needed it for permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Media permission error:', error);
      window.alert('Microphone access is required for voice sessions. Please allow microphone access to continue.');
      return false;
    }
  };

  const handleSessionState = async () => {
    if (sessionStarted && room.state === 'connected') {
      // Disconnect session
      room.disconnect();
      setSessionStarted(false);
      setIsConnecting(false);
    } else {
      // Start new session
      try {
        setIsConnecting(true);
        
        // Check media permissions first
        const hasPermissions = await checkMediaPermissions();
        if (!hasPermissions) {
          setIsConnecting(false);
          return;
        }
        
        const server_url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
        if (!server_url) {
          throw new Error("Server URL not found");
        }

        // Create session and get token
        const response = await apiClient.createSession();
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (!response.data) {
          throw new Error('No session data received');
        }
        console.log('Connection details:', response.data);

        await room.connect(server_url, response.data.token);

        // Enable microphone and connect to room
        await room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: true,
        });
        
        setSessionStarted(true);
        setIsConnecting(false);
      } catch (error) {
        console.error('Session creation failed:', error);
        window.alert('Failed to start session');
        setIsConnecting(false);
      }
    }
  }

  return (
    <AuthenticatedLayout>
      <RoomContext.Provider value={room}>
        <RoomAudioRenderer/>
        <StartAudio label="Start Audio" />
        <SessionView 
          sessionStarted={sessionStarted} 
          isConnecting={isConnecting}
          handleSessionState={handleSessionState} 
        />
      </RoomContext.Provider>
    </AuthenticatedLayout>
  )
}
