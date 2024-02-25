import React, { useRef, useReducer, useState, useEffect } from 'react';
import Box from '@codeday/topo/Atom/Box';
import PropTypes from 'prop-types'

export default function AudioPlayer({ tracks }) {
  const ref = useRef();
  const [playbackAllowed, setPlaybackAllowed] = useState(true);
  const [nowPlayingIndex, next] = useReducer((s) => { return (s + 1) % tracks.length }, 0);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current || !playbackAllowed) return;
    ref.current.load();
    ref.current.play().catch(() => setPlaybackAllowed(false));
  }, [typeof window, ref.current, playbackAllowed, nowPlayingIndex]);

  if (!playbackAllowed && (!window || (window.self === window.top)) return (
    <Box
      onClick={() => setPlaybackAllowed(true)}
      zIndex={2000}
      bg="blue.500"
      color="white"
      fontSize="2xl"
      cursor="pointer"
      textAlign="center"
      position="absolute"
      top={0}
      left={0}
      right={0}
      p={2}
    >
      Click here to allow audio playback. In OBS, you will need to right-click on the browser source and click
      "Interact" first.
    </Box>
  );

  return (
    <audio
      ref={ref}
      onEnded={(e) => { ref.current.pause(); next(); }}
    >
      <source src={tracks[nowPlayingIndex]} />
    </audio>
  )
}
