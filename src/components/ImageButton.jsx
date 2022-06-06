import "../styles/imagebutton.css";

export function ImageButton({ className, imgUrl, onClicked }) {
  return (
    <button className={"image-btn " + className} onClick={onClicked}>
      <img src={imgUrl} />
    </button>
  );
}
