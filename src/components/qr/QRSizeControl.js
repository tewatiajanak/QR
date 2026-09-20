import React from "react";
import { useQR } from "../../context/QRContext";

const QRSizeControl = () => {
  const { qrData, updateQRData } = useQR();

  const handleSizeChange = (e) => {
    let val = parseInt(e.target.value, 10);

    if (isNaN(val)) val = qrData.size;

    val = Math.max(150, Math.min(2000, val));

    updateQRData({ size: val });
  };

  return (
    <div className="qr-size-panel text-start mt-3">
      <h6 className="mb-2">QR Size</h6>

      <div className="d-flex align-items-center mb-2">
        <label className="form-label small me-3 mb-0">Size:</label>

        <div className="me-2 fw-bold">{qrData.size}px</div>

        <input
          type="number"
          className="form-control form-control-sm me-2"
          style={{ width: "100px" }}
          min={150}
          max={2000}
          step={1}
          value={qrData.size}
          onChange={handleSizeChange}
        />
      </div>

      <input
        type="range"
        className="form-range mb-0"
        min="150"
        max="2000"
        step="10"
        value={qrData.size}
        onChange={(e) =>
          updateQRData({
            size: parseInt(e.target.value, 10),
          })
        }
      />
    </div>
  );
};

export default QRSizeControl;