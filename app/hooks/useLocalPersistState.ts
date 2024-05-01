import { useState, useEffect } from "react";

const useLocalPersistState = (defaultValue:any, key:any) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      const persistValue = window.localStorage.getItem(key);
      return persistValue !== null && persistValue !== "undefined"? JSON.parse(persistValue) : defaultValue;

    }    
    return defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

export default useLocalPersistState;