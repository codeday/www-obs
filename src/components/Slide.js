import React from 'react';
import Box from '@codeday/topo/Atom/Box';

export default function Slide({ children, ...props }) {
  return (
    <Box p={8} {...props}>
      {children}
    </Box>
  )
}
