import QRCode from "qrcode";
import path from "path";
import { uploadQRCodeToCloudinary } from "./cloudinary";

export async function generateQRCode(params: { email: string; fullName: string; phoneNo: string; NIC: string }): Promise<string> {
  const qrData = JSON.stringify(params);
  const nic = params.NIC.trim().toUpperCase();

  //Generate QR code as a buffer
  const qrCodeBuffer = await QRCode.toBuffer(qrData);


  const qrCodeFileName = `${nic}-qrcode`;
  const qrCodeUrl = await uploadQRCodeToCloudinary(qrCodeBuffer, qrCodeFileName, "staff_qr_codes");

  return qrCodeUrl;
}
