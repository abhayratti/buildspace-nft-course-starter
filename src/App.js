import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './styles/App.css';
import MyNFT from './utils/mynft.json'
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'abhayratti';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletConnected = () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Get Metamask!");
      return;
    } else {
      console.log("Ethereum object ✅", ethereum);
    }

    const accounts = ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No account found");
    }
  }

  // connect wallet code
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("You need MetaMask!!!!");
        return;
      }  

      // request access to account
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // print public address
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }
  
  // smart contract
  const askContractToMintNFT = async () => {
    const CONTRACT_ADDRESS = "0x3ea2017fa2a0cC28d05934a7cAB80a07D8994356";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.provder.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyNFT.abi, signer);
        
        console.log("Pop up to pay gas...")
        let nftTxn = await connectedContract.mintNFT();

        console.log("Mining...")
        await nftTxn.wait();

        console.log("Success! See transaction:  https://rinkeby.etherscan.io/tx/${nftTxn.hash}");

      } else {
        console.log("Ethereum object don't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNFT} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
