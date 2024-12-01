import { Router } from 'express';
import { getAllChildren, getChildById, createChild, updateChild, deleteChild } from '../Controllers/childrenConroller.js';

const router = Router();

// Define routes
router.get('/', getAllChildren);
router.get('/:id', getChildById);
router.post('/', createChild);
router.put('/:id', updateChild);
router.delete('/:id', deleteChild);

export default router;
