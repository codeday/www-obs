import React, { useState, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

export default function LiveAndPreload({ fallbackComponent, getNextElement }) {
  const [nextElementReady, setNextElementReady] = useState(false);
  const [elements, nextElement] = useReducer((state, useFallback) => {
    if (useFallback) {
      // Override the visible element with the fallback element
      return state.map(({ Component, props, displayed, i }) => ({
        displayed,
        ...( displayed ? { Component: fallbackComponent, props: {}, i } : { Component, props, i } ),
      }));
    } else {
      // Override the non-visible element with the next element, and swap visibility
      return state.map(({ Component, props, displayed, i }) => ({
        displayed: !displayed,
        i: displayed ? i : i + 2,
        ...( displayed ? getNextElement(i + 2) : { Component, props } ),
      }));
    }
  }, [{ displayed: true, Component: fallbackComponent, props: {}, i: 1 }, { displayed: false, ...getNextElement(0), i: 0 }]);

  const advance = () => {
    if (nextElementReady) {
      setNextElementReady(false);
      nextElement(false);
    } else {
      nextElement(true);
    }
  }

  return elements.map((e, i) => (
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
        onReady={() => setNextElementReady(true)}
        onComplete={advance}
        {...e.props}
      />
    </div>
  ));
}

LiveAndPreload.propTypes = {
  fallbackComponent: PropTypes.elementType.isRequired,
  getNextElement: PropTypes.func.isRequired,
};
