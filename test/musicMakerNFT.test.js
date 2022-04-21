const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MusicMakerNFT', () => {
  it('Should set the platformContractAddress', async () => {
    const fakePlatformAddress = '0x400830aC1BC7956ae4b81C2658d9CC08824FEaEB';

    const MusicMakerNFT = await ethers.getContractFactory('MusicMakerNFT');
    const musicMakerNft = await MusicMakerNFT.deploy(fakePlatformAddress);
    await musicMakerNft.deployed();

    expect(await musicMakerNft.platformContractAddress()).to.equal(
      fakePlatformAddress
    );

    expect(await musicMakerNft.MAX_SINGLE_MINT()).to.equal('10');
  });

  it('Should mint a single nft, pay the fees and store the provided URI', async () => {
    const fakePlatformAddress = '0x400830aC1BC7956ae4b81C2658d9CC08824FEaEB';
    const fakeLocationOne = 'https://www.mytokenlocation.com';
    const fakeLocationTwo = 'https://www.mytokenlocation2.com';

    const MusicMakerNFT = await ethers.getContractFactory('MusicMakerNFT');
    const musicMakerNft = await MusicMakerNFT.deploy(fakePlatformAddress);
    await musicMakerNft.deployed();

    let publicMintingPrice = await musicMakerNft.PUBLIC_MINTING_PRICE();
    publicMintingPrice = publicMintingPrice.toString();

    await musicMakerNft.mint(fakeLocationOne, 1, {
      value: publicMintingPrice
    });
    await musicMakerNft.mint(fakeLocationTwo, 1, {
      value: publicMintingPrice
    });

    const contractBalance = await musicMakerNft.getContractBalance();
    const expectedBalance = ethers.utils.parseUnits('2', 'ether');
    expect(contractBalance.toString()).to.equal(expectedBalance);

    const firstTokenURI = await musicMakerNft.tokenURI(0);
    const secondTokenURI = await musicMakerNft.tokenURI(1);

    expect(firstTokenURI).to.equal(fakeLocationOne);
    expect(secondTokenURI).to.equal(fakeLocationTwo);
  });

  it('Should mint 10 nfts to the same URI', async () => {
    const fakePlatformAddress = '0x400830aC1BC7956ae4b81C2658d9CC08824FEaEB';
    const fakeLocationOne = 'https://www.mytokenlocation.com';

    const MusicMakerNFT = await ethers.getContractFactory('MusicMakerNFT');
    const musicMakerNft = await MusicMakerNFT.deploy(fakePlatformAddress);
    await musicMakerNft.deployed();

    let publicMintingPrice = await musicMakerNft.PUBLIC_MINTING_PRICE();
    publicMintingPrice = (Number(publicMintingPrice) * 10).toString();

    await musicMakerNft.mint(fakeLocationOne, 10, {
      value: publicMintingPrice
    });

    const contractBalance = await musicMakerNft.getContractBalance();
    const expectedBalance = ethers.utils.parseUnits('10', 'ether');
    expect(contractBalance.toString()).to.equal(expectedBalance);

    const firstTokenURI = await musicMakerNft.tokenURI(0);
    const secondTokenURI = await musicMakerNft.tokenURI(4);
    const lastTokenURI = await musicMakerNft.tokenURI(9);

    expect(firstTokenURI).to.equal(fakeLocationOne);
    expect(secondTokenURI).to.equal(fakeLocationOne);
    expect(lastTokenURI).to.equal(fakeLocationOne);
  });

  it('Should revert if trying to mint > MAX_PUBLIC_MINT', async () => {
    const fakePlatformAddress = '0x400830aC1BC7956ae4b81C2658d9CC08824FEaEB';
    const fakeLocationOne = 'https://www.mytokenlocation.com';

    const MusicMakerNFT = await ethers.getContractFactory('MusicMakerNFT');
    const musicMakerNft = await MusicMakerNFT.deploy(fakePlatformAddress);
    await musicMakerNft.deployed();

    let publicMintingPrice = await musicMakerNft.PUBLIC_MINTING_PRICE();
    publicMintingPrice = (Number(publicMintingPrice) * 11).toString();

    await expect(
      musicMakerNft.mint(fakeLocationOne, 11, {
        value: publicMintingPrice
      })
    ).to.be.revertedWith('Music :: Cannot mine more than 10 at a time!');
  });
});
