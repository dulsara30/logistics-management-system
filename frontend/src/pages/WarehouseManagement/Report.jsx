// Report.jsx
import axios from 'axios';
import { jsPDF } from 'jspdf';

const reportgenarate = async () => {
  try {
    // Fetch both maintenance and routing maintenance data
    const maintenanceResponse = await axios.get('http://localhost:8000/api/maintenance');
    const routingResponse = await axios.get('http://localhost:8000/api/routingmaintenance');

    const maintenanceData = maintenanceResponse.data;
    const routingMaintenanceData = routingResponse.data;

    // Create a new PDF
    const pdf = new jsPDF();
    pdf.setFontSize(10);
    let y = 20;
    const lineHeight = 8;
    const headerColor = [171, 71, 188]; // Purple header color

    // Title and Date
    pdf.setFontSize(14);
    pdf.text("Maintenance & Routing Maintenance Report", 10, y);
    y += lineHeight * 2;
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, y);
    y += lineHeight * 2;

    // === Maintenance Section ===
    pdf.setFontSize(12);
    pdf.text("Maintenance Requests", 10, y);
    y += lineHeight * 2;

    // Maintenance Table Headers
    const maintenanceHeaders = ["Request ID", "Warehouse ID", "Issue", "Priority", "Scheduled Date", "Completion Date"];
    const maintenanceColWidths = [40,40, 40, 20, 30, 20,];
    let startX = 10;

    // Draw header background
    pdf.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    pdf.rect(startX, y - lineHeight + 4, maintenanceColWidths.reduce((sum, width) => sum + width, 0), lineHeight - 1, 'F');

    // Add headers
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    let currentX = startX;
    maintenanceHeaders.forEach((header, index) => {
      pdf.text(header, currentX + 2, y);
      currentX += maintenanceColWidths[index];
    });
    pdf.setTextColor(0);
    pdf.setFont('helvetica', 'normal');
    y += lineHeight + 2;

    // Maintenance Data
    maintenanceData.forEach(item => {
      let currentX = startX;
      pdf.text(String(item.requestId), currentX + 2, y);
      currentX += maintenanceColWidths[0];
      pdf.text(String(item.warehouseId), currentX + 2, y);
      currentX += maintenanceColWidths[1];
      pdf.text(item.issueDescription, currentX + 2, y);
      currentX += maintenanceColWidths[2];
      pdf.text(item.priority, currentX + 2, y);
      currentX += maintenanceColWidths[3];
      pdf.text(item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : '', currentX + 2, y);
      currentX += maintenanceColWidths[4];
      pdf.text(item.completionDate ? new Date(item.completionDate).toLocaleDateString() : '', currentX + 2, y);
      currentX += maintenanceColWidths[5];

      y += lineHeight;
      if (y > pdf.internal.pageSize.height - 10) {
        pdf.addPage();
        y = 10;
      }
    });

    // === Routing Maintenance Section ===
    y += lineHeight * 2;
    pdf.setFontSize(12);
    pdf.text("Routing Maintenance Records", 10, y);
    y += lineHeight * 2;

    // Routing Maintenance Table Headers
    const routingHeaders = ["RID", "Warehouse", "Date", "Water Bill", "Current Bill", "Description"];
    const routingColWidths = [40, 40, 30, 25, 25, 50];

    // Draw header background
    pdf.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    pdf.rect(startX, y - lineHeight + 4, routingColWidths.reduce((sum, width) => sum + width, 0), lineHeight - 1, 'F');

    // Add headers
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    currentX = startX;
    routingHeaders.forEach((header, index) => {
      pdf.text(header, currentX + 2, y);
      currentX += routingColWidths[index];
    });
    pdf.setTextColor(0);
    pdf.setFont('helvetica', 'normal');
    y += lineHeight + 2;

    // Routing Maintenance Data
    routingMaintenanceData.forEach(item => {
      let currentX = startX;
      pdf.text(String(item.RID), currentX + 2, y);
      currentX += routingColWidths[0];
      pdf.text(item.warehouse, currentX + 2, y);
      currentX += routingColWidths[1];
      pdf.text(new Date(item.date).toLocaleDateString(), currentX + 2, y);
      currentX += routingColWidths[2];
      pdf.text(String(item.waterbill), currentX + 2, y);
      currentX += routingColWidths[3];
      pdf.text(String(item.currentbill), currentX + 2, y);
      currentX += routingColWidths[4];
      pdf.text(item.description, currentX + 2, y);
      currentX += routingColWidths[5];

      y += lineHeight;
      if (y > pdf.internal.pageSize.height - 10) {
        pdf.addPage();
        y = 10;
      }
    });

    pdf.save('maintenance_routing_report.pdf');
    alert('PDF report generated and downloaded successfully!');

  } catch (error) {
    console.error('Error generating report:', error);
    alert('Failed to generate report.');
    throw error;
  }
};

export default reportgenarate;
