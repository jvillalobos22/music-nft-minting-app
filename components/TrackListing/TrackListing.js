import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Layout.module.css';

const TrackListing = ({ trackNFT }) => {
  console.log(trackNFT);
  return (
    <div
      key={trackNFT.tokenId}
      className="border shadow rounded-xl overflow-hidden"
    >
      {trackNFT.track && (
        <audio controls className={styles.full_width_audio}>
          <source src={trackNFT.track} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      <img
        src={trackNFT.image}
        className="rounded"
        alt={trackNFT.description}
      />
      <div className="p-4 bg-black">
        <p className="text-2xl font-bold text-white">{trackNFT.name}</p>
      </div>
    </div>
  );
};

TrackListing.propTypes = {
  trackNFT: PropTypes.shape({
    image: PropTypes.string,
    track: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    tokenId: PropTypes.string
  })
};

TrackListing.defaultProps = {
  trackNFT: {
    image: '',
    track: '',
    description: '',
    name: '',
    tokenId: ''
  }
};

export default TrackListing;