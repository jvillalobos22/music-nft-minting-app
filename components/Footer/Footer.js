import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Amplitude from 'amplitudejs';

import { PauseIconSC, PlayArrowIconSC } from '../AudioPlayer/AudioSC';
import { useAudioPlayer } from '../../hooks/audio-player-context';

const FooterBottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-self: flex-end;
  padding: 16px;
`;

const FooterSC = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  a {
    display: flex;
    justify-content: center;
  }
`;

const FooterLayout = styled.div`
  min-height: 150px;
  width: 100%;
`;

const FooterPlayer = styled.div`
  flex-grow: 1;
`;

const FooterPlayerControls = styled.div`
  display: flex;
  flex-wrap: wrap;

  h6,
  span {
    display: block;
    width: 100%;
  }
`;

const Footer = () => {
  const ref = useRef(null);
  const context = useWeb3React();
  const { audioPlayerState, audioPlayerDispatch } = useAudioPlayer();
  const { isPlaying } = audioPlayerState;
  const { library, chainId } = context;

  // set up block listener
  const [blockNumber, setBlockNumber] = useState();

  useEffect(() => {
    console.log('running');
    if (library) {
      let stale = false;

      console.log('fetching block number!!');
      library
        .getBlockNumber()
        .then(blockNo => {
          if (!stale) {
            setBlockNumber(blockNo);
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null);
          }
        });

      const updateBlockNumber = blockNo => {
        setBlockNumber(blockNo);
      };
      library.on('block', updateBlockNumber);

      return () => {
        library.removeListener('block', updateBlockNumber);
        stale = true;
        setBlockNumber(undefined);
      };
    }
    return undefined;
  }, [library, chainId]);

  const onClick = () => {
    const isTrackPlaying = ref.current?.classList.contains('amplitude-playing');
    audioPlayerDispatch({
      type: 'setIsPlaying',
      payload: { isPlaying: isTrackPlaying }
    });
  };

  const songMeta = Amplitude.getActiveSongMetadata();
  console.log('songMeta', songMeta);
  const { name, artist } = songMeta;

  return (
    <FooterSC>
      <input type="range" className="slider amplitude-song-slider" step=".01" />
      <FooterLayout className="flex flex-no-wrap justify-between">
        <FooterPlayer>
          {songMeta && songMeta.name && (
            <FooterPlayerControls className="pl-6 pr-6 pt-2 pb-2 control-container">
              <h6 className="text-xs uppercase tracking-wide">Now Playing:</h6>
              <span
                data-amplitude-song-info="name"
                className="song-name block text-base"
              >
                {name}
              </span>
              <span
                data-amplitude-song-info="artist"
                className="block text-base"
              >
                {artist}
              </span>
              <button
                type="button"
                ref={ref}
                className="amplitude-play-pause"
                id="play-pause"
                onClick={onClick}
                onKeyUp={onClick}
              >
                {isPlaying ? <PauseIconSC /> : <PlayArrowIconSC />}
              </button>
            </FooterPlayerControls>
          )}
        </FooterPlayer>

        <FooterBottom className="flex flex-col flex-wrap items-end pl-6 pr-6 pt-2 pb-2">
          <a
            href="https://juantonmusic.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built by&nbsp;
            <span>Juanton</span>
          </a>
          <span>
            Block No:{' '}
            {blockNumber === undefined || blockNumber === null
              ? '...'
              : blockNumber.toLocaleString()}
          </span>
        </FooterBottom>
      </FooterLayout>
    </FooterSC>
  );
};

export default Footer;
