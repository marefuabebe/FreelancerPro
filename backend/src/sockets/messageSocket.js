import Message from '../models/message.model.js';
import logger from '../utils/logger.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Message Socket Handler
 */
export const setupMessageSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    // Join user's personal room
    socket.join(`user_${userId}`);

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { recipientId, content, attachments, relatedTo } = data;

        const message = await Message.create({
          sender: userId,
          recipient: recipientId,
          content,
          attachments,
          relatedTo,
        });

        await message.populate('sender', 'firstName lastName avatar');

        // Send to recipient
        io.to(`user_${recipientId}`).emit('new_message', message);

        // Confirm to sender
        socket.emit('message_sent', message);

        // Queue notification for recipient
        const { queueNotification } = await import('../jobs/notificationQueue.js');
        await queueNotification('message', {
          recipientId,
          senderId: userId,
          messageId: message._id,
          conversationId: message.conversationId,
        });

        logger.info(`Message sent from ${userId} to ${recipientId}`);
      } catch (error) {
        logger.error(`Message send error: ${error.message}`);
        socket.emit('message_error', { message: 'Failed to send message' });
      }
    });

    // Upload and send file
    socket.on('upload_file', async (data) => {
      try {
        const { recipientId, fileData, fileName, fileType, fileSize } = data;

        // Validate file size (10MB limit)
        if (fileSize > 10 * 1024 * 1024) {
          socket.emit('upload_error', { message: 'File size exceeds 10MB limit' });
          return;
        }

        // Emit upload progress
        socket.emit('upload_progress', { progress: 20 });

        console.log('📤 Starting file upload:', { fileName, fileType, fileSize });

        // Convert base64 to buffer
        const base64Data = fileData.replace(/^data:.*?;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        console.log('📦 Buffer size:', buffer.length);

        // Upload to Cloudinary using upload_stream for buffer data
        const folder = fileType.startsWith('image/') ? 'chat_images' : 'chat_files';

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: fileType.startsWith('image/') ? 'image' : 'raw',
              public_id: `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`,
            },
            (error, result) => {
              if (error) {
                console.error('❌ Cloudinary upload error:', error);
                reject(error);
              } else {
                console.log('✅ Cloudinary upload success:', result.secure_url);
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                });
              }
            }
          );

          uploadStream.end(buffer);
        });

        socket.emit('upload_progress', { progress: 70 });

        // Create message with attachment
        const message = await Message.create({
          sender: userId,
          recipient: recipientId,
          content: `Shared a file: ${fileName}`,
          attachments: [{
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            name: fileName,
            size: fileSize,
            type: fileType,
          }],
        });

        await message.populate('sender', 'firstName lastName avatar');

        socket.emit('upload_progress', { progress: 100 });

        // Send to recipient
        io.to(`user_${recipientId}`).emit('new_message', message);

        // Confirm to sender  
        socket.emit('message_sent', message);
        socket.emit('upload_complete', { message });

        // Queue notification for recipient
        const { queueNotification } = await import('../jobs/notificationQueue.js');
        await queueNotification('message', {
          recipientId,
          senderId: userId,
          messageId: message._id,
          conversationId: message.conversationId,
        });

        logger.info(`File uploaded and sent from ${userId} to ${recipientId}`);
      } catch (error) {
        console.error('❌ File upload error:', error);
        console.error('Error stack:', error.stack);
        logger.error(`File upload error: ${error.message}`);
        socket.emit('upload_error', {
          message: error.message || 'File upload failed',
          details: error.toString()
        });
      }
    });

    // Mark message as read
    socket.on('mark_read', async (data) => {
      try {
        const { messageId } = data;

        const message = await Message.findOneAndUpdate(
          { _id: messageId, recipient: userId },
          { read: true, readAt: new Date() },
          { new: true }
        );

        if (message) {
          // Notify sender
          io.to(`user_${message.sender}`).emit('message_read', {
            messageId,
            readAt: message.readAt,
          });
        }
      } catch (error) {
        logger.error(`Mark read error: ${error.message}`);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { recipientId } = data;
      io.to(`user_${recipientId}`).emit('user_typing', {
        userId,
        typing: true,
      });
    });

    socket.on('stop_typing', (data) => {
      const { recipientId } = data;
      io.to(`user_${recipientId}`).emit('user_typing', {
        userId,
        typing: false,
      });
    });
  });
};

export default setupMessageSocket;

