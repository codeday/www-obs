import { useEffect, useMemo, useReducer } from 'react';
import Box from '@codeday/topo/Atom/Box';
import { Transition, TransitionGroup } from 'react-transition-group';
import tmi from 'tmi.js';

const HIDE_TIMEOUT = 2;
const MAX_OPACITY = 0.8;
const MAX_HEIGHT = '30%';
const SPECIAL_EMOJI = {
  'clap': '/clap.png',
  'carp': '/carp.png',
};

export default function TwitchEmojiOverlay({ channel }) {
  const [displayedEmotes, modifyDisplayedEmotes] = useReducer((prev, { action, emotes }) => {
    const changeIds = emotes.map((e) => e.id);
    if (action === 'add') return [ ...prev, ...emotes ];
    if (action === 'remove') return prev.filter((e) => !changeIds.includes(e.id));
  }, [])

  const client = useMemo(() => new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [ channel ]
  }), [channel]);

  useEffect(() => {
    if (!client || typeof window === 'undefined') return;
    client.connect();

    client.on('message', (_, tags, message) => {
      const emoteImages = Object.keys(tags.emotes || {})
        .map((id) => `https://static-cdn.jtvnw.net/emoticons/v1/${id}/2.0`)

      Object.keys(SPECIAL_EMOJI)
        .filter((k) => message.includes(k))
        .forEach((k) => emoteImages.push(SPECIAL_EMOJI[k]));

      const emotes = emoteImages
        .map((image, i) => ({ id: `${tags.id}-${i}`, image, left: Math.random(), bottom: Math.random() }));

      modifyDisplayedEmotes({ action: 'add', emotes });
      setTimeout(() => modifyDisplayedEmotes({ action: 'remove', emotes }), HIDE_TIMEOUT * 1000);
    });

    return () => client.disconnect();
  }, [ client, typeof window ]);

  const stateProps = {
    entering: {
      opacity: 0,
    },
    entered: {
      opacity: MAX_OPACITY,
      bottom: MAX_HEIGHT,
    },
    exiting: {
      opacity: 0,
      bottom: MAX_HEIGHT,
    },
    exited: {
      opacity: 0,
      bottom: MAX_HEIGHT,
    }
  }

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      zIndex={5000}
    >
      <TransitionGroup>
        {displayedEmotes.map(({ id, image, left, bottom }) => (
          <Transition timeout={500} key={id}>
            {(state) => (
              <Box
                as="img"
                src={image}
                position="absolute"
                left={`${Math.round(left * 100)}%`}
                transition={`opacity 1s ease-in-out, bottom ${HIDE_TIMEOUT}s ease-in-out`}
                bottom={`-${Math.round((bottom + 1) * 2)}rem`}
                height="1.5rem"
                {...stateProps[state]}
              ></Box>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    </Box>
  );
}
