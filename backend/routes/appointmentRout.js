import { Router } from 'express';
import { getAllAppointments, deleteAppointment, updateAppointments, searchByFamilyCode, searchBySpecification, getAppointmentReport, getAppointment, getReportData, } from '../Controllers/appointmentController.js';

const router = Router();

router.get('/', getAllAppointments);
router.get('/:id', getAppointment);
router.post('/update', updateAppointments);
router.post('/searchByFamilyCode', searchByFamilyCode);
router.post('/searchBySpecification', searchBySpecification);
router.get('/report', getAppointmentReport);
router.post('/reports', getReportData)
router.delete('/:id', deleteAppointment);

export default router;
