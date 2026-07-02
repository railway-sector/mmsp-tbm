import "../index.css";

const RippleImage = (props: any) => {
  //   const width = Number(props.width ?? 0) * 2;
  //   const height = Number(props.height ?? 0) * 2;

  const width = props.height * 0.1;
  const height = props.width * 0.1;
  const wave = document.querySelector<HTMLElement>(".ripple-container");

  if (wave) {
    wave.style.width = `${width * 75}px`;
    wave.style.height = `${height * 53}px`;
  }

  return (
    <div className="ripple-container">
      {/* Expanding Ripple Waves */}
      <div className="ripple-wave wave-1"></div>
      <div className="ripple-wave wave-2"></div>
      <div className="ripple-wave wave-3"></div>
      {/* Main Image */}
      <img
        src="https://EijiGorilla.github.io/Symbols/TBM_LOGO2.png"
        alt="User Profile"
        className="profile-img"
        height={`${height * 31}px`}
        width={`${width * 31}px`}
      />
    </div>
  );
};

export default RippleImage;
