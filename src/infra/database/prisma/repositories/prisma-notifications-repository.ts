import { Injectable } from '@nestjs/common';
import { Notification } from '../../../../application/entities/notification';
import { NotificationsRepository } from '../../../../application/repositories/notifications-repository';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
    constructor(private prisma: PrismaService) {}

    async countManyByRecipientId(recipientId: string): Promise<number> {
        const count = await this.prisma.notification.count({
            where: {
                recipientId,
            },
        });

        return count;
    }

    async findManyByRecipientId(recipientId: string): Promise<Notification[]> {
        const notification = await this.prisma.notification.findMany({
            where: {
                recipientId,
            },
        });

        return notification.map(PrismaNotificationMapper.toDomain);
    }

    async create(notification: Notification): Promise<void> {
        const raw = PrismaNotificationMapper.toPrisma(notification);

        await this.prisma.notification.create({
            data: raw,
        });
    }

    async findById(notificationId: string): Promise<Notification | null> {
        const notification = await this.prisma.notification.findUnique({
            where: {
                id: notificationId,
            },
        });

        if (!notification) {
            return null;
        }

        return PrismaNotificationMapper.toDomain(notification);
    }

    async save(notification: Notification): Promise<void> {
        const raw = PrismaNotificationMapper.toPrisma(notification);
        await this.prisma.notification.update({
            where: {
                id: raw.id,
            },
            data: raw,
        });
    }
}
