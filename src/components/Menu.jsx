import "../styles/menu.css";

export function Menu({ currentAccount, onNavChanged, connectWallet }) {
  return (
    <>
      <div
        className="overlay"
        onClick={() => {
          onNavChanged("LOTTERY");
        }}
      ></div>
      <div className="menu-container">
        <div
          className="menu-item"
          onClick={() => {
            onNavChanged("SLUG_SHEET");
          }}
        >
          Slug Sheet
        </div>
        <div
          className="menu-item"
          onClick={() => {
            onNavChanged("LOTTERY");
          }}
        >
          Lottery
        </div>
        <div
          className="menu-item"
          onClick={() => {
            onNavChanged("ROADMAP");
          }}
        >
          Roadmap
        </div>
        <div
          className="menu-item"
          onClick={() => {
            onNavChanged("FAQS");
          }}
        >
          Faqs
        </div>
        {!currentAccount ? (
          <div
            className="menu-item"
            onClick={() => {
              onNavChanged("LOTTERY");
              connectWallet();
            }}
          >
            Connect Wallet
          </div>
        ) : (
          <div
            className="menu-item"
            onClick={() => {
              onNavChanged("SLUG_FRIEND");
            }}
          >
            Slug a friend
          </div>
        )}
      </div>
    </>
  );
}
