import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (url?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(url || window.location.origin);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url]);

  return socketRef.current;
};
