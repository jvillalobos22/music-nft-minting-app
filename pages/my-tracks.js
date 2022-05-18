/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Web3Modal from 'web3modal';
import Head from 'next/head';

import styles from '../styles/Layout.module.css';

import { nftAddress, mintedMusicAddress } from '../deployedContracts';

import NFT from '../artifacts/contracts/MusicMakerNFT.sol/MusicMakerNFT.json';
import MintedMusic from '../artifacts/contracts/MintedMusic.sol/MintedMusic.json';
import Footer from '../components/Footer/Footer';
import TrackListing from '../components/TrackListing/TrackListing';
import Navigation from '../components/Navigation/Navigation';

const MyTracks = () => {
  const [nftTracks, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
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
        <title>TRAX - My Tracks</title>
        <meta
          name="description"
          content="a web3 app to mint and listen to music NFTs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className="flex justify-center">
            {loadingState === 'loaded' && !nftTracks.length ? (
              <h1 className="px-20 py-10 text-3xl">
                There are no assets in this wallet.
              </h1>
            ) : (
              <div className="pt-4">
                <h2 className="text-2xl py-2">NFT Tracks You Created: </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {nftTracks.map((trackNFT, i) => (
                    <TrackListing trackNFT={trackNFT} amplitudeIndex={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyTracks;
