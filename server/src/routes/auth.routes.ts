import { Router } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
};

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Log into Blinkit Dark Store Analyzer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@blinkit.com
 *               password:
 *                 type: string
 *                 example: Blinkit@123
 */
router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.me(req, res, next));

export default router;
