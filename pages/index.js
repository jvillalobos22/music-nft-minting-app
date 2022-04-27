/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Head from 'next/head';
import { useWeb3React } from '@web3-react/core';

import { nftAddress, mintedMusicAddress } from '../config';

import NFT from '../artifacts/contracts/MusicMakerNFT.sol/MusicMakerNFT.json';
import MintedMusic from '../artifacts/contracts/MintedMusic.sol/MintedMusic.json';
import styles from '../styles/Layout.module.css';
import Footer from '../components/Footer/Footer';
import TrackListing from '../components/TrackListing/TrackListing';
import Navigation from '../components/Navigation/Navigation';

const Home = () => {
  const [nftTracks, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const context = useWeb3React();

  async function loadNFTs() {
    const { connector } = context;
    console.log('connector', connector);
    // const provider = new ethers.providers.Web3Provider(connector);
    const provider = new ethers.providers.JsonRpcProvider();
    console.log('provider', provider);

    // const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    // Prompt user for account connections
    // await provider.send('eth_requestAccounts', []);

    // we need the signer here to know who is msg.sender
    const signer = provider.getSigner();

    const mintedMusicContract = new ethers.Contract(
      mintedMusicAddress,
      MintedMusic.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const data = await mintedMusicContract.fetchTrackListings();

    console.log('data', data);

    const tracks = await Promise.all(
      data.map(async i => {
        const tokenURI = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        // let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

        const track = {
          tokenId: i.tokenId.toNumber(),
          //   seller: i.seller,
          //   owner: i.owner,
          track: meta.data.track,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        };

        return track;
      })
    );

    setNfts(tracks);
    setLoadingState('loaded');
  }

  useEffect(() => {
    loadNFTs();
  }, []);

  return (
    <>
      <Head>
        <title>Minted Music</title>
        <meta
          name="description"
          content="a web3 app to mint and listen to music NFTs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <div className={styles.container}>
        <main className={styles.main}>
          {loadingState === 'loaded' && !nftTracks.length ? (
            <div className="flex justify-center">
              <h1 className={styles.title}>
                There are currently no track NFTs listed. Try adding one!
              </h1>
            </div>
          ) : (
            <div className="flex justify-center pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {nftTracks.map(trackNFT => (
                  <TrackListing trackNFT={trackNFT} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Home;
