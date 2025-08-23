import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';

import { Role } from './user.interface';
import { checkAuth } from '../../middlewares/checkAuth';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';
import { checkPasswordFields } from '../../middlewares/checkPasswordFields';

const router = Router();

router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser);
router.get('/all-users', checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
router.patch(
    "/me/update",
    checkAuth(...Object.values(Role)),
    validateRequest(updateUserZodSchema),
    checkPasswordFields,
    UserControllers.updateUser
);
router.patch('/agent/approve/:agentId', checkAuth(Role.ADMIN), UserControllers.approveAgent);
router.patch('/agent/suspend/:agentId', checkAuth(Role.ADMIN), UserControllers.suspendAgent);

export const UserRoutes = router;