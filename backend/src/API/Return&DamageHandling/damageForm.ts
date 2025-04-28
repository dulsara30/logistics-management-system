import express from 'express';
import { authenticateToken, authorizeRole } from '../../middleware/authentication';
import { getAllInventoryManagement } from '../../Application/InventoryManagement';
import { createDamageReport, getAllDamageReports } from '../../Application/Return&DamageHandling/DamageReport';

const getItemRouter = express.Router();

getItemRouter
  .route('/add-damage')
  .get(
    authenticateToken,
    authorizeRole(['Business Owner', 'Warehouse Manager', 'Inventory Manager']),
    getAllDamageReports
  )
  .post(
    authenticateToken,
    authorizeRole(['Business Owner', 'Warehouse Manager', 'Inventory Manager']),
    createDamageReport
  );

export default getItemRouter;