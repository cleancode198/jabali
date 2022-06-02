import { useEffect, useState } from "react";
import { ethers } from "ethers";

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

import { networks, networkTypes } from "./utils/constants";
import { ddd, getNetworkType } from "./utils/functions";

import rinkeby from "./settings/Client-UnluckySlug-rinkeby.json";
import bscTestnet from "./settings/Client-UnluckySlugBSC-bscTestnet.json";

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

  const [slimometerMultiplier, setSlimometerMultiplier] = useState(1);
  const [referralActivated, setReferralActivated] = useState(false);
  const [prize, setPrize] = useState("slug_sad");

  const [slugLink, setSlugLink] = useState("");

  const [currentPage, setCurrentPage] = useState("LOTTERY");
  const [currentTab, setCurrentTab] = useState("CARDS_SHEET");

  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    process.env.PUBLIC_URL + "/assets/images/interface_elements/background.png"
  );
  const [slugImageUrl, setSlugImageUrl] = useState(
    process.env.PUBLIC_URL +
      "/assets/images/Slug_animated/idle_v02/slug_animation_1.0001 copy.png"
  );

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
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
          console.log("chainChanged", chainId);
          chainId = parseInt(chainId, 16);
          console.log("chainChanged", chainId);
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
        alert("Get MetaMask!");
        return;
      }

      ethereum.request({
        method: "eth_requestAccounts",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkSlimometerMultiplier = async () => {
    let unluckyThrows = await contract.unluckyThrows(currentAccount);
    console.log("unluckyThrows", unluckyThrows);
    unluckyThrows = unluckyThrows.toNumber();
    console.log("unluckyThrows", unluckyThrows);

    if (unluckyThrows < 5) {
      setSlimometerMultiplier(1);
    } else if (unluckyThrows < 20) {
      setSlimometerMultiplier(2);
    } else {
      setSlimometerMultiplier(3);
    }
  };

  const checkReferralActivated = async (moneySpentRequired) => {
    let moneySpent = await contract.moneySpent(currentAccount);
    console.log("moneySpent", moneySpent);
    moneySpent = ethers.utils.formatEther(moneySpent.toBigInt());
    console.log("moneySpent", moneySpent);

    setReferralActivated(moneySpent >= moneySpentRequired);
  };

  const checkNFTs = async () => {};

  // contract events
  const JackPot = (to, value, event) => {
    console.log("event-JackPot", { to, value, event });

    setPrize("slugpot");
  };

  const TicketRepayment = (to, value, event) => {
    console.log("event-TicketRepayment", { to, value, event });

    try {
      let multiplier =
        ethers.utils.formatEther(value.toBigInt()) /
        contracts[currentNetwork].ticketCost;
      setPrize("x" + multiplier);
    } catch (error) {
      console.log(error);
    }
  };

  const DepositNFT = (contractAddress, tokenID, WeiCost, event) => {
    console.log("event-DepositNFT", {
      contractAddress,
      tokenID,
      WeiCost,
      event,
    });

    checkNFTs();
  };

  const WithdrawTopNFT = (player, contractAddress, tokenID, event) => {
    console.log("event-WithdrawTopNFT", {
      player,
      contractAddress,
      tokenID,
      event,
    });

    setPrize("legendary");
  };

  const WithdrawMediumNFT = (player, contractAddress, tokenID, event) => {
    console.log("event-WithdrawMediumNFT", {
      player,
      contractAddress,
      tokenID,
      event,
    });

    setPrize("epic");
  };

  const WithdrawNormalNFT = (player, contractAddress, tokenID, event) => {
    console.log("event-WithdrawNormalNFT", {
      player,
      contractAddress,
      tokenID,
      event,
    });

    setPrize("rare");
  };

  const GoldenTicket = (player, tokenID, event) => {
    console.log("event-GoldenTicket", { player, tokenID, event });

    setPrize("goldenslug");
  };

  useEffect(() => {
    let temp = window.location.href;
    let index = temp.indexOf("0x");
    if (index >= 0) {
      host = temp.substr(0, index);
      referrer = temp.substr(index, 42);
    } else {
      host = temp;
    }
    console.log("host", host);
    console.log("referrer", referrer);

    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    console.log("currentAccount", currentAccount);

    setSlugLink(host + currentAccount);

    if (currentAccount === "") {
      setCurrentNetwork(null);
      setSlimometerMultiplier(1);
    } else {
      let chainId = window.ethereum.networkVersion;
      setCurrentNetwork(chainId !== null ? parseInt(chainId) : chainId);

      if (contract !== undefined) {
        checkSlimometerMultiplier();
      }
    }
  }, [currentAccount]);

  useEffect(() => {
    console.log("currentNetwork", currentNetwork);

    setNetworkType(getNetworkType(currentNetwork));

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

      if (referrer !== "") {
        contract.setReferrer(referrer);
      }

      checkSlimometerMultiplier();
      checkReferralActivated(
        contracts[currentNetwork].moneySpentRequiredToActivateReferral
      );
      checkNFTs();
    } catch (error) {
      console.log(error);
    }
  }, [currentNetwork]);

  useEffect(() => {
    if (
      networkType !== networkTypes.ethereum &&
      currentTab === "AVAILABLE_NFTS"
    ) {
      setCurrentTab("CARDS_SHEET");
    }
  }, [networkType]);

  const playnowClicked = async () => {
    if (backgroundAnimationIndex > 0 || slugAnimationIndex > 0) {
      console.log({ backgroundAnimationIndex, slugAnimationIndex });
      return;
    }

    setCurrentPage("LOTTERY");

    if (currentAccount === "") {
      alert("Please connect wallet!");
      return;
    }

    if (currentNetwork === null || contracts[currentNetwork] === undefined) {
      console.log("currentNetwork is null or undefined", {
        currentNetwork,
        contract: contracts[currentNetwork],
      });
      return;
    }

    setPrize("slug_sad");

    const wsContract = new ethers.Contract(
      contracts[currentNetwork].address,
      contracts[currentNetwork].abi,
      new ethers.providers.WebSocketProvider(
        contracts[currentNetwork].wsProvider
      )
    );

    try {
      if (networkType === networkTypes.ethereum) {
        wsContract.on("JackPot", JackPot);
        wsContract.on("TicketRepayment", TicketRepayment);
        wsContract.on("DepositNFT", DepositNFT);
        wsContract.on("WithdrawTopNFT", WithdrawTopNFT);
        wsContract.on("WithdrawMediumNFT", WithdrawMediumNFT);
        wsContract.on("WithdrawNormalNFT", WithdrawNormalNFT);
        wsContract.on("GoldenTicket", GoldenTicket);
      } else if (networkType === networkTypes.bsc) {
        wsContract.on("JackPot", JackPot);
        wsContract.on("TicketRepayment", TicketRepayment);

        const filter = wsContract.filters.JackPot(currentAccount);
        wsContract.on(filter, JackPot);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const txn = await contract.enterThrow({
        value: ethers.utils.parseEther(
          "" + contracts[currentNetwork].ticketCost
        ),
        gasLimit,
      });
      await txn.wait();

      checkSlimometerMultiplier();
    } catch (error) {
      console.log(error);
      return;
    }

    var backgroundInterval = setInterval(() => {
      if (backgroundAnimationIndex === backgroundImageCount) {
        backgroundAnimationIndex = 0;
        clearInterval(backgroundInterval);
        setCurrentPage("CARD_FLIP");
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
      console.log(
        "JackPot logs",
        await wsContract.queryFilter(wsContract.filters.JackPot(currentAccount))
      );
      console.log(
        "TicketRepayment logs",
        await wsContract.queryFilter(
          wsContract.filters.TicketRepayment(currentAccount)
        )
      );
    } catch (error) {
      console.log(error);
    }
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
        onNavChanged={onNavChanged}
        connectWallet={connectWallet}
        currentAccount={currentAccount}
        networkType={networkType}
        currentPage={currentPage}
      />
      <Slimometer
        slimometerMultiplier={slimometerMultiplier}
        onSlimometerClicked={onSlimometerClicked}
      />
      <ImageButton
        className="play-now-btn"
        onClicked={playnowClicked}
        imgUrl={
          process.env.PUBLIC_URL +
          "/assets/images/interface_elements/playnow.png"
        }
      />
      {currentNetwork !== null && networkType === networkTypes.ethereum && (
        <div className="ticket-cost">
          {contracts[currentNetwork].ticketCost} ETH
        </div>
      )}
      {currentNetwork !== null && networkType === networkTypes.bsc && (
        <div className="ticket-cost">
          {contracts[currentNetwork].ticketCost} BNB
        </div>
      )}
      {currentPage === "CARD_FLIP" && (
        <CardFlip prize={prize} onNavChanged={onNavChanged} />
      )}
      {currentPage === "ROADMAP" && <Roadmap />}
      {currentPage === "FAQS" && <Faqs />}
      {currentPage === "SLIMOMETER" && <SlimometerModal />}
      {currentPage === "SLUG_FRIEND" && (
        <SlugFriend slugLink={slugLink} referralActivated={referralActivated} />
      )}
      {currentPage === "SLUG_SHEET" && (
        <SlugSheetModal
          currentTab={currentTab}
          onTabChanged={onTabChanged}
          networkType={networkType}
        />
      )}
      {currentPage === "MENU" && (
        <Menu
          onNavChanged={onNavChanged}
          connectWallet={connectWallet}
          currentAccount={currentAccount}
        />
      )}
    </div>
  );
}

export default App;
