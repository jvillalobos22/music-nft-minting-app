/* eslint-disable camelcase */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { PauseIconSC, PlayArrowIconSC } from './AudioSC';

import { useAudioPlayer } from '../../hooks/audio-player-context';

const Layout = styled.div``;

const MetaContainer = styled.div`
  width: calc(100% - 48px);
  overflow: hidden;
  text-overflow: ellipsis;

  span[data-amplitude-song-info='name'] {
    font-size: 18px;
    color: #fff;
    display: block;
  }

  span[data-amplitude-song-info='artist'] {
    font-weight: 100;
    font-size: 14px;
    color: #fff;
    display: block;
  }

  .artist-name,
  .song-name {
    white-space: nowrap;
    position: relative;
    z-index: 10;
  }
`;

const PlayButton = styled.button`
  width: max-content;
  position: relative;
  z-index: 100;
  background-color: rgb(18, 18, 18);
`;

const SinglePlayer = ({ trackNFT, amplitudeIndex }) => {
  const playButtonRef = useRef(null);
  const containerRef = useRef(null);
  const songNameRef = useRef(null);

  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);
  const { audioPlayerState, audioPlayerDispatch } = useAudioPlayer();
  const { isPlaying } = audioPlayerState;

  const { description, image } = trackNFT;

  console.log('trackNFT', trackNFT);

  const onClick = () => {
    const isTrackPlaying =
      playButtonRef.current?.classList.contains('amplitude-playing');

    audioPlayerDispatch({
      type: 'setIsPlaying',
      payload: { isPlaying: isTrackPlaying }
    });
  };

  useEffect(() => {
    if (songNameRef.current.scrollWidth > songNameRef.current.clientWidth) {
      console.log('containerRef width', containerRef.current.offsetWidth);
      console.log('songNameRef width', songNameRef.current.offsetWidth);
      console.log('songNameRef clientWidth', songNameRef.current.clientWidth);
      console.log('songNameRef scrollWidth', songNameRef.current.scrollWidth);
      console.log('titleIsOverflowing');
      setIsTitleOverflowing(true);
    }
  }, []);

  console.log('amplitudeIndex', amplitudeIndex);

  return (
    <Layout>
      <div id="single-song-player" ref={containerRef}>
        <img
          // data-amplitude-song-info="cover_art_url"
          alt={description}
          src={image}
          // data-amplitude-song-index={amplitudeIndex}
        />
        <div className="bottom-container">
          <progress
            className="amplitude-song-played-progress"
            data-amplitude-song-index={amplitudeIndex}
            id="song-played-progress"
          />

          {/* <div className="time-container">
            <span className="current-time">
              <span
                className="amplitude-current-minutes"
                data-amplitude-song-index={amplitudeIndex}
              />
              :
              <span
                className="amplitude-current-seconds"
                data-amplitude-song-index={amplitudeIndex}
              />
            </span>
            <span className="duration">
              <span
                className="amplitude-duration-minutes"
                data-amplitude-song-index={amplitudeIndex}
              />
              :
              <span
                className="amplitude-duration-seconds"
                data-amplitude-song-index={amplitudeIndex}
              />
            </span>
          </div> */}

          <div className="control-container">
            <MetaContainer>
              <div className={isTitleOverflowing ? 'marquee' : ''}>
                <div>
                  <span
                    ref={songNameRef}
                    className="song-name"
                    data-amplitude-song-info="name"
                    data-amplitude-song-index={amplitudeIndex}
                  />
                </div>
              </div>

              <span
                className="artist-name"
                data-amplitude-song-info="artist"
                data-amplitude-song-index={amplitudeIndex}
              />
            </MetaContainer>
            <PlayButton
              type="button"
              ref={playButtonRef}
              className="amplitude-play-pause"
              data-amplitude-song-index={amplitudeIndex}
              id="play-pause"
              onClick={onClick}
              onKeyUp={onClick}
            >
              {isPlaying ? <PauseIconSC /> : <PlayArrowIconSC />}
            </PlayButton>
          </div>
        </div>
      </div>
    </Layout>
  );
};

SinglePlayer.propTypes = {
  trackNFT: PropTypes.shape({
    name: PropTypes.string,
    artist: PropTypes.string,
    album: PropTypes.string,
    url: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string
  }),
  amplitudeIndex: PropTypes.number.isRequired
};

SinglePlayer.defaultProps = {
  trackNFT: ''
};

export default SinglePlayer;
