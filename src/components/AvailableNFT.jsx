import "../styles/availablenft.css";

export function AvailableNFT() {
  const nfts = [
    { type: "legendary" },
    { type: "legendary" },
    { type: "rare" },
    { type: "rare" },
    { type: "rare" },
    { type: "rare" },
    { type: "epic" },
    { type: "epic" },
    { type: "epic" },
    { type: "epic" },
  ];

  return (
    <div className="available-nfts">
      {nfts.map((nft, index) => {
        return (
          <img
            className="nft"
            key={index}
            src={
              process.env.PUBLIC_URL +
              "/assets/images/Nft_cards/" +
              nft.type +
              ".png"
            }
          />
        );
      })}
    </div>
  );
}
