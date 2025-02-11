function Footer() {
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center pt-2 pb-1"
        style={{ borderTop: "0.5px solid #808080" }}
      >
        🛠️ Built by&nbsp;
        <a href="https://github.com/barnetthan" target="_blank">
          Barnett Han
        </a>
      </div>
      <div className="d-flex justify-content-center align-items-center pb-2">
        📊 All weather data from&nbsp;
        <a href="https://open-meteo.com/" target="_blank">
          Open-Meteo
        </a>
      </div>
    </>
  );
}

export default Footer;
