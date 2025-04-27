// Report.jsx
import axios from 'axios';
import { jsPDF } from 'jspdf';

const reportgenarate = async () => {

  try {
    const response = await axios.get('http://localhost:8000/api/maintenance'); // Fetch data
    const maintenanceData = response.data;


    const pdf = new jsPDF();
    pdf.setFontSize(10); // Adjust font size to fit more content
    let y = 20;
    const lineHeight = 8; // Adjust line height for more compact layout
    const headerColor = [171, 71, 188]; // #ab47bc in RGB




    // Add title
    pdf.text("Maintenance Report", 10, y);
    y += lineHeight * 2;
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, y);
    y += lineHeight * 2;




    // Define headers and column widths
    const headers = ["Request ID", "Warehouse ID", "Issue Description", "Priority", "Scheduled Date", "Completion Date", "Status"];
    const colWidths = [30, 30, 30, 30, 30, 30, 30]; // Adjust column widths as needed
    const startX = 10;




    // Draw header background
    pdf.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    pdf.rect(startX, y - lineHeight + 4, colWidths.reduce((sum, width) => sum + width, 0), lineHeight - 1, 'F');




    // Add headers (white text, bold)
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255); // White text
    let currentX = startX;
    headers.forEach((header, index) => {
      pdf.text(header, currentX + 2, y); // Add some padding
      currentX += colWidths[index];
    });
    pdf.setTextColor(0); // Reset text color to black
    pdf.setFont('helvetica', 'normal');
    y += lineHeight + 2; // Move y down after headers



    
    // Add data rows
    maintenanceData.forEach(item => {
      let currentX = startX;
      pdf.text(String(item.requestId), currentX + 2, y); currentX += colWidths[0];
      pdf.text(String(item.warehouseId), currentX + 2, y); currentX += colWidths[1];
      pdf.text(item.issueDescription, currentX + 2, y); currentX += colWidths[2];
      pdf.text(item.priority, currentX + 2, y); currentX += colWidths[3];
      pdf.text(item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : '', currentX + 2, y); currentX += colWidths[4];
      pdf.text(item.completionDate ? new Date(item.completionDate).toLocaleDateString() : '', currentX + 2, y); currentX += colWidths[5];
      pdf.text(item.status, currentX + 2, y);

      y += lineHeight;
      if (y > pdf.internal.pageSize.height - 10) {
        pdf.addPage();
        y = 10;
      }
    });

    pdf.save('maintenance_report.pdf'); // Trigger download
    alert('PDF report generated and downloaded successfully!');

  } catch (error) {
    console.error('Error generating report:', error);
    alert('Failed to generate report.');
    throw error;
  }
};

export default reportgenarate;