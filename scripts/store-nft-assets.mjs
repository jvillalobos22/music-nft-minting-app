/* eslint-disable no-await-in-loop */

import fs from 'fs';
import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

async function storeAsset() {
  const tracksJSON = await fs.promises.readFile(
    './seed-assets/seed-tracks.json'
  );
  const tracksWithIPFSLinks = [];

  const { tracks } = JSON.parse(tracksJSON);

  for (let i = 0; i < tracks.length; i += 1) {
    const image = await fs.promises.readFile(tracks[i].image);
    const track = await fs.promises.readFile(tracks[i].track);

    try {
      const ipfsImage = await client.add(image, {
        progress: prog => {
          if (prog % 1000000 === 0) {
            console.log(`progress received: ${prog % 1000000}`);
          }
        }
      });
      const imageUrl = `https://ipfs.infura.io/ipfs/${ipfsImage.path}`;
      const ipfsTrack = await client.add(track, {
        progress: prog => console.log(`progress received: ${prog}`)
      });
      const trackUrl = `https://ipfs.infura.io/ipfs/${ipfsTrack.path}`;

      const metadata = {
        name: tracks[i].name,
        artist: tracks[i].artist,
        description: tracks[i].description,
        image: imageUrl,
        image_type: tracks[i].image_type,
        track: trackUrl,
        track_type: tracks[i].track_type
      };

      console.log('metadata', metadata);

      const metadataJSON = JSON.stringify(metadata);

      const storedMetadata = await client.add(metadataJSON, {
        progress: prog => console.log(`progress received: ${prog}`)
      });
      const url = `https://ipfs.infura.io/ipfs/${storedMetadata.path}`;
      console.log('json url: ', url);

      tracksWithIPFSLinks.push({
        ...metadata,
        ipfsURL: url
      });
    } catch (err) {
      console.error('Error uploading file: ', err);
    }
  }

  console.log('tracksWithIPFSLinks', tracksWithIPFSLinks);
  const currentIpfsJSON = await fs.promises.readFile(
    './seed-assets/tracks-ipfs.json'
  );
  const currentData = JSON.parse(currentIpfsJSON);
  const data = JSON.stringify([...currentData, ...tracksWithIPFSLinks]);
  fs.writeFileSync('./seed-assets/tracks-ipfs.json', data);
}

storeAsset()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
