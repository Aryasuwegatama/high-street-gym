// XMLUploader.jsx
import React, { useState } from "react";
import { API_URL } from "../../api/api.js";

export default function XMLUploader({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null); // Clear any previous errors
    } else {
      setError("No file selected.");
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select an XML file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("xml-file", selectedFile);

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/xml-upload/activities`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        onUploadSuccess(result.message || "XML upload successful!");
      } else {
        onUploadSuccess(result.message || "Failed to upload XML.");
      }
    } catch (err) {
      onUploadSuccess("An error occurred during upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="xml-uploader">
      <form onSubmit={handleUpload} className="join">
        <input
          type="file"
          accept=".xml"
          onChange={handleFileChange}
          className="file-input file-input-bordered file-input-primary join-item"
        />
        <button
          type="submit"
          className="btn btn-primary join-item"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload XML"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
