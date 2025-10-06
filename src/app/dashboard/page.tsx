'use client'

import { useState, useEffect, useMemo, Suspense } from "react"
import { Room, RoomEvent } from 'livekit-client';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { apiClient } from '@/lib/api';
import { SessionView } from "@/components/SessionView"
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout"
import { useSearchParams } from "next/navigation";
import { toast } from 'sonner';


const Dashboard = () => {
  const room = useMemo(() => new Room(), []);
  const searchParams = useSearchParams();
  const resumeSessionId = searchParams.get('resume');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
      setIsConnecting(false);
      setCurrentSessionId(null);
    };
    const onMediaDevicesError = (error: Error) => {
      toast.error(`Media device error: ${error.message}`);
    };
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room]);

  useEffect(() => {    
    if (resumeSessionId && !sessionStarted && !isConnecting) {
      handleSessionState();
    }
  }, [resumeSessionId, sessionStarted, isConnecting]);

  const checkMediaPermissions = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Media permission error:', error);
      toast.error('Microphone access is required for voice sessions. Please allow microphone access to continue.');
      return false;
    }
  };

  const handleSessionState = async () => {
    if (sessionStarted && room.state === 'connected') {
      room.disconnect();
      setSessionStarted(false);
      setIsConnecting(false);
    } else {
      try {
        setIsConnecting(true);
        
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
          response = await apiClient.resumeSession(resumeSessionId);
          window.history.replaceState({}, document.title, '/dashboard');
        } else {
          response = await apiClient.createSession();
        }

        if (response.error) {
          throw new Error(response.error);
        }
        
        if (!response.data) {
          throw new Error('No session data received');
        }

        setCurrentSessionId(response.data.session_id);

        await room.connect(server_url, response.data.token);

        await room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: true,
        });
        
        setSessionStarted(true);
        setIsConnecting(false);
      } catch (error) {
        toast.error('Failed to start session');
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

export default function Page() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  )
}
