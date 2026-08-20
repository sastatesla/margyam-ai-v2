export const UserRole = Object.freeze({
  ADMIN:       'ADMIN',
  USER:        'USER',
  ASTROLOGER:  'ASTROLOGER',
});

export const OnboardingStep = Object.freeze({
  PHONE:       'PHONE',
  OTP:         'OTP',
  PROFILE:     'PROFILE',
  BIRTH_INFO:  'BIRTH_INFO',
  COMPLETE:    'COMPLETE',
});

export const OTP = Object.freeze({
  DEFAULT:    123456,
  LENGTH:     6,
  EXPIRY_MIN: 5,
});

export const REDIS_KEYS = Object.freeze({
  CHAT_STREAM:          'chat:tasks',
  CHAT_CONSUMER_GROUP:  'gateway-consumers',
  STREAM_CHANNEL:       (sessionId) => `stream:${sessionId}`,
  GUIDANCE_CACHE:       (userId) => `guidance:${userId}`,
  CHART_CACHE:          (userId) => `chart:${userId}`,
});
