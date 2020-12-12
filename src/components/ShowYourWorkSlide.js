import React, { Component } from 'react';
import PropTypes from 'prop-types';
import truncate from 'truncate';
import Text from '@codeday/topo/Atom/Text';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import { apiFetch } from '@codeday/topo/utils';
import ConfettiBg from './ConfettiBg';
import { ShowYourWorkSlideQuery } from './ShowYourWorkSlide.gql'

const SHOW_ON_PAGE = 4;

export default class ShowYourWorkSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    if (typeof window === 'undefined') return;

    if (this.props.isVisible !== newProps.isVisible) {
      clearTimeout(this.timeout);
      if (newProps.isVisible) {
        this.timeout = setTimeout(newProps.onComplete, 10000);
      }
    }
  }

  componentDidMount() {
    setTimeout(this.props.onReady, 2000);
    apiFetch(ShowYourWorkSlideQuery)
      .then(async ({ showYourWork: { messages } }) => {
        this.setState({
          messages: messages
            .filter((m) => !m.videoUrl && m.author)
            .sort(() => Math.random() > 0.5 ? 1 : -1)
            .slice(0, SHOW_ON_PAGE)
          });
        this.props.onReady();
      });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { isVisible } = this.props;
    const { messages } = this.state;

    return (
      <>
        <Box p={8} position="relative">
          <Text bold fontSize="4xl">Recent Work-In-Progress Updates</Text>
          <Grid templateColumns={`repeat(${SHOW_ON_PAGE}, 1fr)`} gap={8}>
            {messages.map((m) => (
              <Box
                bg="white"
                rounded="md"
                opacity={isVisible ? 1 : 0}
                transition="all 2s ease-in-out"
                key={m.id}
              >
                <Image src={m.imageUrl} w="100%" alt="" />
                <Box p={4}>
                  <Text color="black" fontSize="xs">{truncate(m.text, 90) || '(No comment)'}</Text>
                  <Box fontSize="xs">
                    <Image src={m.author.picture} d="inline-block" mr={2} height="1.5em" rounded="full" />
                    <Text color="black" d="inline-block" mb={0}>{m.author.name}</Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
        <ConfettiBg />
      </>
    );
  }
}

ShowYourWorkSlide.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onReady: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};
