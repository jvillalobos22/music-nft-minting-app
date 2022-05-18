import React, { useRef } from 'react';
import styled from 'styled-components';
import Amplitude from 'amplitudejs';

import {
  PauseIconSC,
  PlayArrowIconSC,
  SkipNextIconSC,
  SkipPreviousIconSC,
  VolumeOffIconSC,
  VolumeDownIconSC,
  VolumeUpIconSC,
  VolumeSlider
} from './AudioSC';
import { useAudioPlayer } from '../../hooks/audio-player-context';

const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  a {
    display: flex;
    justify-content: center;
  }
`;

const InnerLayout = styled.div`
  min-height: 100px;
  width: 100%;
  background-color: rgb(18, 18, 18);
`;

const ProgressRange = styled.div`
  flex-grow: 1;
  padding: 0 1rem;
  display: flex;
  flex-wrap: nowrap;
`;

const MuteButton = styled.button`
  cursor: pointer;
  &.amplitude-muted {
    svg {
      color: red;
      font-size: 24px;
    }
  }
`;

const PlayPause = styled.button``;

const TimeContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  margin-right: 24px;
`;

const TrackDetails = styled.div`
  width: 20%;
  overflow: hidden;
  overflow-x: scroll;
`;

const TimeStart = styled.div`
  display: flex;
  flex-wrap: nowrap;

  color: #01ff95;
  font-size: 20px;
`;

const TimeEnd = styled.div`
  display: flex;
  flex-wrap: nowrap;

  font-size: 14px;
`;

const PlayerControls = styled.div`
  width: 33%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
`;

const Player = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  h6,
  span {
    display: block;
    width: 100%;
  }
`;

const CoverArtThumbnail = styled.img`
  width: 80px;
`;

const GlobalPlayer = () => {
  const ref = useRef(null);

  const { audioPlayerState, audioPlayerDispatch } = useAudioPlayer();
  const { isPlaying } = audioPlayerState;

  const onClick = () => {
    const isTrackPlaying = ref.current?.classList.contains('amplitude-playing');
    audioPlayerDispatch({
      type: 'setIsPlaying',
      payload: { isPlaying: isTrackPlaying }
    });
  };

  const songMeta = Amplitude.getActiveSongMetadata();
  // console.log('songMeta', songMeta);
  const { name, artist } = songMeta;

  return (
    <Layout>
      {/* <input type="range" className="slider amplitude-song-slider" step=".01" /> */}

      <InnerLayout className="flex flex-no-wrap justify-between">
        {songMeta && songMeta.name && (
          <Player className="pl-6 pr-6 pt-2 pb-2 flex flex-row justify-between items-center">
            <TrackDetails className="flex flex-column">
              {/* <div className="flex justify-start"> */}
              <CoverArtThumbnail data-amplitude-song-info="cover_art_url" />
              <div className="flex flex-wrap justify-start items-around ml-4">
                <h6 className="text-xs uppercase tracking-wide mb-2">
                  Now Playing:
                </h6>
                <span
                  data-amplitude-song-info="name"
                  className="song-name block text-xl"
                >
                  {name}
                </span>
                <span
                  data-amplitude-song-info="artist"
                  className="block text-sm"
                >
                  {artist}
                </span>
              </div>
              {/* </div> */}
            </TrackDetails>
            <ProgressRange>
              <TimeContainer>
                <TimeStart>
                  <span className="amplitude-current-minutes" />
                  :
                  <span className="amplitude-current-seconds" />
                </TimeStart>
                &nbsp;/&nbsp;
                <TimeEnd>
                  <span className="amplitude-duration-minutes" />
                  :
                  <span className="amplitude-duration-seconds" />
                </TimeEnd>
              </TimeContainer>
              <input
                type="range"
                className="slider amplitude-song-slider"
                step=".01"
              />
            </ProgressRange>
            <PlayerControls>
              <MuteButton className="amplitude-mute">
                <VolumeOffIconSC />
              </MuteButton>
              <PlayPause className="flex flex-column justify-between">
                <span className="amplitude-prev">
                  <SkipPreviousIconSC />
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
                <span className="amplitude-next">
                  <SkipNextIconSC />
                </span>
              </PlayPause>{' '}
              <VolumeSlider>
                <VolumeDownIconSC />
                <input type="range" className="amplitude-volume-slider" />
                <VolumeUpIconSC />
              </VolumeSlider>
            </PlayerControls>
          </Player>
        )}
      </InnerLayout>
    </Layout>
  );
};

export default GlobalPlayer;
