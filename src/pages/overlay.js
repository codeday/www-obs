import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import TwitchEmojiOverlay from '../components/TwitchEmojiOverlay';

export default function Overlay() {
  return (
    <>
      <Head>
        <title>OBS Overlays</title>
      </Head>
      <style type="text/css">{`
        html { background-color: transparent !important; }
      `}</style>
      <TwitchEmojiOverlay channel={process.env.NEXT_PUBLIC_TWITCH_CHANNEL} />
    </>
  );
}
