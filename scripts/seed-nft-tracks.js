/* eslint-disable no-await-in-loop */
const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const data = await fs.promises.readFile('./deployedContracts.json');
  const { nftAddress, mintedMusicAddress } = JSON.parse(data);

  console.log('nftAddress', nftAddress);
  console.log('mintedMusicAddress', mintedMusicAddress);

  const NFTjson = await fs.promises.readFile(
    './artifacts/contracts/MusicMakerNFT.sol/MusicMakerNFT.json'
  );
  const NFT = JSON.parse(NFTjson);
  const MintedMusicjson = await fs.promises.readFile(
    './artifacts/contracts/MintedMusic.sol/MintedMusic.json'
  );
  const MintedMusic = JSON.parse(MintedMusicjson);
  const tracksJSON = await fs.promises.readFile(
    './seed-assets/tracks-ipfs.json'
  );

  const tracks = JSON.parse(tracksJSON);

  console.log('tracks to MINT', tracks.length);

  const accounts = await hre.ethers.getSigners();
  const signer = accounts[0];

  const nftContract = new hre.ethers.Contract(nftAddress, NFT.abi, signer);

  let mintingPrice = await nftContract.getMintingPrice();
  mintingPrice *= 2;
  mintingPrice = mintingPrice.toString();

  for (let i = 0; i < tracks.length; i += 1) {
    try {
      const { ipfsURL } = tracks[i];

      console.log('ipfsURL', ipfsURL);

      let transaction = await nftContract.mint(ipfsURL, 2, {
        value: mintingPrice
      });

      const tx = await transaction.wait();

      const event = tx.events[0];
      const value = event.args[2];
      const tokenId = value.toNumber();

      const mintedMusicContract = new hre.ethers.Contract(
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

      console.log(`successfully minted NFT for track ${tracks[i].name}`);
      console.log(`successfully minted NFT for ipfsURL ${ipfsURL}`);
    } catch (err) {
      console.log('Error creating NFT or listing in Minted Music');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
