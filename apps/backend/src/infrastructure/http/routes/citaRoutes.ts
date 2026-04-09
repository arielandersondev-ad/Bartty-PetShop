import { Router } from 'express';
import { CitaController } from '../controllers/CitaController';

const router = Router();
const citaController = new CitaController();

router.get('/', citaController.getAll.bind(citaController));

export default router;
