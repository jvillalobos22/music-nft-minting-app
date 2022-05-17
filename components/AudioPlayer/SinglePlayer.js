/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Amplitude from 'amplitudejs';

import styled from 'styled-components';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const Layout = styled.div``;

const PauseIconSC = styled(PauseIcon)`
  color: #01ff95;
  font-size: 48px;
`;

const PlayArrowIconSC = styled(PlayArrowIcon)`
  color: #01ff95;
  font-size: 48px;
`;

const MetaContainer = styled.div`
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
`;

const SinglePlayer = ({ trackNFT }) => {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  console.log(trackNFT);

  const { description } = trackNFT;
  //   const trackNFT = {
  //     name: "Risin' High (feat Raashan Ahmad)",
  //     artist: 'Ancient Astronauts',
  //     album: 'We Are to Answer',
  //     url: "https://521dimensions.com/song/Ancient Astronauts - Risin' High (feat Raashan Ahmad).mp3",
  //     cover_art_url:
  //       'https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg'
  //   };

  useEffect(() => {
    Amplitude.init({
      bindings: {
        37: 'prev',
        39: 'next',
        32: 'play_pause'
      },
      songs: [trackNFT]
    });

    window.onkeydown = e => !(e.keyCode === 32);
  }, []);

  const onClick = () => {
    const isTrackPlaying = ref.current?.classList.contains('amplitude-playing');
    setIsPlaying(isTrackPlaying);
  };

  return (
    <Layout>
      <div id="single-song-player">
        <img data-amplitude-song-info="cover_art_url" alt={description} />
        <div className="bottom-container">
          <progress
            className="amplitude-song-played-progress"
            id="song-played-progress"
          />

          <div className="time-container">
            <span className="current-time">
              <span className="amplitude-current-minutes" />:
              <span className="amplitude-current-seconds" />
            </span>
            <span className="duration">
              <span className="amplitude-duration-minutes" />:
              <span className="amplitude-duration-seconds" />
            </span>
          </div>

          <div className="control-container">
            <MetaContainer>
              <span data-amplitude-song-info="name" className="song-name" />
              <span data-amplitude-song-info="artist" />
            </MetaContainer>
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
    cover_art_url: PropTypes.string,
    description: PropTypes.string
  })
};

SinglePlayer.defaultProps = {
  trackNFT: ''
};

export default SinglePlayer;
