import "../styles/imagebutton.css";

export function ImageButton({ className, onClicked, imgUrl }) {
  return (
    <button className={"image-btn " + className} onClick={onClicked}>
      <img src={imgUrl} />
    </button>
  );
}
