import React from "react";

function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 60,
        height: 36,
        marginBottom: "10px",
        borderRadius: 18,
        backgroundColor: "#D3D3D3",
        padding: 5,
      }}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            margin: "0 2px",
            borderRadius: "50%",
            backgroundColor: "#333",
            animationName: "dotPulse",
            animationDuration: "1.5s",
            animationIterationCount: "infinite",
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

export default TypingIndicator;
