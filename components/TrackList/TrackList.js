/* eslint-disable react/forbid-prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Amplitude from 'amplitudejs';

import TrackListing from '../TrackListing/TrackListing';

const TrackList = ({ nftTracks }) => {
  useEffect(() => {
    if (nftTracks) {
      const songs = nftTracks.map(trackNFT => {
        console.log('trackNFT', trackNFT);
        const { name, artist, track, image, description } = trackNFT;

        const trackObject = {
          name,
          artist,
          album: 'First NFT Collection',
          url: track,
          cover_art_url: image,
          description
        };

        return trackObject;
      });

      console.log('songs', songs);
      try {
        Amplitude.init({
          bindings: {
            37: 'prev',
            39: 'next',
            32: 'play_pause'
          },
          songs
        });

        window.onkeydown = e => !(e.keyCode === 32);
      } catch (err) {
        console.log('error', err);
      }
    }
  }, [nftTracks]);

  return nftTracks.map((trackNFT, index) => {
    const someKey = uuidv4();
    return (
      <TrackListing key={someKey} trackNFT={trackNFT} amplitudeIndex={index} />
    );
  });
};

TrackList.propTypes = {
  nftTracks: PropTypes.arrayOf(PropTypes.object)
};

TrackList.defaultProps = {
  nftTracks: []
};

export default TrackList;
