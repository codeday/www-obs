import React, { useEffect, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import Text from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import PreloadedVideo from './PreloadedVideo';

export default function ProjectSlide({ isVisible, onReady, onComplete, project }) {
  const [elapsedSeconds, tick] = useReducer((i, reset) => reset ? 0 : i + 1, 0);
  const { members, media, name } = project;
  const videoSrc = media.filter((m) => m.stream)[0].stream;

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      if(elapsedSeconds >= 15) { tick(true); onComplete(); }
      else tick();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isVisible, elapsedSeconds, onComplete, project]);

  useEffect(() => tick(true), [project]);

  return useMemo(() => (
    <Box p={8}>
      <Text fontSize="xl" mb={-3} bold>Project Spotlight</Text>
      <Text fontSize="4xl" bold mb={-3}>{name}</Text>
      <Text fontSize="md" mb={2}>{members.map((m) => m.account.name).join(', ')}</Text>
      <PreloadedVideo
        isVisible={isVisible}
        onReady={onReady}
        onComplete={onComplete}
        src={videoSrc}
        neededPreloadSeconds={15}
        height="60vh"
        width="auto"
      />
    </Box>
  ), [project, isVisible, onReady, onComplete, videoSrc]);
}

ProjectSlide.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onReady: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};
