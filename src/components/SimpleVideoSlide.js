import React from 'react';
import PropTypes from 'prop-types';
import PreloadedVideo from './PreloadedVideo';

export default function SimpleVideoSlide({ isVisible, onReady, onComplete, src }) {
  return (
    <PreloadedVideo
      isVisible={isVisible}
      onReady={onReady}
      onComplete={onComplete}
      src={src}
      width="100%"
      height="auto"
    />
  );
}

SimpleVideoSlide.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onReady: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
};
