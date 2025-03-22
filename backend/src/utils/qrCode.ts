import QRCode  from "qrcode";
import path from "path";

export async function generateQRCode(params: {email: string; fullName: string; phoneNo: string}): Promise<string> {
    const qrData = JSON.stringify(params);
    const qrCodePath = path.join('uploads', `${params.email}-qrcode.png`);
    await QRCode.toFile(qrCodePath, qrData);
    return  `/uploads/${params.email}-qrcode.png`;
}