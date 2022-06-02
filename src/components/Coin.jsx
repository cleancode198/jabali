import "../styles/coin.css";

export function Coin({ networkType }) {
  const coins = ["coin", "coin_eth", "coin_bnb"];

  return (
    <img
      className="coin"
      src={
        process.env.PUBLIC_URL +
        "/assets/images/interface_elements/" +
        coins[networkType + 1] +
        ".png"
      }
    />
  );
}
