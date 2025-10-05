'use client';

import React, { useEffect, useState } from 'react';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { AIAgentSphere } from './ai-agent-sphere';
import { IconX , IconPhoneOff} from "@tabler/icons-react"


function isAgentAvailable(agentState: AgentState) {
  return agentState == 'listening' || agentState == 'thinking' || agentState == 'speaking';
}

interface SessionViewProps {
  sessionStarted: boolean;
  isConnecting?: boolean;
  handleSessionState: () => void;
}

export const SessionView = ({
  sessionStarted,
  isConnecting = false,
  handleSessionState,
}: React.ComponentProps<'div'> & SessionViewProps) => {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const { state: agentState } = useVoiceAssistant();
  const room = useRoomContext();


  useEffect(() => {
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        if (!isAgentAvailable(agentState)) {
          const reason =
            agentState === 'connecting'
              ? 'Agent did not join the room. '
              : 'Agent connected but did not complete initializing. ';

          window.alert("Agent timeout");
          console.log("this maybe",reason)
          room.disconnect();
        }
      }, 20_000);

      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);

  return (
      <div className="flex flex-col justify-center h-full items-center">
            {!sessionStarted &&             
              <div className="text-center py-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Hey {user?.username || 'there'}!</h1>
                <p className="text-sm text-gray-600 max-w-2xl">
                  meet <span className="text-orange-400">Miso</span> , your compassionate AI-powered companion
                </p>
              </div>
            }

            <div className="relative  flex-col justify-center items-center flex flex-1 z-10 mx-auto w-full max-w-2xl">
                <AIAgentSphere 
                    isActive={sessionStarted && isAgentAvailable(agentState)}
                    onActivate={isConnecting ? undefined : handleSessionState}
                    isConnecting={isConnecting}
                    size="xl"
                />
                
                {isConnecting && (
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      <span className="text-sm text-gray-600">Connecting...</span>
                    </div>
                  </div>
                )}
                {sessionStarted && (
                <button
                    onClick={() => handleSessionState()}
                    className="p-4 absolute bottom-[10%]  rounded-full bg-red-500/90 hover:bg-orange-700 text-white transition-colors flex items-center justify-center"
                >
                    <IconPhoneOff height={20} className="mr-2" width={20} />
                    end call
                </button>
                )}
            </div>
            {!sessionStarted && 
                <div className="grid md:grid-cols-3 py-4 gap-6 max-w-4xl">
                    <div className="text-center p-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Voice-First</h3>
                    <p className="text-gray-600 text-xs">Natural voice conversations with AI that understands and responds with empathy</p>
                    </div>
    
                    <div className="text-center p-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Compassionate</h3>
                    <p className="text-gray-600 text-xs">Designed with empathy and understanding to provide a safe space for emotional support</p>
                    </div>
    
                    <div className="text-center p-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Private & Secure</h3>
                    <p className="text-gray-600 text-xs">Your conversations are private and secure, with full control over your data</p>
                    </div>
                </div>
                }
      </div>
  );
};