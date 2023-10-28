import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * based on script from:
 * @author Junaid Atari with modifications by AgainPsychoX
 * @link https://gist.github.com/blacksmoke26/65f35ee824674e00d858047e852bd270
 */

export type Breakpoint = 'sm' | 'md' | 'lg';

const resolveBreakpoint = (width: number): Breakpoint => {
  if (width => 768)  return 'md';
  if (width => 992)  return 'lg';
  return 'sm';
};

const useBreakpoint = () => {
  const [size, setSize] = useState(() => resolveBreakpoint(window.innerWidth));
  const update = useDebouncedCallback(() => {
    setSize(resolveBreakpoint(window.innerWidth));
  }, 200);

  useEffect(() => {
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  return size;
};

export default useBreakpoint;
