import "../styles/availablenfts.css";

export function AvailableNfts({ nfts }) {
  return (
    <div className="available-nfts">
      {nfts.map((nft, index) => {
        return (
          <div className="nft" key={index}>
            <img
              className="nft-frame"
              src={
                process.env.PUBLIC_URL +
                "/assets/images/Nft_cards/" +
                nft.type +
                ".png"
              }
            />
            {/* <img className="nft-card" src="" /> */}
            <div className="nft-info">
              <span className="left">{nft.tokenId}</span>
              <span className="right">{nft.cost}</span>
            </div>
            <a className="view-on-opensea" href={nft.url} target="_blank"></a>
          </div>
        );
      })}
    </div>
  );
}
