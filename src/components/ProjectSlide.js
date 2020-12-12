import React, { Component, useEffect, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import Text from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import PreloadedVideo from './PreloadedVideo';

export default class ProjectSlide extends Component {
  UNSAFE_componentWillReceiveProps(newProps) {
    if (typeof window === 'undefined') return;

    if (this.props.isVisible !== newProps.isVisible) {
      clearTimeout(this.timeout);
      if (newProps.isVisible) {
        this.timeout = setTimeout(newProps.onComplete, 25000);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { members, media, name } = this.props.project;
    const videoSrc = media.filter((m) => m.stream)[0].stream;

    return (
      <>
        <Box bg="#000" width="100%" height="100%">
          <PreloadedVideo
            isVisible={this.props.isVisible}
            onReady={this.props.onReady}
            onComplete={this.props.onComplete}
            src={videoSrc}
            neededPreloadSeconds={15}
            width="100%"
            height="100%"
            startAt={7}
          />
        </Box>
        {[1,2].map((i) => /* Wasn't dark enough on its own, yolo */ (
          <Box
            position="absolute"
            zIndex={500}
            top={0}
            right={0}
            left={0}
            grad="darken.lg.180"
            color="white"
            p={4}
            key={i}
          >
            <Text fontSize="xl" mb={-3} bold>Project Spotlight</Text>
            <Text fontSize="4xl" bold mb={-3}>{name}</Text>
            <Text fontSize="md" mb={2}>{members.map((m) => m.account.name).join(', ')}</Text>
          </Box>
        ))}
      </>
    );
  }
}

ProjectSlide.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onReady: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};
