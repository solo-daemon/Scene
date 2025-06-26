import { useState, useEffect, useRef } from "react";

const useNotifications = (roomName: string) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null); // Store WebSocket instance
  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/notifications/${roomName}/`); // ✅ Save to ws.current
  
    ws.current.onopen = () => {
      console.log("Connected to WebSocket");
    };
  
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data.message]);
    };
  
    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };
  
    // return () => {
    //   ws.current?.close();
    // };
  }, [roomName]); // ✅ Dependency array

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ message }));
    } else {
      console.warn("WebSocket is not open");
    }
  };

  return { notifications, sendMessage };
};

export default useNotifications;