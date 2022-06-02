// generate image names for preload

const ddd = (num) => {
  if (num >= 100) return "" + num;
  if (num >= 10) return "0" + num;
  return "00" + num;
};

for (let i = 1; i <= 64; i++) {
  console.log(`<link
      rel="preload"
      as="image"
      href="%PUBLIC_URL%/assets/images/Slug_animated/idle_v02/slug_animation_1.0${ddd(
        i
      )} copy.png"
    />`);
}
