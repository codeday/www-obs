import React, { Component, useState, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

const MAX_FAILS_BEFORE_REPLACE = 2;

export default class LiveAndPreload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextElementReady: false,
      nextElementFails: 0,
      elements: [
        { displayed: true, Component: this.props.fallbackComponent, props: {}, i: 1 },
        { displayed: false, ...this.props.getNextElement(0), i: 0 }
      ],
    };
    this.advance = this.advance.bind(this);
  }

  render() {
    return this.state.elements.map((e, i) => (
      <div
        key={i}
        className="slide"
        style={{
          opacity: e.displayed ? 1 : 0,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          overflow: 'hidden',
          position: 'absolute'
        }}
      >
        <e.Component
          isVisible={e.displayed}
          onReady={() => this.setState({ nextElementReady: true })}
          onComplete={this.advance}
          {...e.props}
        />
      </div>
    ));
  }

  advance() {
    let failingElementWasReplaced = false;
    let elements;
    if (this.state.nextElementReady) { // Promote loading => visible; load a new loading component
      elements = this.state.elements.map(({ Component, props, displayed, i }) => ({
        displayed: !displayed,
        i: displayed ? i : i + 2,
        ...(displayed
          ? this.props.getNextElement(i + 2)
          : { Component, props }
        ),
      }));

    } else if (this.state.nextElementFails < MAX_FAILS_BEFORE_REPLACE) { // Replace visible => fallback
      elements = this.state.elements.map(({ Component, props, displayed, i }) => ({
        displayed,
        ...(displayed
          ? { Component: this.props.fallbackComponent, props: {}, i }
          : { Component, props, i }
        ),
      }));

    } else { // Next element is failing to load, replace failed loading => new loading
      failingElementWasReplaced = true;
      elements = this.state.elements.map(({ Component, props, displayed, i }) => ({
        displayed,
        ...(displayed
          ? { Component: this.props.fallbackComponent, props: {}, i }
          : this.props.getNextElement(i + 2)
        ),
      }));
    }

    this.setState({
      // Reset the fails counter if the element loaded, or if the element was replaced
      nextElementFails: (this.state.nextElementReady || failingElementWasReplaced)
        ? 0
        : this.state.nextElementFails + 1,

      // The next element will never be ready -- either it wasn't ready to begin with, or a new one is now loading
      nextElementReady: false,

      // Our updated elements
      elements,
    });
  }
}

LiveAndPreload.propTypes = {
  fallbackComponent: PropTypes.elementType.isRequired,
  getNextElement: PropTypes.func.isRequired,
};
