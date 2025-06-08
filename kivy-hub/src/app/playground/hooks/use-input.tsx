import { useEffect, useState } from 'react';
import { CURRENT_MODE, ModeEnum } from '../lib/constants.ts';

export default function () {
  const [handData, setHandData] = useState([]);

  useEffect(() => {
    if (CURRENT_MODE === ModeEnum.MOUSE) {

    } else {
      const socket = new WebSocket('ws://127.0.0.1:8000/ws');

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setHandData(data.hands);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
        socket.close();
      };
    }
  }, []);
}
