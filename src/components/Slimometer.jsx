import "../styles/slimometer.css";

export function Slimometer({ slimometerMultiplier, onSlimometerClicked }) {
  return (
    <div className="slimometer" onClick={() => onSlimometerClicked()}>
      <img
        src={
          process.env.PUBLIC_URL +
          "/assets/images/interface_elements/slimometerx" +
          slimometerMultiplier +
          ".png"
        }
      />
    </div>
  );
}
