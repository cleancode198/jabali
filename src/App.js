import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

import "./App.css";

import { Background, Header, Slimometer, ImageButton } from "./components";
import {
  CardFlip,
  Roadmap,
  Faqs,
  SlimometerModal,
  SlugFriend,
  SlugSheetModal,
  Menu,
} from "./components";

import { networks, networkTypes, openseaUrls } from "./utils/constants";
import { ddd, getCostUnit, getNetworkType } from "./utils/functions";

import rinkeby from "./settings/UnluckySlug-rinkeby.json";
import bscTestnet from "./settings/UnluckySlugBSC-bscTestnet.json";

import erc721Abi from "./settings/ERC721abi.json";

const gasLimit = 10000000;

const backgroundImageCount = 64;
const backgroundAnimationDuration = 5;
const slugImageCount = 79;
const slugAnimationDuration = 5;

var backgroundAnimationIndex = 0;
var slugAnimationIndex = 0;

var host = "";
var referrer = "";

var contracts = {}; // contract information object

contracts[networks.rinkeby] = rinkeby;
contracts[networks.bscTestnet] = bscTestnet;

var contract;

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [networkType, setNetworkType] = useState(-1);

  const [ticketCost, setTicketCost] = useState(0);
  const [jackPotBalance, setJackPotBalance] = useState(0);
  const [slimometerMultiplier, setSlimometerMultiplier] = useState(1);
  const [slugLink, setSlugLink] = useState("");
  const [referralActivated, setReferralActivated] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [prize, setPrize] = useState("slug_sad");

  const [currentPage, setCurrentPage] = useState("LOTTERY");
  const [currentTab, setCurrentTab] = useState("CARDS_SHEET");

  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    process.env.PUBLIC_URL + "/assets/images/interface_elements/background.png"
  );
  const [slugImageUrl, setSlugImageUrl] = useState(
    process.env.PUBLIC_URL +
      "/assets/images/Slug_animated/idle_v02/slug_animation_1.0001 copy.png"
  );
  const [cardFlipStep, setCardFlipStep] = useState("NOT_STARTED");
  const [nftImage, setNftImage] = useState("");

  useEffect(() => {
    let temp = window.location.href;
    let index = temp.indexOf("0x");
    if (index >= 0) {
      host = temp.substr(0, index);
      referrer = temp.substr(index, 42);
    } else {
      host = temp;
    }
    // console.log("host", host);
    // console.log("referrer", referrer);

    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    // console.log("currentAccount + currentNetwork");

    if (currentNetwork === null || contracts[currentNetwork] === undefined)
      return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(
        contracts[currentNetwork].address,
        contracts[currentNetwork].abi,
        signer
      );

      if (referrer !== "" && referrer !== currentAccount) {
        contract.referralToReferrer(currentAccount).then((data) => {
          console.log("referrer", data);
          if (data === "0x0000000000000000000000000000000000000000") {
            contract.setReferrer(referrer, {
              value: 0,
              gasLimit,
            });
          }
        });
      }

      contract.ticketCost().then((data) => {
        let amount = Number(ethers.utils.formatEther(data.toBigInt()));
        // console.log("ticketCost", { data, amount });
        setTicketCost(amount);
      });
      checkJackPotBalance();
      checkSlimometerMultiplier();
      checkReferralActivated();
      if (getNetworkType(currentNetwork) === networkTypes.ethereum) {
        checkNfts();
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentAccount, currentNetwork]);

  useEffect(() => {
    // console.log("currentAccount", currentAccount);

    setSlugLink(host + currentAccount);

    if (!currentAccount) {
      setCurrentNetwork(null);
      setSlimometerMultiplier(1);
    } else {
      let chainId = window.ethereum.networkVersion;
      setCurrentNetwork(chainId === null ? null : parseInt(chainId));
    }
  }, [currentAccount]);

  useEffect(() => {
    // console.log("currentNetwork", currentNetwork);

    let tNetworkType = getNetworkType(currentNetwork);
    setNetworkType(tNetworkType);
  }, [currentNetwork]);

  useEffect(() => {
    if (
      networkType !== networkTypes.ethereum &&
      currentTab === "AVAILABLE_NFTS"
    ) {
      setCurrentTab("CARDS_SHEET");
    }
  }, [networkType]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        // console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        // console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        let chainId = ethereum.networkVersion;
        setCurrentNetwork(chainId !== null ? parseInt(chainId) : chainId);
      } else {
        console.log("No authorized account found");
      }

      ethereum.on("accountsChanged", function (accounts) {
        console.log("accountsChanged", accounts);
        let wallet = accounts[0];
        if (wallet) {
          setCurrentAccount(wallet);
        } else {
          setCurrentAccount("");
        }
      });
      ethereum.on("chainChanged", function (chainId) {
        try {
          // console.log("chainChanged", chainId);
          chainId = parseInt(chainId, 16);
          // console.log("chainChanged", chainId);
          setCurrentNetwork(chainId);
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        // alert("Get MetaMask!");
        return;
      }

      ethereum.request({
        method: "eth_requestAccounts",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkJackPotBalance = () => {
    contract.jackPotBalance().then((data) => {
      let amount = Number(ethers.utils.formatEther(data.toBigInt()));
      // console.log("jackPotBalance", { data, amount });
      setJackPotBalance(amount);
    });
  };

  const checkSlimometerMultiplier = () => {
    contract.unluckyThrows(currentAccount).then((data) => {
      let unluckyThrows = data.toNumber();
      // console.log("unluckyThrows", { data, unluckyThrows });

      if (unluckyThrows < 5) {
        setSlimometerMultiplier(1);
      } else if (unluckyThrows < 20) {
        setSlimometerMultiplier(2);
      } else {
        setSlimometerMultiplier(3);
      }
    });
  };

  const checkReferralActivated = () => {
    contract.moneySpent(currentAccount).then((data) => {
      let moneySpent = ethers.utils.formatEther(data.toBigInt());
      // console.log("moneySpent", { data, moneySpent });

      setReferralActivated(
        moneySpent >=
          contracts[currentNetwork].moneySpentRequiredToActivateReferral
      );
    });
  };

  const convertNft = (nft) => {
    let address = nft.contractAddress;
    let tokenId = nft.tokenID.toNumber();
    let cost = Number(ethers.utils.formatEther(nft.weiCost.toBigInt()));

    let url = "";
    if (openseaUrls[currentNetwork]) {
      url = openseaUrls[currentNetwork] + address + "/" + tokenId;
    }

    return {
      address,
      tokenId,
      cost,
      url,
    };
  };

  const getNftImage = async (address, tokenId) => {
    let image = null;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const nftContract = new ethers.Contract(address, erc721Abi, provider);

      const tokenURI = await nftContract.tokenURI(tokenId);
      image = (await axios.get(tokenURI)).data.image;
    } catch (error) {
      // console.log(error);
    }
    return image;
  };

  const indexOf = (nfts, address, tokenId) => {
    for (let i = 0; i < nfts.length; i++) {
      if (nfts[i].address === address && nfts[i].tokenId === tokenId) {
        return i;
      }
    }
    return -1;
  };

  const checkNfts = async () => {
    let tNfts = nfts;

    let sumWeiCostTopNFTs = await contract.sumWeiCostTopNFTs();
    let averageWeiCostTopNFTs = await contract.averageWeiCostTopNFTs();
    let index,
      length =
        averageWeiCostTopNFTs === 0
          ? 0
          : sumWeiCostTopNFTs / averageWeiCostTopNFTs;
    for (index = 0; index < length; index++) {
      let nft = await contract.topNFTs(index);
      nft = convertNft(nft);
      if (indexOf(tNfts, nft.address, nft.tokenId) === -1) {
        let image = await getNftImage(nft.address, nft.tokenId);
        nft = { type: "legendary", image, ...nft };
        setNfts(tNfts.concat(nft));
        tNfts.push(nft);
      }
    }

    let sumWeiCostMediumNFTs = await contract.sumWeiCostMediumNFTs();
    let averageWeiCostMediumNFTs = await contract.averageWeiCostMediumNFTs();
    length =
      averageWeiCostMediumNFTs === 0
        ? 0
        : sumWeiCostMediumNFTs / averageWeiCostMediumNFTs;
    for (index = 0; index < length; index++) {
      let nft = await contract.mediumNFTs(index);
      nft = convertNft(nft);
      if (indexOf(tNfts, nft.address, nft.tokenId) === -1) {
        let image = await getNftImage(nft.address, nft.tokenId);
        nft = { type: "epic", image, ...nft };
        setNfts(tNfts.concat(nft));
        tNfts.push(nft);
      }
    }

    let sumWeiCostNormalNFTs = await contract.sumWeiCostNormalNFTs();
    let averageWeiCostNormalNFTs = await contract.averageWeiCostNormalNFTs();
    length =
      averageWeiCostNormalNFTs === 0
        ? 0
        : sumWeiCostNormalNFTs / averageWeiCostNormalNFTs;
    for (index = 0; index < length; index++) {
      let nft = await contract.normalNFTs(index);
      nft = convertNft(nft);
      if (indexOf(tNfts, nft.address, nft.tokenId) === -1) {
        let image = await getNftImage(nft.address, nft.tokenId);
        nft = { type: "rare", image, ...nft };
        setNfts(tNfts.concat(nft));
        tNfts.push(nft);
      }
    }
  };

  // contract events
  const JackPot = (to, value, event) => {
    // console.log("event-JackPot", { to, value, event });

    setPrize("slugpot");
    setCardFlipStep("PRIZE");
    setJackPotBalance(0);
  };

  const TicketRepayment = (to, value, event) => {
    // console.log("event-TicketRepayment", { to, value, event });

    if (ticketCost > 0) {
      let multiplier = ethers.utils.formatEther(value.toBigInt()) / ticketCost;
      setPrize("x" + multiplier);
      setCardFlipStep("PRIZE");
    }
  };

  const WithdrawTopNFT = (player, contractAddress, tokenID, event) => {
    // console.log("event-WithdrawTopNFT", {
    //   player,
    //   contractAddress,
    //   tokenID,
    //   event,
    // });

    let index = indexOf(nfts, contractAddress, tokenID);
    if (index >= 0) {
      setNftImage(nfts[index].image);
      setNfts(nfts.slice(0, index).concat(nfts.slice(index + 1)));
    }
    setPrize("legendary");
    setCardFlipStep("PRIZE");
  };

  const WithdrawMediumNFT = (player, contractAddress, tokenID, event) => {
    // console.log("event-WithdrawMediumNFT", {
    //   player,
    //   contractAddress,
    //   tokenID,
    //   event,
    // });

    let index = indexOf(nfts, contractAddress, tokenID);
    if (index >= 0) {
      setNftImage(nfts[index].image);
      setNfts(nfts.slice(0, index).concat(nfts.slice(index + 1)));
    }
    setPrize("epic");
    setCardFlipStep("PRIZE");
  };

  const WithdrawNormalNFT = (player, contractAddress, tokenID, event) => {
    // console.log("event-WithdrawNormalNFT", {
    //   player,
    //   contractAddress,
    //   tokenID,
    //   event,
    // });

    let index = indexOf(nfts, contractAddress, tokenID);
    if (index >= 0) {
      setNftImage(nfts[index].image);
      setNfts(nfts.slice(0, index).concat(nfts.slice(index + 1)));
    }
    setPrize("rare");
    setCardFlipStep("PRIZE");
  };

  const GoldenTicket = (player, tokenID, event) => {
    // console.log("event-GoldenTicket", { player, tokenID, event });

    setPrize("goldenslug");
    setCardFlipStep("PRIZE");
  };

  // click functions
  const playnowClicked = async () => {
    if (backgroundAnimationIndex > 0 || slugAnimationIndex > 0) {
      console.log({ backgroundAnimationIndex, slugAnimationIndex });
      return;
    }

    if (currentAccount === "") {
      // alert("Please connect wallet!");
      return;
    }

    if (currentNetwork === null || contracts[currentNetwork] === undefined) {
      console.log("currentNetwork is null or contract undefined", {
        currentNetwork,
        contract: contracts[currentNetwork],
      });
      return;
    }

    if (ticketCost === 0) {
      console.log("ticketCost is 0");
      return;
    }

    setPrize("slug_sad");
    setNftImage("");
    setCurrentPage("LOTTERY");

    var backgroundInterval = setInterval(() => {
      if (backgroundAnimationIndex === backgroundImageCount) {
        backgroundAnimationIndex = 0;
        setCurrentPage("CARD_FLIP");
        setCardFlipStep("FLIPPING");
        clearInterval(backgroundInterval);
        return;
      }

      setBackgroundImageUrl(
        `${process.env.PUBLIC_URL}/assets/images/Roulette_animation/${
          backgroundAnimationIndex + 1
        }.png`
      );

      backgroundAnimationIndex++;
    }, (backgroundAnimationDuration * 1000.0) / backgroundImageCount);

    var slugInterval = setInterval(() => {
      if (slugAnimationIndex === slugImageCount) {
        slugAnimationIndex = 0;
        clearInterval(slugInterval);
        return;
      }

      setSlugImageUrl(
        `${
          process.env.PUBLIC_URL
        }/assets/images/Slug_animated/idle_v02/slug_animation_1.0${ddd(
          slugAnimationIndex + 1
        )} copy.png`
      );

      slugAnimationIndex++;
    }, (slugAnimationDuration * 1000.0) / slugImageCount);

    try {
      const wsContract = new ethers.Contract(
        contracts[currentNetwork].address,
        contracts[currentNetwork].abi,
        new ethers.providers.WebSocketProvider(
          contracts[currentNetwork].wsProvider
        )
      );

      wsContract.on(wsContract.filters.JackPot(currentAccount), JackPot);
      wsContract.on(
        wsContract.filters.TicketRepayment(currentAccount),
        TicketRepayment
      );
      if (networkType === networkTypes.ethereum) {
        wsContract.on(
          wsContract.filters.WithdrawTopNFT(currentAccount),
          WithdrawTopNFT
        );
        wsContract.on(
          wsContract.filters.WithdrawMediumNFT(currentAccount),
          WithdrawMediumNFT
        );
        wsContract.on(
          wsContract.filters.WithdrawNormalNFT(currentAccount),
          WithdrawNormalNFT
        );
        wsContract.on(
          wsContract.filters.GoldenTicket(currentAccount),
          GoldenTicket
        );
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const txn = await contract.enterThrow({
        value: ethers.utils.parseEther("" + ticketCost),
        gasLimit,
      });
      await txn.wait();
    } catch (error) {
      console.log(error);
      setCurrentPage("LOTTERY");
      setCardFlipStep("END");
      return;
    }

    checkJackPotBalance();
    checkSlimometerMultiplier();
  };

  const onNavChanged = (changedNav) => {
    setCurrentPage(changedNav);
  };

  const onTabChanged = (changedTab) => {
    setCurrentTab(changedTab);
  };

  const onSlimometerClicked = () => {
    setCurrentPage(currentPage !== "SLIMOMETER" ? "SLIMOMETER" : "LOTTERY");
  };

  return (
    <div className="App">
      <Background
        backgroundImageUrl={backgroundImageUrl}
        slugImageUrl={slugImageUrl}
        onNavChanged={onNavChanged}
      />
      <Header
        currentAccount={currentAccount}
        networkType={networkType}
        currentPage={currentPage}
        onNavChanged={onNavChanged}
        connectWallet={connectWallet}
      />
      <Slimometer
        slimometerMultiplier={slimometerMultiplier}
        onSlimometerClicked={onSlimometerClicked}
      />
      <ImageButton
        className="play-now-btn"
        imgUrl={
          process.env.PUBLIC_URL +
          "/assets/images/interface_elements/playnow.png"
        }
        onClicked={playnowClicked}
      />
      {currentNetwork !== null && (
        <>
          <div className="ticket-cost">
            {ticketCost + " " + getCostUnit(networkType)}
          </div>
          <div className="jackpot-balance">
            {jackPotBalance + " " + getCostUnit(networkType)}
          </div>
        </>
      )}
      <CardFlip
        currentPage={currentPage}
        prize={prize}
        cardFlipStep={cardFlipStep}
        nftImage={nftImage}
        onNavChanged={onNavChanged}
        setCardFlipStep={setCardFlipStep}
      />
      {currentPage === "ROADMAP" && <Roadmap />}
      {currentPage === "FAQS" && <Faqs />}
      {currentPage === "SLIMOMETER" && <SlimometerModal />}
      {currentPage === "SLUG_FRIEND" && (
        <SlugFriend slugLink={slugLink} referralActivated={referralActivated} />
      )}
      {currentPage === "SLUG_SHEET" && (
        <SlugSheetModal
          currentTab={currentTab}
          networkType={networkType}
          nfts={nfts}
          onTabChanged={onTabChanged}
        />
      )}
      {currentPage === "MENU" && (
        <Menu
          currentAccount={currentAccount}
          onNavChanged={onNavChanged}
          connectWallet={connectWallet}
        />
      )}
    </div>
  );
}

export default App;
