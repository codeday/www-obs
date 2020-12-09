import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';


// The readability of this class is much greater as a class

export default class PreloadedVideo extends Component {
  constructor(props) {
    super(props);
    this.progressMonitorInterval = null;
    this.ref = this.ref.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onEnded = this.onEnded.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.isVisible && nextProps.isVisible && this.player) {
      this.player.seekTo(0);
    }
  }

  ref(p) {
    this.player = p;
  }

  render() {
    const { src, isVisible, onReady, onComplete, neededPreloadSeconds, ...props } = this.props;
    return (
      <ReactPlayer
        url={src}
        ref={this.ref}
        volume={0}
        progressInterval={100}
        playing={isVisible}
        onProgress={this.onProgress}
        onPause={this.onEnded}
        onEnded={this.onEnded}
        onError={this.onEnded}
        disablePictureInPicture={true}
        muted={true}
        {...props}
      />
    )
  }

  onEnded() {
    if (this.props.isVisible) {
      this.props.onComplete();
    }
  }

  onProgress({ playedSeconds, loaded, loadedSeconds }) {
    if (this.props.isVisible) return;


    if ((this.props.neededPreloadSeconds && loadedSeconds < this.props.neededPreloadSeconds)
        && loaded < 0.95) {
      const desiredTime = Math.max(0, loadedSeconds - 5);
      if (playedSeconds < desiredTime) {
        this.player.seekTo(desiredTime);
      }
    } else {
      this.player.seekTo(0);
      this.props.onReady();
    }
  }
}

PreloadedVideo.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onReady: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  neededPreloadSeconds: PropTypes.number,
  src: PropTypes.string.isRequired,
};

PreloadedVideo.defaultProps = {
  neededPreloadSeconds: null,
};
