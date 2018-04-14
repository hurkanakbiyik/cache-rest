import express from 'express';
import userRoutes from './user/user.route';
import cacheRoutes from './cache/cache.route';
import authRoutes from './auth/auth.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount user routes at /users
router.use('/caches', cacheRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);


export default router;
