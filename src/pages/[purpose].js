import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { apiFetch } from '@codeday/topo/utils';
import { DateTime } from 'luxon';
import rwc from 'random-weighted-choice';
import LiveAndPreload from '../components/LiveAndPreload';
import AudioPlayer from '../components/AudioPlayer';
import FallbackSlide from '../components/FallbackSlide';
import SimpleVideoSlide from '../components/SimpleVideoSlide';
import ProjectSlide from '../components/ProjectSlide';
import CalendarSlide from '../components/CalendarSlide';
import ShowYourWorkSlide from '../components/ShowYourWorkSlide';
import { BumpersQuery } from './bumpers.gql';
import TwitchEmojiOverlay from '../components/TwitchEmojiOverlay';
import Slide from '../components/Slide';

export default function Intro({ bumpers, projects, events, music }) {
  const [initialized, setInitialized] = useState(false);

  const getNextElement = (state) => {
    // We have to filter these here because the livestream display could be up for hours or even days, and the events
    // list is only fetched when the page is loaded.
    const cutoff = DateTime.local().plus({ minutes: -20 });
    const filteredEvents = events.filter((e) => DateTime.fromISO(e.start) > cutoff);

    const ambientBumpers = bumpers.filter((b) => b.ambient);

    const choices = {
      showYourWork: {
        Component: ShowYourWorkSlide,
        props: {},
      },
      ...(bumpers[state % bumpers.length] && {
        bumper: {
          Component: SimpleVideoSlide,
          props: { src: bumpers[state % bumpers.length].src },
        },
      }),
      ...(projects[state % projects.length] && {
        project: {
          Component: ProjectSlide,
          props: { project: projects[state % projects.length] },
        },
      }),
      ...(filteredEvents.length > 0 && {
        calendar: {
          Component: CalendarSlide,
          props: { events: filteredEvents, src: ambientBumpers[state % ambientBumpers.length]?.src }
        }
      })
    }

    const weights = [
      { id: 'bumper', weight: 0.4 },
      { id: 'project', weight: 0.3 },
      { id: 'calendar', weight: 0.1 },
      { id: 'showYourWork', weight: 0.2 },
     ].filter(({ id }) => id in choices);

    const choice = choices[rwc(weights)];
    return choice;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') setInitialized(true);
  }, [typeof window]);

  if (!initialized || bumpers.length === 0) return <></>;

  return (
    <>
      <Head>
        <title>OBS Overlays</title>
      </Head>
      <AudioPlayer tracks={music} />
      <LiveAndPreload fallbackComponent={FallbackSlide} getNextElement={getNextElement} />
      <TwitchEmojiOverlay channel={process.env.NEXT_PUBLIC_TWITCH_CHANNEL} />
    </>
  );
}


const getDate = (offsetHours) => {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() - 7 + (offsetHours || 0));
  return d.toISOString();
};

export async function getServerSideProps({ params: { purpose } }) {
  const results = await apiFetch(BumpersQuery, {
    purpose,
    calendarDateStart: getDate(-2),
    calendarDateEnd: getDate(24 * 7 * 4),
  });

  return {
    props: {
      bumpers: results?.cms?.bumpers?.items
        .filter((v) => v.video?.playbackId && v.video?.ready)
        .map((v) => ({ ...v, src: `https://stream.mux.com/${v.video.playbackId}.m3u8` }))
        .sort(() => Math.random() > 0.5 ? 1 : -1),
      music: results?.cms?.stockMusics?.items
        .map((m) => m.music?.url)
        .sort(() => Math.random() > 0.5 ? 1 : -1),
      projects: results?.showcase?.projects
        .sort(() => Math.random() > 0.5 ? 1 : -1),
      events: results?.calendar?.events,
    },
  }
}
