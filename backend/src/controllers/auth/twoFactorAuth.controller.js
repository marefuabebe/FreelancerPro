import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from '../../models/user.model.js';
import { sendSuccess, sendBadRequest } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Enable 2FA
 * @route POST /api/v1/auth/2fa/enable
 * @access Private
 */
export const enable2FA = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.twoFactorAuth.enabled) {
    return sendBadRequest(res, 'Two-factor authentication is already enabled');
  }

  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `Freelancer Marketplace (${user.email})`,
  });

  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  // Save secret (temporarily)
  user.twoFactorAuth.secret = secret.base32;
  await user.save();

  sendSuccess(res, 200, '2FA secret generated', {
    secret: secret.base32,
    qrCode: qrCodeUrl,
  });
});

/**
 * Verify and activate 2FA
 * @route POST /api/v1/auth/2fa/verify
 * @access Private
 */
export const verify2FA = catchAsync(async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user._id);

  if (!user.twoFactorAuth.secret) {
    return sendBadRequest(res, 'Please enable 2FA first');
  }

  // Verify token
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorAuth.secret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!verified) {
    return sendBadRequest(res, 'Invalid verification code');
  }

  // Enable 2FA
  user.twoFactorAuth.enabled = true;
  await user.save();

  sendSuccess(res, 200, 'Two-factor authentication enabled successfully');
});

/**
 * Disable 2FA
 * @route POST /api/v1/auth/2fa/disable
 * @access Private
 */
export const disable2FA = catchAsync(async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user._id);

  if (!user.twoFactorAuth.enabled) {
    return sendBadRequest(res, 'Two-factor authentication is not enabled');
  }

  // Verify token before disabling
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorAuth.secret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!verified) {
    return sendBadRequest(res, 'Invalid verification code');
  }

  // Disable 2FA
  user.twoFactorAuth.enabled = false;
  user.twoFactorAuth.secret = undefined;
  await user.save();

  sendSuccess(res, 200, 'Two-factor authentication disabled successfully');
});

export default { enable2FA, verify2FA, disable2FA };

