import prisma from '../configs/db.js';
import { ApiError, ProcessHelpers } from '../common/index.js';
import { calculateChart } from '../system/grpc/clients/astro.client.js';
import moment from 'moment';

class PublicService {
  /**
   * Calculates public Kundli for unauthenticated landing page funnel guests.
   * Calculates chart via gRPC call to Service B (margyam-ai), creates/updates guest user,
   * stores top-level kundliData, and issues a signed JWT session token.
   */
  async calculatePublicKundli(payload) {
    const { fullName, dateOfBirth, timeOfBirth, placeOfBirth, lat, lon, deviceId, email } = payload;

    if (!fullName || !dateOfBirth || !placeOfBirth) {
      throw ApiError.BadRequest('Name, Date of Birth, and Place of Birth are required');
    }

    const effectiveDeviceId = deviceId || `guest_${ProcessHelpers.generateAlphanumeric(10)}`;

    // ── Calculate Kundli chart via gRPC to margyam-ai ────────────────────────
    let kundliData = null;
    try {
      const chartResponse = await calculateChart({
        userId: 'public_guest',
        latitude: parseFloat(lat || 28.6139),
        longitude: parseFloat(lon || 77.2090),
        date_of_birth: dateOfBirth,
        time_of_birth: timeOfBirth || '12:00',
        timezone: 'Asia/Kolkata',
      });

      if (chartResponse && chartResponse.success) {
        kundliData = JSON.stringify(chartResponse);
      }
    } catch (err) {
      // Proceed gracefully
    }

    let user = null;
    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    if (normalizedEmail) {
      user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    }

    if (normalizedEmail && user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          fullName,
          dateOfBirth,
          timeOfBirth: timeOfBirth || '',
          placeOfBirth,
          deviceId: effectiveDeviceId,
          isGuest: false,
          kundliData: kundliData || undefined,
          profileCompleted: true,
        },
      });
    } else {
      const referralCode = ProcessHelpers.generateAlphanumeric(6).toUpperCase();
      const tempEmail = normalizedEmail || `guest_${effectiveDeviceId}@margyam.temp`;

      user = await prisma.user.create({
        data: {
          deviceId: effectiveDeviceId,
          email: tempEmail,
          isGuest: !normalizedEmail,
          fullName,
          dateOfBirth,
          timeOfBirth: timeOfBirth || '',
          placeOfBirth,
          kundliData: kundliData || undefined,
          profileCompleted: true,
          referralCode,
        },
      });
    }

    const token = ProcessHelpers.signToken({ userId: user.id, role: user.role, deviceId: user.deviceId }, process.env.JWT_SECRET || 'secret');
    return { user, token };
  }

  /**
   * Returns daily guidance forecast for guest device
   */
  async getPublicGuidanceToday(deviceId) {
    if (!deviceId) throw ApiError.BadRequest('Device ID is required');

    const user = await prisma.user.findFirst({ where: { deviceId } });
    if (!user) throw ApiError.NotFound('No session found for this device');

    const today = moment().format('YYYY-MM-DD');
    const guidance = await prisma.dailyGuidance.findMany({
      where: { userId: user.id, date: today },
      orderBy: { createdAt: 'asc' },
    });

    return guidance;
  }
}

export default new PublicService();
