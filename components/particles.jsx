import React from "react";

const CssParticles = () => {
  const particles = [
    {
      id: 0,
      top: "26.872253096517397vh",
      left: "1.3287089131227892vw",
      size: "33.34259309342px",
    },
    {
      id: 1,
      top: "1.8618321257997006vh",
      left: "27.10682303635028vw",
      size: "35px",
    },
    {
      id: 2,
      top: "75.54669254575131vh",
      left: "75.924824691001376vw",
      size: "35.88893746424064px",
    },
    {
      id: 3,
      top: "26.93678740876122vh",
      left: "55.131641449941206vw",
      size: "52.9446494785428px",
    },
    {
      id: 4,
      top: "55.940318569480475vh",
      left: "97.91597086323632vw",
      size: "40.007388741726416px",
    },
    {
      id: 5,
      top: "33.52251645862305vh",
      left: "7.154542963015187vw",
      size: "34.234944724289406px",
    },
    {
      id: 6,
      top: "40.129873485617246vh",
      left: "85.63963652600216vw",
      size: "25.7095724636045px",
    },
    {
      id: 7,
      top: "81.06075888373596vh",
      left: "59.01606813716982vw",
      size: "28.571000609988936px",
    },
    {
      id: 8,
      top: "38.87437113866684vh",
      left: "19.15027578338574vw",
      size: "39.04800788070512px",
    },
    {
      id: 9,
      top: "37.203609434772275vh",
      left: "19.020735341938668vw",
      size: "41.59553288692726px",
    },
  ];

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </>
  );
};

export default CssParticles;
