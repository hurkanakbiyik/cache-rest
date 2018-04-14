import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Cache Schema
 */
const CacheSchema = new mongoose.Schema({
  data: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
CacheSchema.method({
});

/**
 * Statics
 */
CacheSchema.statics = {
  /**
   * Get cache
   * @param {ObjectId} id - The objectId of cache
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((cache) => {
        if (cache) {
          return cache;
        }
        const err = new APIError('No such cache exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List caches in descending order of 'createdAt' timestamp.
   * @returns {Promise<Cache[]>}
   */
  list() {
    return this.find()
      .sort({ createdAt: -1 })
      .exec();
  }
};

/**
 * @typedef Cache
 */
export default mongoose.model('Cache', CacheSchema);
