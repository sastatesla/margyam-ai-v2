import prisma from '../configs/db.js';
import { ApiError } from '../common/index.js';
import { calculateChart } from '../system/grpc/clients/astro.client.js';

const REFERRAL_COINS = 150;

class UserService {
  async getById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw ApiError.NotFound('User not found');
    return user;
  }

  async update(userId, data) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  /**
   * Complete onboarding and save birth info.
   */
  async onboardUser(userId, data) {
    const { fullName, gender, dateOfBirth, timeOfBirth, placeOfBirth, preferredLanguage, lat, lon } = data;

    let kundliData = null;
    if (dateOfBirth && timeOfBirth && (lat || lon)) {
      try {
        const kundliResponse = await calculateChart({
          userId,
          latitude: parseFloat(lat || 0),
          longitude: parseFloat(lon || 0),
          date_of_birth: dateOfBirth,
          time_of_birth: timeOfBirth,
          timezone: 'Asia/Kolkata',
        });

        if (kundliResponse && kundliResponse.success) {
          kundliData = JSON.stringify(kundliResponse);
        }
      } catch (grpcErr) {
        // Proceed gracefully
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName || undefined,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
        timeOfBirth: timeOfBirth || undefined,
        placeOfBirth: placeOfBirth || undefined,
        preferredLanguage: preferredLanguage || 'en',
        latitude: lat ? parseFloat(lat) : undefined,
        longitude: lon ? parseFloat(lon) : undefined,
        profileCompleted: true,
        kundliData: kundliData || undefined,
        onboarding: {
          set: {
            currentStep: 'COMPLETE',
            isComplete: true,
            updatedAt: new Date(),
          },
        },
        userMetadata: {
          set: {
            lastActiveAt: new Date(),
          },
        },
      },
    });

    await this.awardReferralCoinsIfEligible(userId);
    return updatedUser;
  }

  /**
   * Request free daily coins for Beta users
   */
  async requestFreeCoins(userId) {
    // In production, delegates to margyam-payments via gRPC
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.NotFound('User not found');
    return { message: 'Free coins requested successfully', coinsAdded: 50 };
  }

  /**
   * Update preferred language
   */
  async updateLanguage(userId, languageCode, action = 'SETTINGS_DRAWER') {
    await prisma.languageMetadata.create({
      data: { userId, languageCode, action },
    });
    return prisma.user.update({
      where: { id: userId },
      data: { preferredLanguage: languageCode },
    });
  }

  /**
   * Update Web Push subscription object
   */
  async updatePushSubscription(userId, subscriptionPayload) {
    return prisma.user.update({
      where: { id: userId },
      data: { pushSubscription: subscriptionPayload },
    });
  }

  async awardReferralCoinsIfEligible(userId) {
    try {
      const referral = await prisma.referral.findFirst({
        where: { referredUserId: userId, isCompleted: false },
      });
      if (!referral) return;

      await prisma.referral.update({
        where: { id: referral.id },
        data: { isCompleted: true, completedAt: new Date(), coinsAwarded: REFERRAL_COINS },
      });
    } catch (err) {}
  }

  async list({ page, limit }) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.user.count(),
    ]);
    return { items, total };
  }

  async delete(userId) {
    return prisma.user.delete({ where: { id: userId } });
  }

  async getOnboardingStatus(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.onboarding || { currentStep: 'PHONE', isComplete: false };
  }

  async completeStep(userId, stepData) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        onboarding: {
          set: {
            currentStep: stepData.currentStep || 'PHONE',
            isComplete: stepData.isComplete ?? false,
            updatedAt: new Date(),
          },
        },
      },
    });
    return user.onboarding;
  }
}

export default new UserService();
