import React, { useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import qrcodeGenerator from "qrcode-generator";
import { useQR } from "../../context/QRContext";
import { useHistory } from "../../context/HistoryContext";

const getDotsOptions = (style, color, gradient) => {
  const supportedTypes = [
    "square",
    "dots",
    "rounded",
    "extra-rounded",
    "classy",
    "classy-rounded",
  ];

  return {
    color,
    type: supportedTypes.includes(style) ? style : "square",
    gradient: gradient || undefined,
  };
};

const getCornersSquareOptions = (frameStyle, color, gradient) => {
  const frameTypeMap = {
    square: "square",
    rounded: "extra-rounded",
    extraRounded: "extra-rounded",
    "extra-rounded": "extra-rounded",
    circle: "dot",
    leaf: "extra-rounded",
    dotted: "dot",
    roundedLeft: "extra-rounded",
    threeRounded: "extra-rounded",
    diagonalRounded: "extra-rounded",
    parallelogram: "square",
    dot: "dot",
  };

  return {
    color,
    type: frameTypeMap[frameStyle] || "square",
    gradient: gradient || undefined,
  };
};

const getCornersDotOptions = (ballStyle, color, gradient) => {
  const ballTypeMap = {
    square: "square",
    rounded: "square",
    circle: "dot",
    dot: "dot",
    leaf: "square",
    leafRotated: "square",
    diamond: "square",
  };

  return {
    color,
    type: ballTypeMap[ballStyle] || "square",
    gradient: gradient || undefined,
  };
};

const getModuleCount = (value, errorCorrection) => {
  try {
    const qr = qrcodeGenerator(0, (errorCorrection || "Q").toUpperCase());
    qr.addData(value || " ");
    qr.make();
    return qr.getModuleCount();
  } catch (error) {
    return 21;
  }
};

const roundedRectPath = (ctx, x, y, w, h, r) => {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const r2 = (value) => Math.round(value * 100) / 100;

const drawEyeFrame = (ctx, frameStyle, x, y, s7, m, color) => {
  const style = frameStyle || "square";
  const drawStyle = style === "extra-rounded" ? "extraRounded" : style;
  const strokeWidth = Math.max(1, m);
  const X = r2(x + strokeWidth / 2);
  const Y = r2(y + strokeWidth / 2);
  const W = r2(s7 - strokeWidth);
  const H = r2(s7 - strokeWidth);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.miterLimit = 2;
  ctx.setLineDash([]);

  switch (drawStyle) {
    case "rounded":
      roundedRectPath(ctx, X, Y, W, H, strokeWidth * 1.6);
      ctx.stroke();
      break;
    case "extraRounded":
      roundedRectPath(ctx, X, Y, W, H, strokeWidth * 2.6);
      ctx.stroke();
      break;
    case "circle":
    case "dot":
      ctx.beginPath();
      ctx.arc(x + s7 / 2, y + s7 / 2, (s7 - strokeWidth) / 2, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "leaf": {
      const r = s7 - strokeWidth;
      ctx.beginPath();
      ctx.moveTo(x + strokeWidth / 2 + r * 0.55, y + strokeWidth / 2);
      ctx.lineTo(x + strokeWidth / 2 + r, y + strokeWidth / 2);
      ctx.lineTo(x + strokeWidth / 2 + r, y + strokeWidth / 2 + r * 0.45);
      ctx.arcTo(
        x + strokeWidth / 2 + r,
        y + strokeWidth / 2 + r,
        x + strokeWidth / 2 + r * 0.45,
        y + strokeWidth / 2 + r,
        r * 0.55,
      );
      ctx.lineTo(x + strokeWidth / 2, y + strokeWidth / 2 + r);
      ctx.lineTo(x + strokeWidth / 2, y + strokeWidth / 2 + r * 0.55);
      ctx.arcTo(
        x + strokeWidth / 2,
        y + strokeWidth / 2,
        x + strokeWidth / 2 + r * 0.55,
        y + strokeWidth / 2,
        r * 0.55,
      );
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case "dotted":
      ctx.setLineDash([strokeWidth * 0.9, strokeWidth * 0.9]);
      ctx.lineCap = "round";
      roundedRectPath(ctx, X, Y, W, H, strokeWidth * 0.5);
      ctx.stroke();
      break;
    case "roundedLeft": {
      const R = strokeWidth * 1.6;
      ctx.beginPath();
      ctx.moveTo(X + R, Y);
      ctx.lineTo(X + W, Y);
      ctx.lineTo(X + W, Y + H);
      ctx.lineTo(X + R, Y + H);
      ctx.arcTo(X, Y + H, X, Y + H - R, R);
      ctx.lineTo(X, Y + R);
      ctx.arcTo(X, Y, X + R, Y, R);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case "threeRounded": {
      const R = strokeWidth * 2;
      ctx.beginPath();
      ctx.moveTo(X, Y + H);
      ctx.lineTo(X, Y + R);
      ctx.arcTo(X, Y, X + R, Y, R);
      ctx.lineTo(X + W - R, Y);
      ctx.arcTo(X + W, Y, X + W, Y + R, R);
      ctx.lineTo(X + W, Y + H - R);
      ctx.arcTo(X + W, Y + H, X + W - R, Y + H, R);
      ctx.lineTo(X, Y + H);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case "diagonalRounded": {
      const R = strokeWidth * 1.8;
      ctx.beginPath();
      ctx.moveTo(X + W, Y);
      ctx.lineTo(X + W, Y + H - R);
      ctx.arcTo(X + W, Y + H, X + W - R, Y + H, R);
      ctx.lineTo(X, Y + H);
      ctx.lineTo(X, Y + R);
      ctx.arcTo(X, Y, X + R, Y, R);
      ctx.lineTo(X + W, Y);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case "parallelogram": {
      const SKY = H * 0.16;
      const SKX = W * 0.18;
      const r = strokeWidth * 1.8;
      const TL = { x: X, y: Y };
      const TR = { x: X + W, y: Y + SKY };
      const BR = { x: X + W, y: Y + H };
      const BL = { x: X + SKX, y: Y + H };
      const TRin = { x: TR.x - r, y: TR.y };
      const TRout = { x: TR.x, y: TR.y + r };
      const BLin = { x: BL.x + r, y: BL.y };
      const BLout = { x: BL.x, y: BL.y - r };

      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(TL.x, TL.y);
      ctx.lineTo(TRin.x, TRin.y);
      ctx.quadraticCurveTo(TR.x, TR.y, TRout.x, TRout.y);
      ctx.lineTo(BR.x, BR.y);
      ctx.lineTo(BLin.x, BLin.y);
      ctx.quadraticCurveTo(BL.x, BL.y, BLout.x, BLout.y);
      ctx.lineTo(TL.x, TL.y);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case "square":
    default:
      ctx.strokeRect(X, Y, W, H);
      break;
  }

  ctx.restore();
};

const drawEyeBall = (ctx, ballStyle, x, y, s3, color) => {
  const style = ballStyle || "square";
  const drawSlimLeaf = () => {
    ctx.beginPath();
    ctx.moveTo(x + s3 * 0.54, y + s3 * 0.12);
    ctx.lineTo(x + s3 * 0.88, y + s3 * 0.12);
    ctx.lineTo(x + s3 * 0.88, y + s3 * 0.46);
    ctx.arcTo(x + s3 * 0.88, y + s3 * 0.88, x + s3 * 0.46, y + s3 * 0.88, s3 * 0.42);
    ctx.lineTo(x + s3 * 0.12, y + s3 * 0.88);
    ctx.lineTo(x + s3 * 0.12, y + s3 * 0.54);
    ctx.arcTo(x + s3 * 0.12, y + s3 * 0.12, x + s3 * 0.54, y + s3 * 0.12, s3 * 0.42);
    ctx.closePath();
    ctx.fill();
  };

  ctx.save();
  ctx.fillStyle = color;

  switch (style) {
    case "rounded":
      roundedRectPath(ctx, x, y, s3, s3, s3 * 0.28);
      ctx.fill();
      break;
    case "circle":
      ctx.beginPath();
      ctx.arc(x + s3 / 2, y + s3 / 2, s3 / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "dot":
      ctx.beginPath();
      ctx.arc(x + s3 / 2, y + s3 / 2, s3 * 0.36, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "leaf":
      drawSlimLeaf();
      break;
    case "leafRotated":
      ctx.save();
      ctx.translate(x + s3 / 2, y + s3 / 2);
      ctx.rotate(Math.PI / 2);
      ctx.translate(-(x + s3 / 2), -(y + s3 / 2));
      drawSlimLeaf();
      ctx.restore();
      break;
    case "diamond":
      ctx.beginPath();
      ctx.moveTo(x + s3 / 2, y);
      ctx.lineTo(x + s3, y + s3 / 2);
      ctx.lineTo(x + s3 / 2, y + s3);
      ctx.lineTo(x, y + s3 / 2);
      ctx.closePath();
      ctx.fill();
      break;
    case "square":
    default:
      ctx.fillRect(x, y, s3, s3);
      break;
  }

  ctx.restore();
};

const DIRECTIONAL_FRAME_STYLES = new Set([
  "leaf",
  "roundedLeft",
  "threeRounded",
  "diagonalRounded",
  "parallelogram",
]);

const drawFinderWithOrientation = (
  ctx,
  eye,
  s7,
  frameStyle,
  drawFrame,
  drawBall,
) => {
  if (!DIRECTIONAL_FRAME_STYLES.has(frameStyle)) {
    drawFrame();
    drawBall();
    return;
  }

  const cx = eye.x + s7 / 2;
  const cy = eye.y + s7 / 2;

  const orientationByCorner = {
    // Use bottom-left as reference orientation (currently correct).
    bl: { rotate: Math.PI, sx: 1, sy: 1 },
    // Mirror BL orientation to keep top-left finder facing center.
    tl: { rotate: 0, sx: -1, sy: 1 },
    // Rotate BL orientation to keep top-right finder facing center.
    tr: { rotate: 0, sx: 1, sy: 1 },
  };

  const transform = orientationByCorner[eye.corner] || {
    rotate: 0,
    sx: 1,
    sy: 1,
  };

  ctx.save();
  ctx.translate(cx, cy);
  if (transform.rotate) {
    ctx.rotate(transform.rotate);
  }
  if (transform.sx !== 1 || transform.sy !== 1) {
    ctx.scale(transform.sx, transform.sy);
  }
  ctx.translate(-cx, -cy);
  drawFrame();
  drawBall();
  ctx.restore();
};

const applyCustomFinderEyes = (canvas, qrData, qrValue, color) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const moduleCount = getModuleCount(qrValue, qrData.errorCorrection || "Q");
  const moduleSize = canvas.width / moduleCount;
  const s7 = moduleSize * 7;
  const s3 = moduleSize * 3;
  const cleanupPad = Math.max(1, moduleSize * 0.7);
  const bgColor = qrData.transparentBg ? null : qrData.backgroundColor;

  const eyes = [
    { x: 0, y: 0, corner: "tl" },
    { x: canvas.width - s7, y: 0, corner: "tr" },
    { x: 0, y: canvas.height - s7, corner: "bl" },
  ];

  eyes.forEach((eye) => {
    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(
        eye.x - cleanupPad,
        eye.y - cleanupPad,
        s7 + cleanupPad * 2,
        s7 + cleanupPad * 2,
      );
    } else {
      ctx.clearRect(
        eye.x - cleanupPad,
        eye.y - cleanupPad,
        s7 + cleanupPad * 2,
        s7 + cleanupPad * 2,
      );
    }

    drawFinderWithOrientation(
      ctx,
      eye,
      s7,
      qrData.eyeFrameStyle,
      () =>
        drawEyeFrame(
          ctx,
          qrData.eyeFrameStyle,
          eye.x,
          eye.y,
          s7,
          moduleSize,
          color,
        ),
      () =>
        drawEyeBall(
          ctx,
          qrData.eyeBallStyle,
          eye.x + moduleSize * 2,
          eye.y + moduleSize * 2,
          s3,
          color,
        ),
    );
  });
};

const QRPreview = () => {
  const { qrData, setCurrentQRImage } = useQR();
  const { addToHistory } = useHistory();

  const qrRef = useRef(null);

  const getQRValue = () => {
    switch (qrData.type) {
      case "url":
        return qrData.value || "https://knowvato.in";

      case "text":
        return qrData.value || "Knowvato QR";

      case "email":
        return qrData.email
          ? `mailto:${qrData.email}`
          : "mailto:test@example.com";

      case "phone":
        return qrData.phoneNumber
          ? `tel:${qrData.phoneNumber}`
          : "tel:9999999999";

      default:
        return qrData.value || "https://knowvato.in";
    }
  };

  useEffect(() => {
    let cancelled = false;
    const qrValue = getQRValue();

    const baseColor =
      qrData.gradientType !== "none"
        ? qrData.gradientStart
        : qrData.foregroundColor;

    const gradientObj =
      qrData.gradientType !== "none"
        ? {
            type: qrData.gradientType,
            rotation: 0,
            colorStops: [
              {
                offset: 0,
                color: qrData.gradientStart,
              },
              {
                offset: 1,
                color: qrData.gradientEnd,
              },
            ],
          }
        : null;

    const options = {
      width: qrData.size,
      height: qrData.size,
      type: "canvas",
      margin: 0,
      data: qrValue,

      dotsOptions: getDotsOptions(qrData.style, baseColor, gradientObj),

      cornersSquareOptions: getCornersSquareOptions(
        qrData.eyeFrameStyle,
        baseColor,
        gradientObj,
      ),

      cornersDotOptions: getCornersDotOptions(
        qrData.eyeBallStyle,
        baseColor,
        gradientObj,
      ),

      backgroundOptions: {
        color: qrData.transparentBg ? "transparent" : qrData.backgroundColor,
      },

      qrOptions: {
        errorCorrectionLevel: qrData.errorCorrection || "Q",
      },

      ...(qrData.logo && {
        image: qrData.logo,
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: qrData.logoSize / 100,
          margin: 0,
          crossOrigin: "anonymous",
        },
      }),
    };

    const newQRCode = new QRCodeStyling(options);

    const renderFinalPreview = async () => {
      const data = await newQRCode.getRawData("png");
      if (!data || cancelled) return;

      const objectUrl = URL.createObjectURL(data);

      try {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = objectUrl;
        });

        if (cancelled) return;

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = qrData.size;
        finalCanvas.height = qrData.size;
        finalCanvas.className = "mx-auto";
        finalCanvas.style.maxWidth = "100%";
        finalCanvas.style.height = "auto";

        const ctx = finalCanvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(image, 0, 0, finalCanvas.width, finalCanvas.height);
        applyCustomFinderEyes(finalCanvas, qrData, qrValue, baseColor);

        if (qrRef.current) {
          qrRef.current.innerHTML = "";
          qrRef.current.appendChild(finalCanvas);
        }

        finalCanvas.toBlob((blob) => {
          if (!blob || cancelled) return;
          const url = URL.createObjectURL(blob);
          setCurrentQRImage(url);
        }, "image/png");
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    renderFinalPreview();

    addToHistory({
      name: `${qrData.type?.toUpperCase()} QR Code`,
      type: qrData.type,
      value: qrValue,
      settings: { ...qrData },
    });

    return () => {
      cancelled = true;
    };
  }, [qrData]);

  return (
    <div className="qr-preview-container">
      <div
        className="qr-wrapper bg-white p-4 rounded-5 shadow-sm mx-auto"
        style={{
          maxWidth: "76%",
          overflow: "hidden",
        }}
      >
        <div ref={qrRef} className="qr-canvas mx-auto"></div>
      </div>
    </div>
  );
};

export default QRPreview;
