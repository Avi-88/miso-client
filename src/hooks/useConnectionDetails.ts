import { useCallback, useState } from 'react';
import { decodeJwt } from 'jose';
import { ConnectionDetails } from '@/lib/types';
import { apiClient } from '@/lib/api';

const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;

export default function useConnectionDetails() {
  // Generate room connection details, including:
  //   - The Room name
  //   - An Access Token to permit the user to join the room
  //   - The Session id
  //
  // In real-world application, you would likely allow the user to specify their
  // own participant name, and possibly to choose from existing rooms to join.

  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);

  const fetchConnectionDetails = useCallback(async () => {
    setConnectionDetails(null);
    
    try {
      const response = await apiClient.createSession();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response.data) {
        throw new Error('No session data received');
      }

      // Map the Session response to ConnectionDetails format
      const connectionDetails: ConnectionDetails = {
        room_name: response.data.room_name,
        token: response.data.token,
        session_id: response.data.session_id
      };

      setConnectionDetails(connectionDetails);
      return connectionDetails;
    } catch (error) {
      console.error('Error fetching connection details:', error);
      throw new Error(error instanceof Error ? error.message : 'Error fetching connection details!');
    }
  }, []);


  const isConnectionDetailsExpired = useCallback(() => {
    const token = connectionDetails?.token;
    if (!token) {
      return true;
    }

    const jwtPayload = decodeJwt(token);
    if (!jwtPayload.exp) {
      return true;
    }
    const expiresAt = new Date(jwtPayload.exp * 1000 - ONE_MINUTE_IN_MILLISECONDS);

    const now = new Date();
    return expiresAt <= now;
  }, [connectionDetails?.token]);

  const existingOrRefreshConnectionDetails = useCallback(async () => {
    if (isConnectionDetailsExpired() || !connectionDetails) {
      return fetchConnectionDetails();
    } else {
      return connectionDetails;
    }
  }, [connectionDetails, fetchConnectionDetails, isConnectionDetailsExpired]);

  return {
    connectionDetails,
    refreshConnectionDetails: fetchConnectionDetails,
    existingOrRefreshConnectionDetails,
  };
}