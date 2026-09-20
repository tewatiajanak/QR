import React, { useEffect, useState } from "react";
import { useQR } from "../../context/QRContext";
import { ChromePicker } from "react-color";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

/** Eye FRAME shapes — the outer 7x7 ring of each finder pattern. */
const EYE_FRAME_SHAPES = {
  square: (x, y, s7, m, key, color) => (
    <rect
      key={key}
      x={x + m / 2}
      y={y + m / 2}
      width={s7 - m}
      height={s7 - m}
      fill="none"
      stroke={color}
      strokeWidth={m}
    />
  ),
  rounded: (x, y, s7, m, key, color) => (
    <rect
      key={key}
      x={x + m / 2}
      y={y + m / 2}
      width={s7 - m}
      height={s7 - m}
      rx={m * 1.6}
      ry={m * 1.6}
      fill="none"
      stroke={color}
      strokeWidth={m}
    />
  ),
  threeRounded: (x, y, s7, m, key, color) => {
    const X = x + m / 2;
    const Y = y + m / 2;
    const W = s7 - m;
    const H = s7 - m;
    const R = m * 2.0;

    return (
      <path
        key={key}
        d={`M ${X} ${Y + H}
            L ${X} ${Y + R} A ${R} ${R} 0 0 1 ${X + R} ${Y}
            L ${X + W - R} ${Y} A ${R} ${R} 0 0 1 ${X + W} ${Y + R}
            L ${X + W} ${Y + H - R} A ${R} ${R} 0 0 1 ${X + W - R} ${
          Y + H
        }
            L ${X} ${Y + H} Z`}
        fill="none"
        stroke={color}
        strokeWidth={m}
        strokeLinejoin="round"
      />
    );
  },
  extraRounded: (x, y, s7, m, key, color) => (
    <rect
      key={key}
      x={x + m / 2}
      y={y + m / 2}
      width={s7 - m}
      height={s7 - m}
      rx={m * 2.6}
      ry={m * 2.6}
      fill="none"
      stroke={color}
      strokeWidth={m}
    />
  ),
  circle: (x, y, s7, m, key, color) => (
    <circle
      key={key}
      cx={x + s7 / 2}
      cy={y + s7 / 2}
      r={(s7 - m) / 2}
      fill="none"
      stroke={color}
      strokeWidth={m}
    />
  ),
  leaf: (x, y, s7, m, key, color) => {
    const r = s7 - m;
    return (
      <path
        key={key}
        d={`M ${x + m / 2 + r * 0.55} ${y + m / 2}
            H ${x + m / 2 + r}
            V ${y + m / 2 + r * 0.45}
            A ${r * 0.55} ${r * 0.55} 0 0 1 ${x + m / 2 + r * 0.45} ${
          y + m / 2 + r
        }
            H ${x + m / 2}
            V ${y + m / 2 + r * 0.55}
            A ${r * 0.55} ${r * 0.55} 0 0 1 ${x + m / 2 + r * 0.55} ${
          y + m / 2
        } Z`}
        fill="none"
        stroke={color}
        strokeWidth={m}
        strokeLinejoin="round"
      />
    );
  },
  dotted: (x, y, s7, m, key, color) => (
    <rect
      key={key}
      x={x + m / 2}
      y={y + m / 2}
      width={s7 - m}
      height={s7 - m}
      rx={m * 0.5}
      fill="none"
      stroke={color}
      strokeWidth={m}
      strokeDasharray={`${m * 0.9} ${m * 0.9}`}
      strokeLinecap="round"
    />
  ),
  roundedLeft: (x, y, s7, m, key, color) => {
    const X = x + m / 2;
    const Y = y + m / 2;
    const W = s7 - m;
    const H = s7 - m;
    const R = m * 1.6;

    return (
      <path
        key={key}
        d={`M ${X + R} ${Y} H ${X + W} V ${Y + H} H ${X + R}
            A ${R} ${R} 0 0 1 ${X} ${Y + H - R} V ${Y + R}
            A ${R} ${R} 0 0 1 ${X + R} ${Y} Z`}
        fill="none"
        stroke={color}
        strokeWidth={m}
        strokeLinejoin="round"
      />
    );
  },
  diagonalRounded: (x, y, s7, m, key, color) => {
    const X = x + m / 2;
    const Y = y + m / 2;
    const W = s7 - m;
    const H = s7 - m;
    const R = m * 1.8;

    return (
      <path
        key={key}
        d={`M ${X + W} ${Y}
            L ${X + W} ${Y + H - R} A ${R} ${R} 0 0 1 ${X + W - R} ${Y + H}
            L ${X} ${Y + H}
            L ${X} ${Y + R} A ${R} ${R} 0 0 1 ${X + R} ${Y}
            L ${X + W} ${Y} Z`}
        fill="none"
        stroke={color}
        strokeWidth={m}
        strokeLinejoin="round"
      />
    );
  },
};

/** Eye BALL shapes — the inner 3x3 solid block of each finder pattern. */
const EYE_BALL_SHAPES = {
  square: (x, y, s3, key, color) => (
    <rect key={key} x={x} y={y} width={s3} height={s3} fill={color} />
  ),
  rounded: (x, y, s3, key, color) => (
    <rect
      key={key}
      x={x}
      y={y}
      width={s3}
      height={s3}
      rx={s3 * 0.28}
      ry={s3 * 0.28}
      fill={color}
    />
  ),
  circle: (x, y, s3, key, color) => (
    <circle key={key} cx={x + s3 / 2} cy={y + s3 / 2} r={s3 / 2} fill={color} />
  ),
  dot: (x, y, s3, key, color) => (
    <circle
      key={key}
      cx={x + s3 / 2}
      cy={y + s3 / 2}
      r={s3 * 0.36}
      fill={color}
    />
  ),
  leaf: (x, y, s3, key, color) => (
    <path
      key={key}
      d={`M ${x + s3 * 0.54} ${y + s3 * 0.12}
          H ${x + s3 * 0.88}
          V ${y + s3 * 0.46}
          A ${s3 * 0.42} ${s3 * 0.42} 0 0 1 ${x + s3 * 0.46} ${y + s3 * 0.88}
          H ${x + s3 * 0.12}
          V ${y + s3 * 0.54}
          A ${s3 * 0.42} ${s3 * 0.42} 0 0 1 ${x + s3 * 0.54} ${y + s3 * 0.12} Z`}
      fill={color}
    />
  ),
  leafRotated: (x, y, s3, key, color) => (
    <path
      key={key}
      d={`M ${x + s3 * 0.54} ${y + s3 * 0.12}
          H ${x + s3 * 0.88}
          V ${y + s3 * 0.46}
          A ${s3 * 0.42} ${s3 * 0.42} 0 0 1 ${x + s3 * 0.46} ${y + s3 * 0.88}
          H ${x + s3 * 0.12}
          V ${y + s3 * 0.54}
          A ${s3 * 0.42} ${s3 * 0.42} 0 0 1 ${x + s3 * 0.54} ${y + s3 * 0.12} Z`}
      transform={`rotate(90 ${x + s3 / 2} ${y + s3 / 2})`}
      fill={color}
    />
  ),
  diamond: (x, y, s3, key, color) => (
    <path
      key={key}
      d={`M ${x + s3 / 2} ${y} L ${x + s3} ${y + s3 / 2} L ${x + s3 / 2} ${
        y + s3
      } L ${x} ${y + s3 / 2} Z`}
      fill={color}
    />
  ),
};

const QRCustomizer = () => {
  const { qrData, updateQRData } = useQR();

  const [showColorPicker, setShowColorPicker] = useState(null);
  const [pickerColor, setPickerColor] = useState(qrData.foregroundColor);

  const [sections, setSections] = useState({
    colors: true,
    style: false,
  });

  useEffect(() => {
    if (showColorPicker) {
      setPickerColor(qrData[showColorPicker] || "#000000");
    }
  }, [showColorPicker, qrData]);

  const toggleSection = (section) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ================= BODY SHAPES =================

  const bodyShapePaths = {
    square:
      "M2,2 h6 v6 h-6 z M10,2 h6 v6 h-6 z M2,10 h6 v6 h-6 z M10,10 h6 v6 h-6 z",

    dots: "M5,5 m-2.5,0 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0",

    rounded:
      "M2,2 h6 a1,1 0 0 1 1,1 v5 a1,1 0 0 1 -1,1 h-6 a1,1 0 0 1 -1,-1 v-5 a1,1 0 0 1 1,-1 z",

    "extra-rounded":
      "M2,2 h6 a2,2 0 0 1 2,2 v4 a2,2 0 0 1 -2,2 h-6 a2,2 0 0 1 -2,-2 v-4 a2,2 0 0 1 2,-2 z",

    classy: "M2,2 h6 v6 h-6 z",

    "classy-rounded":
      "M2,2 h6 a1,1 0 0 1 1,1 v5 a1,1 0 0 1 -1,1 h-6 a1,1 0 0 1 -1,-1 v-5 a1,1 0 0 1 1,-1 z",
  };

  // ================= EYE FRAME SHAPES =================

  const eyeFrameShapes = {
    ...EYE_FRAME_SHAPES,
    // Legacy alias to preserve existing saved values.
    "extra-rounded": EYE_FRAME_SHAPES.extraRounded,
  };

  // ================= EYE BALL SHAPES =================

  const eyeBallShapes = EYE_BALL_SHAPES;

  return (
    <div className="qr-customizer">
      <h5 className="mb-3">Customize QR Code</h5>

      {/* ================= COLORS SECTION ================= */}

      <div className="customizer-section mb-3 border-bottom pb-3">
        <div
          className="d-flex justify-content-between align-items-center cursor-pointer"
          onClick={() => toggleSection("colors")}
          style={{ cursor: "pointer" }}
        >
          <h6 className="mb-0">Colors & Gradient</h6>

          {sections.colors ? <FiChevronUp /> : <FiChevronDown />}
        </div>

        {sections.colors && (
          <div className="mt-3">
            <div className="mb-3">
              <label className="form-label small d-block mb-2">
                Color Mode
              </label>
              <div className="btn-group gap-2" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${
                    qrData.gradientType === "none"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() =>
                    updateQRData({
                      gradientType: "none",
                    })
                  }
                >
                  Foreground
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    qrData.gradientType !== "none"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() =>
                    updateQRData({
                      gradientType:
                        qrData.gradientType === "none"
                          ? "linear"
                          : qrData.gradientType,
                    })
                  }
                >
                  Gradient
                </button>
              </div>
            </div>

            {qrData.gradientType === "none" ? (
              <div className="mb-3">
                <label className="form-label small">Foreground Color</label>

                <div
                  className="color-preview border rounded p-2 d-flex align-items-center"
                  style={{
                    backgroundColor: qrData.foregroundColor,
                    height: "40px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowColorPicker("foregroundColor")}
                >
                  <span className="text-white ms-2">
                    {qrData.foregroundColor}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label small d-block mb-2">
                    Gradient Type
                  </label>
                  <div className="btn-group gap-2" role="group">
                    {[
                      { value: "linear", label: "Linear" },
                      { value: "radial", label: "Radial" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`btn btn-sm ${
                          qrData.gradientType === option.value
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() =>
                          updateQRData({
                            gradientType: option.value,
                          })
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label small">Gradient Start</label>
                    <div
                      className="color-preview border rounded p-2 d-flex align-items-center"
                      style={{
                        backgroundColor: qrData.gradientStart,
                        height: "40px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowColorPicker("gradientStart")}
                    >
                      <span className="text-white ms-2">
                        {qrData.gradientStart}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small">Gradient End</label>
                    <div
                      className="color-preview border rounded p-2 d-flex align-items-center"
                      style={{
                        backgroundColor: qrData.gradientEnd,
                        height: "40px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowColorPicker("gradientEnd")}
                    >
                      <span className="text-white ms-2">
                        {qrData.gradientEnd}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ================= STYLE SECTION ================= */}

      <div className="customizer-section mb-3 border-bottom pb-3">
        <div
          className="d-flex justify-content-between align-items-center cursor-pointer"
          onClick={() => toggleSection("style")}
          style={{ cursor: "pointer" }}
        >
          <h6 className="mb-0">QR Style</h6>

          {sections.style ? <FiChevronUp /> : <FiChevronDown />}
        </div>

        {sections.style && (
          <div className="mt-3">
            {/* BODY SHAPE */}

            <label className="form-label small fw-bold mb-2">Body Shape</label>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {Object.entries(bodyShapePaths).map(([value, path]) => (
                <button
                  key={value}
                  className={`btn p-2 ${
                    qrData.style === value
                      ? "btn-primary border-primary"
                      : "btn-light border"
                  }`}
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                  onClick={() =>
                    updateQRData({
                      style: value,
                    })
                  }
                  title={value}
                >
                  <svg
                    viewBox="0 0 18 18"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <path d={path} fill="currentColor" />
                  </svg>
                </button>
              ))}
            </div>

            {/* EYE FRAME */}

            <label className="form-label small fw-bold mb-2">
              Eye Frame Shape
            </label>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {Object.entries(eyeFrameShapes).map(([value, shape]) => (
                <button
                  key={value}
                  className={`btn p-2 ${
                    qrData.eyeFrameStyle === value
                      ? "btn-primary border-primary"
                      : "btn-light border"
                  }`}
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                  onClick={() =>
                    updateQRData({
                      eyeFrameStyle: value,
                    })
                  }
                  title={value}
                >
                  <svg
                    viewBox="0 0 18 18"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {shape(2, 2, 14, 2, `${value}-frame`, "currentColor")}
                  </svg>
                </button>
              ))}
            </div>

            {/* EYE BALL */}

            <label className="form-label small fw-bold mb-2">
              Eye Ball Shape
            </label>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {Object.entries(eyeBallShapes).map(([value, shape]) => (
                <button
                  key={value}
                  className={`btn p-2 ${
                    qrData.eyeBallStyle === value
                      ? "btn-primary border-primary"
                      : "btn-light border"
                  }`}
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                  onClick={() =>
                    updateQRData({
                      eyeBallStyle: value,
                    })
                  }
                  title={value}
                >
                  <svg
                    viewBox="0 0 18 18"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {shape(5, 5, 8, `${value}-ball`, "currentColor")}
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= COLOR PICKER ================= */}

      {showColorPicker && (
        <div
          className="color-picker-overlay"
          onClick={() => setShowColorPicker(null)}
        >
          <div
            className="color-picker-shell"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="color-picker-header">
              <span className="fw-semibold">Choose color</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowColorPicker(null)}
              >
                Close
              </button>
            </div>
            <ChromePicker
              color={pickerColor}
              onChange={(color) => setPickerColor(color.hex)}
              onChangeComplete={(color) =>
                updateQRData({
                  [showColorPicker]: color.hex,
                })
              }
              disableAlpha
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCustomizer;
