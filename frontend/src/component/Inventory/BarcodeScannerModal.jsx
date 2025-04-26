import React, { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/library";

const BarcodeScannerModal = ({ isOpen, onClose, onProductFound, setError }) => {
  const [scannedData, setScannedData] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (!isOpen) {
      setScannedData(null);
      setProduct(null);
      setError(null);
      // Stop the scanner when the modal is closed
      codeReader.current.reset();
    }
  }, [isOpen, setError]);

  useEffect(() => {
    if (!isOpen || scannedData) return;

    const startScanner = async () => {
      try {
        // Get access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Start scanning
        codeReader.current.decodeFromVideoDevice(
          null, // Use default video device
          videoRef.current,
          (result, err) => {
            if (result) {
              setScannedData(result.getText());
              // Stop the scanner once a barcode is detected
              codeReader.current.reset();
              // Stop the video stream
              stream.getTracks().forEach(track => track.stop());
            }
            if (err) {
              setError("Failed to scan barcode: " + err.message);
            }
          }
        );
      } catch (err) {
        setError("Failed to access camera: " + err.message);
      }
    };

    startScanner();

    return () => {
      // Cleanup on unmount or when scanning stops
      codeReader.current.reset();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, scannedData, setError]);

  useEffect(() => {
    const fetchProductByBarcode = async () => {
      if (!scannedData) return;

      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      try {
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const res = await fetch(`http://localhost:8000/inventory?supplierID=${scannedData}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 401 || res.status === 403) {
            throw new Error(errorData.message || "Unauthorized. Please log in again.");
          }
          throw new Error(errorData.message || "Failed to fetch product");
        }

        const data = await res.json();
        if (data.length === 0) {
          throw new Error("No product found with this barcode");
        }

        const foundProduct = data[0];
        setProduct(foundProduct);
        onProductFound(foundProduct);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductByBarcode();
  }, [scannedData, onProductFound, setError]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Scan Barcode</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {!scannedData ? (
            <>
              <p className="text-gray-600 mb-4">Position the barcode in front of your camera.</p>
              <video
                ref={videoRef}
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
                muted
                playsInline
              />
            </>
          ) : (
            <div>
              {isLoading ? (
                <p className="text-gray-600">Loading product details...</p>
              ) : product ? (
                <div>
                  <p className="text-gray-600 mb-4">Product found! You can now edit the details.</p>
                  <p><strong>Product Name:</strong> {product.name}</p>
                  <p><strong>Supplier ID:</strong> {product.supplierID}</p>
                  <p><strong>Quantity:</strong> {product.quantity}</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Proceed to Edit
                  </button>
                </div>
              ) : (
                <p className="text-red-600">No product found. Please try scanning again.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;