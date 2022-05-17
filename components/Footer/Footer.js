import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import styles from '../../styles/Footer.module.css';

const FooterBottom = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  padding: 8px;
`;

const PauseIconSC = styled(PauseIcon)`
  color: #01ff95;
  font-size: 48px;
`;

const PlayArrowIconSC = styled(PlayArrowIcon)`
  color: #01ff95;
  font-size: 48px;
`;

const FooterPlayerControls = styled.div``;

const Footer = () => {
  const ref = useRef(null);
  const context = useWeb3React();
  const [isPlaying, setIsPlaying] = useState(false);
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
    setIsPlaying(isTrackPlaying);
  };

  return (
    <footer className={styles.footer}>
      <input type="range" className="slider amplitude-song-slider" step=".01" />

      <FooterPlayerControls>
        <span data-amplitude-song-info="name" className="song-name" />
        <span data-amplitude-song-info="artist" />
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

      <FooterBottom>
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
    </footer>
  );
};

export default Footer;
