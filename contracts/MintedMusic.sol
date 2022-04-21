//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./MusicMakerNFT.sol";

contract MintedMusic is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _marketItemIds;
  Counters.Counter private _trackIds;
  Counters.Counter private _itemsSold;
//   Counters.Counter private _uniqueTracksMinted;

  address payable public owner;
  uint256 public marketListingPrice = 1 ether; // 1 matic
  uint256 public trackListingPrice = 1 ether; // 1 matic

  constructor() {
    owner = payable(msg.sender);
  }

  struct TrackListing {
    uint256 trackId;
    address nftContract;
    uint256 tokenId;
    address payable artist;
    address payable owner;
  }
  
  struct MarketItem {
    uint256 itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => TrackListing) private idToTrackListing;
  mapping(uint256 => MarketItem) private idToMarketItem;

  event TrackListingCreated(
    uint256 indexed trackId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address artist,
    address owner
  );

  event MarketItemCreated(
    uint256 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
    require(owner == msg.sender, "Ccaller is not the owner");
    _;
    }

  function getMarketListingPrice() public view returns (uint256) {
    return marketListingPrice;
  }

  function getTrackListingPrice() public view returns (uint256) {
    return trackListingPrice;
  }

  function getMarketItemIds() public view returns (uint256) {
    return _marketItemIds.current();
  }

  function getNumTrackListings() public view returns (uint256) {
    return _trackIds.current();
  }

  function getItemsSold() public view returns (uint256) {
    return _itemsSold.current();
  }

  function getUnsoldItemsCount() public view returns (uint256) {
    uint256 itemCount = getMarketItemIds();
    uint256 itemsSold = getItemsSold();
    uint256 unsoldItemCount = itemCount - itemsSold;

    return unsoldItemCount;
  }

  
  function createTrackListing(
    address nftContract,
    uint256 tokenId
  ) public payable nonReentrant {
    require(msg.value >= trackListingPrice, "Price must be equal to listing price");

    uint256 trackId = _trackIds.current();
    _trackIds.increment();

    idToTrackListing[trackId] = TrackListing(
      trackId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(msg.sender)
    );

    // MusicMakerNFT tokenContract = MusicMakerNFT(nftContract);

    // tokenContract.safeTransferFrom(msg.sender, address(this), tokenId);

    payable(owner).transfer(msg.value);

    emit TrackListingCreated(
      trackId,
      nftContract,
      tokenId,
      msg.sender,
      msg.sender
    );
  }

    /* Places an item for sale on the marketplace */
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == marketListingPrice, "Price must be equal to listing price");

    uint256 itemId = _marketItemIds.current();
    _marketItemIds.increment();

    idToMarketItem[itemId] = MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );

    MusicMakerNFT tokenContract = MusicMakerNFT(nftContract);

    tokenContract.safeTransferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  function fetchTrackListings() public view returns (TrackListing[] memory) {
    uint256 trackCount = _trackIds.current();

    TrackListing[] memory tracks = new TrackListing[](trackCount);
    for (uint256 i = 0; i < trackCount; i++) {
        TrackListing storage currentTrack = idToTrackListing[i];
        tracks[i] = currentTrack;
    }
    return tracks;
  }

   function getContractBalance() public view onlyOwner returns (uint256 balance) {
        return address(this).balance;
    }
}
