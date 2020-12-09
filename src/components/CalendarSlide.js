import React, { useEffect, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import Text from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import { DateTime } from 'luxon';

export default function CalendarSlide({ isVisible, onReady, onComplete, events }) {
  const [elapsedSeconds, tick] = useReducer((i, reset) => reset ? 0 : i + 1, 0);
  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      if(elapsedSeconds >= 15) { tick(true); onComplete(); }
      else tick();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isVisible, elapsedSeconds, onComplete, events]);

  useEffect(() => { tick(true); onReady(); }, [events]);

  return (
    <Box p={8}>
      <Text bold fontSize="4xl">Coming Up</Text>
      {events.slice(0,3).map((e) => (
        <Box mb={12}>
          <Text mb={0}>{e.calendarName}</Text>
          <Text fontSize="3xl" bold mb={0}>{e.title}</Text>
          <Text>
            {DateTime.fromISO(e.start).setZone('America/Los_Angeles').toFormat('EEEE, MMMM d, yyyy @ h:mm a ZZZZ')}
            {' ('}
            {DateTime.fromISO(e.start).setZone('America/Denver').toFormat('h:mm a ZZZZ')}
            {' / '}
            {DateTime.fromISO(e.start).setZone('America/Chicago').toFormat('h:mm a ZZZZ')}
            {' / '}
            {DateTime.fromISO(e.start).setZone('America/New_York').toFormat('h:mm a ZZZZ')}
            {' / '}
            {DateTime.fromISO(e.start).setZone('UTC').toFormat('HH:mm ZZZZ')}
            )
          </Text>
        </Box>
      ))}
    </Box>
  );
}

CalendarSlide.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onReady: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
};
