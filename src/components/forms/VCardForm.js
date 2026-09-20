// src/components/forms/VCardForm.jsx
import React, { useState, useEffect } from "react";
import { useQR } from "../../context/QRContext";

const VCardForm = () => {
  const { qrData, updateQRData } = useQR();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const val = qrData.value || "";
    if (val.includes("BEGIN:VCARD")) {
      const lines = val.split("\n");
      lines.forEach((line) => {
        if (line.startsWith("FN:")) setFullName(line.substring(3));
        if (line.startsWith("TEL:")) setPhone(line.substring(4));
        if (line.startsWith("EMAIL:")) setEmail(line.substring(6));
        if (line.startsWith("ORG:")) setOrganization(line.substring(4));
        if (line.startsWith("TITLE:")) setTitle(line.substring(6));
        if (line.startsWith("URL:")) setWebsite(line.substring(4));
        if (line.startsWith("ADR:")) setAddress(line.substring(4));
      });
    } else {
      setFullName("");
      setPhone("");
      setEmail("");
      setOrganization("");
      setTitle("");
      setWebsite("");
      setAddress("");
    }
  }, [qrData.value]);

  const generateVCard = () => {
    let vcard = "BEGIN:VCARD\nVERSION:3.0\n";
    if (fullName) vcard += `FN:${fullName}\n`;
    if (phone) vcard += `TEL:${phone}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (organization) vcard += `ORG:${organization}\n`;
    if (title) vcard += `TITLE:${title}\n`;
    if (website) vcard += `URL:${website}\n`;
    if (address) vcard += `ADR:${address}\n`;
    vcard += "END:VCARD";
    updateQRData({ value: vcard });
  };

  useEffect(() => {
    if (fullName || phone || email) generateVCard();
  }, [fullName, phone, email, organization, title, website, address]);

  return (
    <div className="vcard-form">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">Full Name</label>
          <input
            className="form-control"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Phone</label>
          <input
            className="form-control"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Email</label>
          <input
            className="form-control"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Organization</label>
          <input
            className="form-control"
            placeholder="Company Name"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Job Title</label>
          <input
            className="form-control"
            placeholder="CEO"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Website</label>
          <input
            className="form-control"
            placeholder="https://example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Address</label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="Street, City, ZIP"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <small className="text-muted mt-2 d-block">
        Creates a digital contact card.
      </small>
    </div>
  );
};

export default VCardForm;
