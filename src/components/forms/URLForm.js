// src/components/forms/URLForm.jsx
import React, { useState } from "react";
import { useQR } from "../../context/QRContext";

export const normalizeUrlInput = (value = "") => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  let normalized = trimmed;

  if (!/^https?:\/\//i.test(normalized) && !normalized.startsWith("www.")) {
    normalized = `https://${normalized}`;
  } else if (normalized.startsWith("www.")) {
    normalized = `https://${normalized}`;
  }

  return normalized;
};

const URLForm = () => {
  const { qrData, updateQRData } = useQR();
  const [url, setUrl] = useState(qrData.value || "");

  const validateAndUpdate = (value) => {
    const nextValue = value.trim();
    setUrl(value);

    if (!nextValue) {
      updateQRData({ value: "" });
      return;
    }

    const finalUrl = normalizeUrlInput(nextValue);
    updateQRData({ value: finalUrl });
  };

  return (
    <div className="url-form">
      <label className="form-label fw-bold">URL</label>
      <input
        type="url"
        className="form-control mb-2"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => validateAndUpdate(e.target.value)}
      />
      <small className="text-muted">
        Enter any website URL. Include https:// for best results.
      </small>
    </div>
  );
};

export default URLForm;
