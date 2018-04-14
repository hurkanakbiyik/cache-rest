import express from 'express';
import cacheCtrl from '../../services/cache/cache.service';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/caches - Get list of caches */
  .get(cacheCtrl.list)

  /** POST /api/caches - Create new cache */
  .post(cacheCtrl.create);

router.route('/:key')
  /** GET /api/caches/:key - Get cache */
  .get(cacheCtrl.get)

  /** PUT /api/caches/:key - Update cache */
  .put(cacheCtrl.update)

  /** DELETE /api/caches/:key - Delete cache */
  .delete(cacheCtrl.remove);

router.route('/bulk/:keys')
  .delete(cacheCtrl.bulkDelete);

/** Load cache when API with key route parameter is hit */
router.param('key', cacheCtrl.load);

export default router;
