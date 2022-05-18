import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const FooterLayout = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-self: flex-end;
  padding: 16px;
`;

const Footer = () => {
  const context = useWeb3React();
  const { library, chainId } = context;

  // set up block listener
  const [blockNumber, setBlockNumber] = useState();

  useEffect(() => {
    if (library) {
      let stale = false;

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
    <FooterLayout className="flex flex-col flex-wrap items-end pl-6 pr-6 pt-2 pb-2">
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
    </FooterLayout>
  );
};

export default Footer;
