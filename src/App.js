import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './styles/App.css';
import MyNFT from './utils/mynft.json';
import twitterLogo from './assets/twitter-logo.svg';

const TWITTER_HANDLE = 'abhayratti';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/your-true-fortune-v3';
const CONTRACT_ADDRESS = "0x10f026F9f8C1482d3bE51349C61a8D21aC5E5A19";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Get Metamask!");
      return;
    } else {
      console.log("Ethereum object ✅", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener();
    } else {
      console.log("No account found");
    }
  }

  // connect wallet code
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener(); 
    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyNFT.abi, signer);

        connectedContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(`We have minted your NFT and sent it to your wallet. Here is the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
        });

        console.log("Setup event listener")
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  // smart contract
  const askContractToMintNFT = async () => {
    
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyNFT.abi, signer);
        
        console.log("Pop up to pay gas...")
        let nftTxn = await connectedContract.mintNFT();

        console.log("Mining...")
        await nftTxn.wait();

        console.log("Success! See transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}");

      } else {
        console.log("Ethereum object don't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletConnected();
  }, [])

  // render methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button mint-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNFT} className="cta-button mint-button">
      Mint NFT!
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Your Fortune</p>
          <p className="sub-text">
            Wanna know your fortune? Mint an NFT and find out what the future has in store for you...
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div>
        <button className="cta-button connect-wallet-button">
        <a
            className="footer-text"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >{`View NFT Collection`}</a>
        </button>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
