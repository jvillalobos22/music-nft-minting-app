/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';

import { nftAddress, mintedMusicAddress } from '../config';

import NFT from '../artifacts/contracts/MusicMakerNFT.sol/MusicMakerNFT.json';
import MintedMusic from '../artifacts/contracts/MintedMusic.sol/MintedMusic.json';
import styles from '../styles/Layout.module.css';
// import Footer from '../components/Footer/Footer';
import TrackListing from '../components/TrackListing/TrackListing';
import Navigation from '../components/Navigation/Navigation';

const FooterWithNoSSR = dynamic(() => import('../components/Footer/Footer'), {
  ssr: false
});

const Home = () => {
  const [nftTracks, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider();

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

      <main className={styles.main}>
        <div className={styles.container}>
          {loadingState === 'loaded' && !nftTracks.length ? (
            <div className="flex justify-center">
              <h1 className={styles.title}>
                There are currently no track NFTs listed. Try adding one!
              </h1>
            </div>
          ) : (
            <div>
              <div className="flex justify-start pt-8">
                <h1 className={styles.title}>New NFTs</h1>
              </div>
              <div className="flex justify-center pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {nftTracks.map(trackNFT => {
                    const someKey = uuidv4();
                    return <TrackListing key={someKey} trackNFT={trackNFT} />;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterWithNoSSR />
    </>
  );
};

export default Home;
