import { useState } from "react";

import "../styles/cardflip.css";

import { ddd } from "../utils/functions";

var flipCardAnimationIndex = 0;

export function CardFlip({ prize, onNavChanged }) {
  const [flipCardImageUrl, setFlipCardImageUrl] = useState(
    process.env.PUBLIC_URL +
      "/assets/images/Card_flip/card_flip_1.1001 copy.png"
  );
  const [prizeStep, setPrizeStep] = useState(0);

  const flipCardImageCount = 121;
  const flipCardAnimationDuration = 5;

  const flipCard = () => {
    if (flipCardAnimationIndex > 0) return;
    if (prizeStep > 0) {
      onNavChanged("LOTTERY");
      return;
    }

    var flipCardInterval = setInterval(() => {
      if (flipCardAnimationIndex === flipCardImageCount) {
        flipCardAnimationIndex = 0;
        clearInterval(flipCardInterval);
        setPrizeStep(prizeStep + 1);
        return;
      }

      setFlipCardImageUrl(
        `${process.env.PUBLIC_URL}/assets/images/Card_flip/card_flip_1.1${ddd(
          flipCardAnimationIndex + 1
        )} copy.png`
      );

      flipCardAnimationIndex++;
    }, (flipCardAnimationDuration * 1000.0) / flipCardImageCount);
  };

  return (
    <div>
      <div id="overlay" className="overlay" onClick={flipCard}></div>
      <img className="card-flip" src={flipCardImageUrl} onClick={flipCard} />
      {prizeStep === 1 && (
        <img
          className="prize"
          src={
            process.env.PUBLIC_URL + "/assets/images/Cards/" + prize + ".jpg"
          }
          onClick={flipCard}
        />
      )}
    </div>
  );
}
