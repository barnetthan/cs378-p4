import { useState, useEffect } from "react";

// Written with assistance from ChatGPT
const TimeDisplay = ({ utc_offset_seconds }: { utc_offset_seconds: number }) => {
  const getCurrentTime = () => {
    return new Date(
      Date.now() + new Date().getTimezoneOffset() * 60000 + utc_offset_seconds * 1000
    );
  };

  const [time, setTime] = useState<Date>(getCurrentTime());

  useEffect(() => {
    setTime(getCurrentTime()); // Update time when utc_offset_seconds changes

    const interval = setInterval(() => {
      setTime((prevTime) => new Date(prevTime.getTime() + 1000));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount or when dependencies change
  }, [utc_offset_seconds]);

  return <>{time.toLocaleTimeString()}</>;
};

export default TimeDisplay;
