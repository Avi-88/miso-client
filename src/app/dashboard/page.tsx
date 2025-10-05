'use client'

import { useState, useEffect, useMemo } from "react"
import { Room, RoomEvent } from 'livekit-client';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { apiClient } from '@/lib/api';
import { SessionView } from "@/components/SessionView"
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout"
import { useSearchParams } from "next/navigation";


export default function Page() {
  const room = useMemo(() => new Room(), []);
  const searchParams = useSearchParams();
  const resumeSessionId = searchParams.get('resume');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    const onDisconnected = () => {
      console.log("disconnected")
      setSessionStarted(false);
      setIsConnecting(false);
      setCurrentSessionId(null);
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

  // Auto-start session if resume parameter is present
  useEffect(() => {    
    if (resumeSessionId && !sessionStarted && !isConnecting) {
      console.log('Auto-starting resume session:', resumeSessionId);
      handleSessionState();
    }
  }, [resumeSessionId, sessionStarted, isConnecting]);

  const checkMediaPermissions = async (): Promise<boolean> => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      // Start new or resume session
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

        let response;
        if (resumeSessionId) {
          // Resume existing session
          console.log('Resuming session:', resumeSessionId);
          response = await apiClient.resumeSession(resumeSessionId);
          // Clear the URL parameter after using it
          window.history.replaceState({}, document.title, '/dashboard');
        } else {
          // Create new session
          console.log('Creating new session');
          response = await apiClient.createSession();
        }

        if (response.error) {
          throw new Error(response.error);
        }
        
        if (!response.data) {
          throw new Error('No session data received');
        }
        console.log('Connection details:', response.data);

        // Store the session ID for cleanup if needed
        setCurrentSessionId(response.data.session_id);

        await room.connect(server_url, response.data.token);

        // Enable microphone and connect to room
        await room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: true,
        });
        
        setSessionStarted(true);
        setIsConnecting(false);
      } catch (error) {
        console.error('Session creation/resume failed:', error);
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
          sessionId={currentSessionId || undefined}
        />
      </RoomContext.Provider>
    </AuthenticatedLayout>
  )
}
