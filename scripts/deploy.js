const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const MintedMusic = await hre.ethers.getContractFactory('MintedMusic');
  const mintedMusic = await MintedMusic.deploy();
  await mintedMusic.deployed();
  console.log('mintedMusic deployed to:', mintedMusic.address);

  const MusicMakerNFT = await hre.ethers.getContractFactory('MusicMakerNFT');
  const nft = await MusicMakerNFT.deploy(mintedMusic.address);
  await nft.deployed();
  console.log('nft deployed to:', nft.address);

  const config = `export const mintedMusicAddress = '${mintedMusic.address}';\nexport const nftAddress = '${nft.address}';\n`;
  const json = {
    mintedMusicAddress: mintedMusic.address,
    nftAddress: nft.address
  };
  const data = JSON.stringify(config);
  const jsonData = JSON.stringify(json);

  fs.writeFileSync('deployedContracts.js', JSON.parse(data));
  fs.writeFileSync('deployedContracts.json', jsonData);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
