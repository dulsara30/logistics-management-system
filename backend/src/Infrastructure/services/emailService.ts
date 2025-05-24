import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendReturnReportEmail = async (
    to: string,
    subject: string,
    damageReport: any,
    additionalDetails: string
): Promise<void> => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: `
      <h2>Return Report for Damaged Item</h2>
      <p><strong>Item Name:</strong> ${damageReport.itemName}</p>
      <p><strong>Quantity:</strong> ${damageReport.quantity}</p>
      <p><strong>Damage Type:</strong> ${damageReport.damageType}</p>
      <p><strong>Action Required:</strong> ${damageReport.actionRequired}</p>
      <p><strong>Supplier Name:</strong> ${damageReport.supplierName || 'N/A'}</p>
      <p><strong>Description:</strong> ${damageReport.description}</p>
      <p><strong>Date Reported:</strong> ${damageReport.date}</p>
      <p><strong>Reported By:</strong> ${damageReport.reportedBy}</p>
      <p><strong>Additional Details:</strong> ${additionalDetails || 'None'}</p>
      <p>Please process the return at your earliest convenience.</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};