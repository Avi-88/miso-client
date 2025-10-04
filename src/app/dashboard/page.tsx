'use client'

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { Room, RoomEvent } from 'livekit-client';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { apiClient } from '@/lib/api';
import { SessionView } from "@/components/SessionView"


export default function Page( ) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const [open, setOpen] = useState(false)

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


  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/auth/signin')
      return
    }
    
    setIsAuthenticated(true)
    setUser(JSON.parse(userData))
  }, [router])

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
        setOpen(false);
        
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      open={open} 
      onOpenChange={setOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset >
        <div className="flex flex-1 flex-col relative">
          <SidebarTrigger onClick={()=>setOpen(!open)} className="bg-gray-100 p-4 mt-2 ml-2" />
          <div className="@container/main flex flex-1 justify-center items-center flex-col gap-8 p-8">
          <RoomContext.Provider value={room}>
            <RoomAudioRenderer/>
            <StartAudio label="Start Audio" />
            <SessionView 
              user={user} 
              sessionStarted={sessionStarted} 
              isConnecting={isConnecting}
              handleSessionState={handleSessionState} 
            />
          </RoomContext.Provider>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
