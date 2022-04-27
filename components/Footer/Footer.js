import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import styles from '../../styles/Footer.module.css';

const Footer = () => {
  const context = useWeb3React();
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

  return (
    <footer className={styles.footer}>
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
    </footer>
  );
};

export default Footer;
