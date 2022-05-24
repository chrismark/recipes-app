import { useEffect, useRef } from 'react';
//
const isStringNotNullOrEmpty = (str) => str && str.trim().length > 0;

const useIsMounted = (label = false) => {
  const isMounted = useRef(null);

  useEffect(() => {
    if (isMounted.current == null) {
      isMounted.current = true;
      console.log(`${label || 'Component'} mounted.`);
    }
    return () => {
      isMounted.current = false;
      console.log(`${label || 'Component'} unmounted.`);
    };
  }, []);

  return isMounted;
};

export {
  isStringNotNullOrEmpty,
  useIsMounted,
}