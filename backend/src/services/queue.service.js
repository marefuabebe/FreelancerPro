import Queue from 'bull';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';
import { isRedisAvailable } from '../config/redis.js';

/**
 * Queue Service using Bull
 */
class QueueService {
  constructor() {
    this.queues = {};
    this.enabled = isRedisAvailable() && process.env.QUEUES_ENABLED !== 'false';
    this.redisConfig = this.enabled
      ? {
          redis: {
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password || undefined,
          },
        }
      : null;
  }

  /**
   * Create a new queue
   */
  createQueue(name, options = {}) {
    if (!this.enabled) {
      logger.info(`Queues disabled - skip creating queue "${name}"`);
      return null;
    }
    if (!this.queues[name]) {
      this.queues[name] = new Queue(name, {
        ...this.redisConfig,
        ...options,
      });

      logger.info(`Queue "${name}" created`);
    }

    return this.queues[name];
  }

  /**
   * Get queue by name
   */
  getQueue(name) {
    return this.queues[name];
  }

  /**
   * Add job to queue
   */
  async addJob(queueName, data, options = {}) {
    if (!this.enabled) {
      logger.info(`Queues disabled - job to "${queueName}" skipped`);
      return null;
    }
    try {
      const queue = this.getQueue(queueName) || this.createQueue(queueName);
      const job = await queue.add(data, options);
      logger.info(`Job added to queue "${queueName}": ${job.id}`);
      return job;
    } catch (error) {
      logger.error(`Failed to add job to queue "${queueName}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Process jobs in queue
   */
  processQueue(queueName, processor, concurrency = 1) {
    if (!this.enabled) {
      logger.info(`Queues disabled - processing for "${queueName}" skipped`);
      return null;
    }
    const queue = this.getQueue(queueName) || this.createQueue(queueName);

    queue.process(concurrency, async (job) => {
      logger.info(`Processing job ${job.id} from queue "${queueName}"`);
      try {
        return await processor(job);
      } catch (error) {
        logger.error(`Job ${job.id} failed: ${error.message}`);
        throw error;
      }
    });

    // Event listeners
    queue.on('completed', (job, result) => {
      logger.info(`Job ${job.id} completed`);
    });

    queue.on('failed', (job, err) => {
      logger.error(`Job ${job.id} failed: ${err.message}`);
    });

    return queue;
  }

  /**
   * Schedule recurring job
   */
  async scheduleJob(queueName, data, cronExpression, options = {}) {
    if (!this.enabled) {
      logger.info(`Queues disabled - schedule for "${queueName}" skipped`);
      return null;
    }
    try {
      const queue = this.getQueue(queueName) || this.createQueue(queueName);
      const job = await queue.add(data, {
        repeat: {
          cron: cronExpression,
        },
        ...options,
      });
      logger.info(`Scheduled job in queue "${queueName}": ${job.id}`);
      return job;
    } catch (error) {
      logger.error(`Failed to schedule job in queue "${queueName}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove job from queue
   */
  async removeJob(queueName, jobId) {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new Error(`Queue "${queueName}" not found`);
      }

      const job = await queue.getJob(jobId);
      if (job) {
        await job.remove();
        logger.info(`Job ${jobId} removed from queue "${queueName}"`);
      }
    } catch (error) {
      logger.error(`Failed to remove job from queue "${queueName}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Clean queue
   */
  async cleanQueue(queueName, grace = 0, status = 'completed') {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new Error(`Queue "${queueName}" not found`);
      }

      await queue.clean(grace, status);
      logger.info(`Queue "${queueName}" cleaned`);
    } catch (error) {
      logger.error(`Failed to clean queue "${queueName}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Pause queue
   */
  async pauseQueue(queueName) {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new Error(`Queue "${queueName}" not found`);
      }

      await queue.pause();
      logger.info(`Queue "${queueName}" paused`);
    } catch (error) {
      logger.error(`Failed to pause queue "${queueName}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Resume queue
   */
  async resumeQueue(queueName) {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new Error(`Queue "${queueName}" not found`);
      }

      await queue.resume();
      logger.info(`Queue "${queueName}" resumed`);
    } catch (error) {
      logger.error(`Failed to resume queue "${queueName}": ${error.message}`);
      throw error;
    }
  }
}

export default new QueueService();

