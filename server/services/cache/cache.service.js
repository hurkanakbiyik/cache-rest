import NodeCache from 'node-cache';
import faker from 'faker';
import httpStatus from 'http-status';
import Cache from '../../models/cache.model';
import config from '../../../config/config';
import APIError from '../../helpers/APIError';

/**
 * Checkperiod will check every value if they expired it will remove cached keys.
 * @type {NodeCache}
 */
const cacheForMongo = new NodeCache({
  checkperiod: config.cache.check
});

/**
 * Load cache and append to req.
 */
function load(req, res, next, key) {
  cacheForMongo.get(key, (err, value) => {
    if (!err) {
      if (value) {
        console.log('Cache hit');
        cacheForMongo.ttl(key, config.cache.ttl, (errorTTL, changed) => {
          if (!errorTTL) {
            console.log(`Cache tll changed -> ${changed}`);
          }
        });
        req.cache = value; // eslint-disable-line no-param-reassign
        req.key = key; // eslint-disable-line no-param-reassign
        return next();
      }
      const newKey = faker.random.uuid();
      console.log('Cache miss');
      const newValue = faker.random.word();
      cacheForMongo.set(newKey, newValue, config.cache.ttl);
      req.cache = { // eslint-disable-line no-param-reassign
        data: newValue
      };
      req.key = newKey; // eslint-disable-line no-param-reassign
      return next();
    }
    const apiError = new APIError('Internal cache error', httpStatus.INTERNAL_SERVER_ERROR);
    return next(apiError);
  });
}

/**
 * Get cache
 * @returns {User}
 */
function get(req, res) {
  return res.json({
    key: req.key,
    data: req.cache.data
  });
}

/**
 * Create new cache
 * @returns {Cache}
 */
function create(req, res, next) {
  const cache = new Cache({
    data: req.body.data
  });
  cache.save()
    .then((savedCache) => {
      const key = faker.random.uuid();
      cacheForMongo.set(key, savedCache.toObject(), config.cache.ttl);
      res.json({
        data: savedCache.data,
        key
      });
    })
    .catch(e => next(e));
}

/**
 * Update existing cache
 * @returns {Cache}
 */
function update(req, res, next) {
  const cache = req.cache;
  cache.data = req.body.data;
  Cache.update({ _id: cache._id }, { $set: { data: cache.data } }, (error) => {
    if (error) {
      next(error);
    } else {
      cacheForMongo.set(req.key, cache, config.cache.ttl);
      res.json({
        data: cache.data,
        key: req.key
      });
    }
  });
}

/**
 * Get cache list.
 * @returns {User[]}
 */
function list(req, res, next) {
  cacheForMongo.keys((err, mykeys) => {
    if (!err) {
      res.json(mykeys);
    } else {
      next(err);
    }
  });
}

/**
 * Delete cache.
 * @returns {User}
 */
function remove(req, res, next) {
  cacheForMongo.del(req.key, (err) => {
    if (!err) {
      res.sendStatus(httpStatus.OK);
    } else {
      next(err);
    }
  });
}

/**
 * Delete cache.
 * @returns {User}
 */
function bulkDelete(req, res, next) {
  const keys = req.params.keys.split(',');
  cacheForMongo.del(keys, (err, count) => {
    if (!err) {
      console.log(`Cache deleted -> ${count}`);
      res.sendStatus(httpStatus.OK);
    } else {
      next(err);
    }
  });
}

export default { load, get, create, update, list, remove, bulkDelete };
