import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import { DateTime } from 'luxon';
import PreloadedVideo from './PreloadedVideo';

export default class CalendarSlide extends Component {
  UNSAFE_componentWillReceiveProps(newProps) {
    if (typeof window === 'undefined') return;

    if (this.props.isVisible !== newProps.isVisible) {
      clearTimeout(this.timeout);
      if (newProps.isVisible) {
        this.timeout = setTimeout(newProps.onComplete, 15000);
      }
    }
  }

  componentDidMount() {
    if (!this.props.src) {
      setTimeout(this.props.onReady, 200);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  render() {
    const { events, isVisible, onReady, onComplete, src } = this.props;

    return (
      <>
        { src && (
          <PreloadedVideo
            isVisible={isVisible}
            onReady={onReady}
            onComplete={onComplete}
            src={src}
            width="100%"
            height="auto"
            z-index={100}
          />
        )}
        <Box p={8} position="absolute" top={0} right={0} bottom={0} left={0} bg="red.600" opacity={0.9} zIndex={200} />
        <Box p={8} position="absolute" top={0} right={0} bottom={0} left={0} zIndex={300}>
          <Text bold fontSize="4xl">Coming Up</Text>
          {events.slice(0,3).map((e) => (
            <Box mb={12} key={e.title}>
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
      </>
    );
  }
}

CalendarSlide.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onReady: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
};
