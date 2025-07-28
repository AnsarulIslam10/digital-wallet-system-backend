import { Router } from 'express';
import { UserControllers } from './user.controller';

const router = Router();

router.post('/register', UserControllers.createUser); // (public or admin-only if needed)
router.get('/all-users', UserControllers.getAllUsers); // Add auth later

export const UserRoutes = router;
