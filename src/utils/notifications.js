// Utility functions for notification data mapping and enrichment

export function mapNotificationResponseToUI(notification) {
  return {
    id: notification.id,
    type: notification.type,
    message: notification.message,
    createdAt: notification.createdAt,
    // Add more fields as needed
  };
} 