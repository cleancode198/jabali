import "../styles/background.css";

export function Background({ backgroundImageUrl, slugImageUrl, onNavChanged }) {
  return (
    <div>
      <img className="background" src={backgroundImageUrl} />
      <img
        className="slug"
        src={slugImageUrl}
        onClick={() => {
          onNavChanged("LOTTERY");
        }}
      />
    </div>
  );
}
