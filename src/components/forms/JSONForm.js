// src/components/forms/JSONForm.jsx
import React, { useState, useEffect } from "react";
import { useQR } from "../../context/QRContext";
import { toast } from "react-toastify";

const JSONForm = () => {
  const { qrData, updateQRData } = useQR();
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const val = qrData.value || "";
    if (val) {
      try {
        const parsed = JSON.parse(val);
        setJsonInput(JSON.stringify(parsed, null, 2));
        setError("");
      } catch {
        setJsonInput(val);
      }
    }
  }, [qrData.value]);

  const validateAndUpdate = (value) => {
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      updateQRData({ value: JSON.stringify(parsed) });
      setError("");
      toast.success("Valid JSON");
    } catch (e) {
      setError("Invalid JSON format");
      if (value === "") updateQRData({ value: "" });
    }
  };

  return (
    <div className="json-form">
      <label className="form-label fw-bold">Custom JSON Data</label>
      <textarea
        className="form-control mb-2"
        rows="6"
        placeholder='{"name":"John","age":30}'
        value={jsonInput}
        onChange={(e) => validateAndUpdate(e.target.value)}
      />
      {error && <div className="alert alert-danger small py-1">{error}</div>}
      <small className="text-muted">
        Enter any valid JSON. QR code will store the raw string.
      </small>
    </div>
  );
};

export default JSONForm;
