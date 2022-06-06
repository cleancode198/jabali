import "../styles/header.css";

import { SlugSheet } from "./SlugSheet";
import { Navbar } from "./Navbar";
import { Coin } from "./Coin";
import { ImageButton } from "./ImageButton";

export function Header({
  currentAccount,
  networkType,
  currentPage,
  onNavChanged,
  connectWallet,
}) {
  return (
    <div>
      <div
        className="menu"
        onClick={() => {
          onNavChanged("MENU");
        }}
      ></div>
      <SlugSheet onNavChanged={onNavChanged} currentPage={currentPage} />
      <Navbar onNavChanged={onNavChanged} currentPage={currentPage} />
      <img
        className="title"
        src={
          process.env.PUBLIC_URL +
          "/assets/images/interface_elements/titlle.png"
        }
        onClick={() => {
          onNavChanged("LOTTERY");
        }}
      />
      <div className="wallet">
        <Coin networkType={networkType} />
        {!currentAccount ? (
          <ImageButton
            className="connect-wallet-btn"
            imgUrl={
              process.env.PUBLIC_URL +
              "/assets/images/interface_elements/connectwallet.png"
            }
            onClicked={connectWallet}
          />
        ) : (
          <>
            <span
              className={
                currentPage === "SLUG_FRIEND"
                  ? "slug-friend nav-item-selected"
                  : "slug-friend"
              }
              onClick={() => {
                onNavChanged("SLUG_FRIEND");
              }}
            >
              SLUG A FRIEND
            </span>
            <span className="address">
              {(
                currentAccount.substring(0, 6) +
                "..." +
                currentAccount.slice(-5)
              ).toUpperCase()}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
