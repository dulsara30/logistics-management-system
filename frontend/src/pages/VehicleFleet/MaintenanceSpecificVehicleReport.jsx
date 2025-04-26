import React from 'react';
import { Button } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';




const ReportDownloader = ({ vehicleData, maintenanceData, totalMaintenanceCost }) => {

  const formatDate = (dateString) => {

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const downloadReport = () => {
    const pdf = new jsPDF();

    
    //title
    pdf.setFontSize(15);
    pdf.setFont('times', 'bold');
    pdf.text(`Vehicle Maintenance Report`, 10, 10);


    // Add vehicle details
    pdf.setFontSize(12);
    pdf.setFont('times', 'normal');
    pdf.text(`Vehicle: ${vehicleData.VehicleNumber || 'N/A'}`, 10, 20);
    pdf.text(`Type: ${vehicleData.VehicleType || 'N/A'}`, 10, 25);
    pdf.text(`Brand: ${vehicleData.VehicleBrand || 'N/A'}`, 10, 30);
    pdf.text(`Owner: ${vehicleData.OwnersName || 'N/A'} (${vehicleData.OwnersNIC || 'N/A'})`, 10, 35);

    pdf.text(`Total Maintenance Cost = ${totalMaintenanceCost.toLocaleString()}`, 10, 45);

    
    //table header
    const headers = ['ID', 'Date', 'Type', 'Cost', 'Description'];

    //table data
    const data = maintenanceData.map((maintenance) => [
      maintenance.MaintenanceID,
      formatDate(maintenance.MaintenanceDate),
      maintenance.Type,
      maintenance.Cost,
      maintenance.Description,
    ]);

    // Add the maintenance records table
    autoTable(pdf, {
      head: [headers],
      body: data,
      startY: 55,
    });

    pdf.save(`maintenance_report_${vehicleData.VehicleNumber}.pdf`);
  };

  return (
    <Button
      variant="contained"
      onClick={downloadReport}
      sx={{ borderRadius: '12px' }}
      startIcon={<CloudDownloadIcon />}
    >
      Download Report as PDF
    </Button>
  );
};

export default ReportDownloader;


