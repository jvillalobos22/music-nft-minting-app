const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MusicMakerNFT', () => {
  it('Should deploy', async () => {
    const accounts = await ethers.getSigners();

    const signer = accounts[0];

    const MintedMusic = await ethers.getContractFactory('MintedMusic');
    const mintedMusic = await MintedMusic.deploy();
    await mintedMusic.deployed();

    expect(await mintedMusic.marketListingPrice()).to.equal(
      ethers.utils.parseUnits('1', 'ether')
    );

    expect(await mintedMusic.trackListingPrice()).to.equal(
      ethers.utils.parseUnits('1', 'ether')
    );

    expect(await mintedMusic.owner()).to.equal(signer.address);
  });

  it('Should create a track listing', async () => {
    const [contractDeployAddress, mintAddress] = await ethers.getSigners();

    const MintedMusic = await ethers.getContractFactory('MintedMusic');
    const mintedMusic = await MintedMusic.deploy();
    await mintedMusic.deployed();
    const platformContractAddress = mintedMusic.address;

    let trackListingPrice = await mintedMusic.getTrackListingPrice();
    trackListingPrice = trackListingPrice.toString();

    const fakeLocationOne = 'https://www.mytokenlocation.com';
    const fakeLocationTwo = 'https://www.mytokenlocation2.com';

    const MusicMakerNFT = await ethers.getContractFactory('MusicMakerNFT');
    const musicMakerNft = await MusicMakerNFT.deploy(platformContractAddress);
    await musicMakerNft.deployed();
    const nftContractAddress = musicMakerNft.address;

    let publicMintingPrice = await musicMakerNft.PUBLIC_MINTING_PRICE();
    publicMintingPrice = (Number(publicMintingPrice) * 10).toString();

    await musicMakerNft.connect(mintAddress).mint(fakeLocationOne, 10, {
      value: publicMintingPrice
    });
    await musicMakerNft.connect(mintAddress).mint(fakeLocationTwo, 10, {
      value: publicMintingPrice
    });

    const contracOwnerBalanceBefore = await contractDeployAddress.getBalance();

    await mintedMusic
      .connect(mintAddress)
      .createTrackListing(nftContractAddress, 0, {
        value: trackListingPrice
      });
    await mintedMusic
      .connect(mintAddress)
      .createTrackListing(nftContractAddress, 10, {
        value: trackListingPrice
      });

    const numberOfTracksCreated = await mintedMusic.getNumTrackListings();
    let tracks = await mintedMusic.fetchTrackListings();

    tracks = await Promise.all(
      tracks.map(async i => {
        const tokenUri = await musicMakerNft.tokenURI(i.tokenId);
        const track = {
          trackId: i.trackId.toString(),
          nftContract: i.nftContract.toString(),
          tokenId: i.tokenId.toString(),
          artist: i.artist,
          owner: i.owner,
          tokenUri
        };
        return track;
      })
    );

    const trackOne = tracks[0];
    expect(trackOne.nftContract).to.equal(nftContractAddress);
    expect(trackOne.artist).to.equal(mintAddress.address);
    expect(trackOne.owner).to.equal(mintAddress.address);
    expect(trackOne.tokenId).to.equal('0');
    expect(trackOne.tokenUri).to.equal(fakeLocationOne);

    expect(numberOfTracksCreated.toString()).to.equal('2');

    const contracOwnerBalanceAfter = await contractDeployAddress.getBalance();

    const expectedMintingProfitToOwner = ethers.utils.parseUnits('2', 'ether');

    expect(contracOwnerBalanceAfter.sub(contracOwnerBalanceBefore)).to.equal(
      expectedMintingProfitToOwner
    );

    expect(await mintedMusic.owner()).to.equal(contractDeployAddress.address);
  });
});
