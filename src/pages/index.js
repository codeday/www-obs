import React from 'react';
import Text from '@codeday/topo/Atom/Text';
import Slide from '../components/Slide';

export default function Home() {
	return (
    <Slide textAlign="center">
      <Text fontSize="5xl">You've entered the wrong URL.</Text>
      <Text fontSize="4xl">
        For the <Text as="span" bold>intro</Text> bumpers, add
        <Text as="span" fontFamily="monospace" bg="gray.200" ml={4} p={2} rounded="sm">/intro</Text>
      </Text>

      <Text fontSize="4xl">
        For the <Text as="span" bold>break</Text> bumpers, add
        <Text as="span" fontFamily="monospace" bg="gray.200" ml={4} p={2} rounded="sm">/break</Text>
      </Text>

      <Text fontSize="4xl">
        For the <Text as="span" bold>error</Text> bumpers, add
        <Text as="span" fontFamily="monospace" bg="gray.200" ml={4} p={2} rounded="sm">/error</Text>
      </Text>

      <Text fontSize="4xl">
        For the <Text as="span" bold>overlay</Text>, add
        <Text as="span" fontFamily="monospace" bg="gray.200" ml={4} p={2} rounded="sm">/overlay</Text>
      </Text>
    </Slide>
	)
}
