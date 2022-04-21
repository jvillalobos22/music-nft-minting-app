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

  const config = `
  export const nftmarketaddress = "${mintedMusic.address}"
  export const nftaddress = "${nft.address}"
  `;

  const data = JSON.stringify(config);
  fs.writeFileSync('config.js', JSON.parse(data));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
