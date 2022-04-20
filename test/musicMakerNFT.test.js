const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MusicMakerNFT', function () {
  it("Should return the new nft once it's deployed", async function () {
    const fakePlatformAddress = '0x400830aC1BC7956ae4b81C2658d9CC08824FEaEB';

    const MusicMakerNFT = await ethers.getContractFactory('MusicMakerNFT');
    const musicMakerNft = await MusicMakerNFT.deploy(fakePlatformAddress);
    await musicMakerNft.deployed();

    expect(await musicMakerNft.platformContractAddress()).to.equal(
      fakePlatformAddress
    );

    expect(await musicMakerNft.MAX_SINGLE_MINT()).to.equal('10');
  });

  it('Should mint a single nft, pay the fees and store the provided URI', async function () {
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
});
