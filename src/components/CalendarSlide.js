import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import { DateTime } from 'luxon';
import ConfettiBg from './ConfettiBg';

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
    setTimeout(this.props.onReady, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { events } = this.props;

    return (
      <>
        <Box p={8} position="relative">
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
          <ConfettiBg />
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
