import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { FileUploader } from 'react-drag-drop-files';

import { nftAddress, mintedMusicAddress } from '../../config';

import NFT from '../../artifacts/contracts/MusicMakerNFT.sol/MusicMakerNFT.json';
import MintedMusic from '../../artifacts/contracts/MintedMusic.sol/MintedMusic.json';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const coverFileTypes = ['JPG', 'PNG', 'GIF'];
const trackFileTypes = ['WAV', 'MP3', 'AIFF'];

const CreateTrackListing = () => {
  const [coverURL, setCoverURL] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [trackURL, setTrackURL] = useState(null);
  const [trackFile, setTrackFile] = useState(null);
  const [trackPreviewURL, setTrackPreviewURL] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: '',
    description: ''
  });

  const router = useRouter();

  const handleCoverFileChange = file => {
    setCoverFile(file);
  };

  const handleTrackFileChange = file => {
    setTrackFile(file);
    setTrackPreviewURL(URL.createObjectURL(file));
  };

  async function onFilePreview(file, seFileFunc) {
    try {
      // TODO: use progress receieved to update a progress indicator
      const added = await client.add(file, {
        progress: prog => console.log(`progress received: ${prog}`)
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      seFileFunc(url);
    } catch (err) {
      console.error(err);
    }
  }

  async function createPlatformTrack(url) {
    console.log('createPlatformTrack');
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(nftAddress, NFT.abi, signer);
    let mintingPrice = await nftContract.getMintingPrice();
    mintingPrice *= 2;
    mintingPrice = mintingPrice.toString();
    let transaction = await nftContract.mint(url, 2, {
      value: mintingPrice
    });
    const tx = await transaction.wait();

    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    const mintedMusicContract = new ethers.Contract(
      mintedMusicAddress,
      MintedMusic.abi,
      signer
    );
    let listingPrice = await mintedMusicContract.getTrackListingPrice();
    listingPrice *= 2;
    listingPrice = listingPrice.toString();

    transaction = await mintedMusicContract.createTrackListing(
      nftAddress,
      tokenId,
      {
        value: listingPrice
      }
    );
    await transaction.wait();

    // once transaction has finished, reroute user to homepage to see new listed item
    router.push('/');
  }

  const createTrackNFT = async () => {
    const { name, description } = formInput;

    if (!name || !description || !coverURL) return;

    const data = JSON.stringify({
      name,
      description,
      image: coverURL,
      track: trackURL
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log('json url: ', url);
      createPlatformTrack(url);
    } catch (err) {
      console.error('Error uploading file: ', err);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Track Name"
          className="mt-8 border rounded p-4"
          onChange={e =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <input
          placeholder="Asset Description"
          className="mt-8 border rounded p-4"
          onChange={e =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <h3 className="text-xl mt-8">Upload Album Cover</h3>
        <div className="flex justify-content items-center mt-2">
          <FileUploader
            name="upload_album_cover"
            handleChange={handleCoverFileChange}
            types={coverFileTypes}
          />
          <button
            type="button"
            className="font-bold bg-cyan-500 text-white rounded p-4 shadow max-w-m ml-4"
            onClick={() => onFilePreview(coverFile, setCoverURL)}
          >
            Upload & Preview
          </button>
        </div>
        <input
          type="text"
          name="track-url"
          value={coverURL}
          className="mt-8 border rounded p-4"
          onChange={event => setCoverURL(event.target.value)}
          placeholder="or enter album cover IPFS url"
        />
        {coverURL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverURL}
            alt="asset preview"
            width="350"
            className="rounded mt-4"
          />
        )}
        <h3 className="text-xl mt-8">Upload Track</h3>
        <div className="flex justify-content items-center mt-2">
          <FileUploader
            name="upload_track"
            handleChange={handleTrackFileChange}
            types={trackFileTypes}
          />
          <button
            type="button"
            className="font-bold bg-cyan-500 text-white rounded p-4 shadow max-w-m ml-4"
            onClick={() => onFilePreview(trackFile, setTrackURL)}
          >
            Upload & Preview
          </button>
        </div>
        <input
          type="text"
          name="cover-url"
          value={trackURL}
          className="mt-8 border rounded p-4"
          onChange={event => setTrackURL(event.target.value)}
          placeholder="or enter track IPFS url"
        />
        <div>
          {trackURL && (
            <audio className="max-w-full">
              <source src={trackURL} type={trackFile?.type} />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
        <div>
          {trackFile && trackPreviewURL && !trackURL && (
            <audio controls className="max-w-full">
              <source src={trackPreviewURL} type={trackFile?.type} />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>

        <button
          type="button"
          onClick={createTrackNFT}
          className="font-bold mt-4 bg-cyan-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  );
};

CreateTrackListing.propTypes = {};

CreateTrackListing.defaultProps = {};

export default CreateTrackListing;
