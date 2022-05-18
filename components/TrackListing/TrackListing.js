/* eslint-disable arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import SinglePlayer from '../AudioPlayer/SinglePlayer';

const TrackListing = ({ trackNFT, amplitudeIndex }) => {
  // console.log('TrackListing trackNFT', trackNFT);
  return <SinglePlayer trackNFT={trackNFT} amplitudeIndex={amplitudeIndex} />;
};

TrackListing.propTypes = {
  trackNFT: PropTypes.shape({
    artist: PropTypes.string,
    image: PropTypes.string,
    imageType: PropTypes.string,
    track: PropTypes.string,
    trackType: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    tokenId: PropTypes.number
  }),
  amplitudeIndex: PropTypes.number.isRequired
};

TrackListing.defaultProps = {
  trackNFT: {
    artist: '',
    image: '',
    imageType: '',
    track: '',
    trackType: '',
    description: '',
    name: '',
    tokenId: ''
  }
};

export default TrackListing;
