import notifee, { 
  AndroidImportance, 
  AndroidCategory, 
  AndroidVisibility, 
  EventType,
  AndroidBadgeIconType
} from '@notifee/react-native';
import { Platform, Vibration } from 'react-native';

// Store for recently processed notifications
const processedNotifications = new Map();
const DEDUP_TIMEOUT = 5000;

class NotifeeService {
  constructor() {
    this.initialized = false;
  }

  initialize = async () => {
    if (this.initialized) return;
    
    try {
      console.log('🚀 Initializing Notifee...');
      
      // Request permission
      const settings = await notifee.requestPermission();
      console.log('📱 Permission settings:', settings);
      
      // Create channels
      await this.createChannels();
      
      this.setupListeners();
      this.initialized = true;
      console.log('✅ Notifee initialized');
    } catch (error) {
      console.log('❌ Init error:', error);
    }
  };

  createChannels = async () => {
    try {
      // Delete existing channels first to ensure clean state
      try {
        await notifee.deleteChannel('urgent_channel');
      } catch (e) {}
      
      try {
        await notifee.deleteChannel('ticket_channel');
      } catch (e) {}

      // Create urgent channel with minimal settings
      await notifee.createChannel({
        id: 'urgent_channel',
        name: 'Urgent Notifications',
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'default',
        visibility: AndroidVisibility.PUBLIC,
        bypassDnd: true,
      });

      console.log('✅ Channels created');
    } catch (error) {
      console.log('❌ Channel error:', error);
    }
  };

  setupListeners = () => {
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('📱 Notification pressed');
        if (detail.notification?.data) {
          this.handleNotificationPress(detail.notification.data);
        }
      }
    });
  };

  handleNotificationPress = (data) => {
    console.log('🔔 Notification pressed:', data);
    // Handle navigation based on notification data
    // You can emit an event or use a global navigation ref here
  };

  generateNotificationKey = (remoteMessage) => {
    const data = remoteMessage.data || {};
    if (data.ticket_request_id) {
      return `ticket_${data.ticket_request_id}`;
    }
    return `notif_${Date.now()}_${Math.random()}`;
  };

  displayNotification = async (remoteMessage) => {
    try {
      const now = Date.now();
      const data = remoteMessage.data || {};
      
      console.log('📱 Processing notification:', data);
      
      // Generate unique key
      const notificationKey = this.generateNotificationKey(remoteMessage);
      
      // Deduplication
      for (const [key, timestamp] of processedNotifications.entries()) {
        if (now - timestamp > DEDUP_TIMEOUT) {
          processedNotifications.delete(key);
        }
      }
      
      if (processedNotifications.has(notificationKey)) {
        console.log(`⏭️ Duplicate prevented: ${notificationKey}`);
        return null;
      }
      
      processedNotifications.set(notificationKey, now);
      
      // Extract title and body from notification data
      let title = '📝 New Notification';
      let body = 'You have a new notification';
      
      // Check notification object first
      if (remoteMessage.notification) {
        title = remoteMessage.notification.title || title;
        body = remoteMessage.notification.body || body;
      }
      
      // Override with data fields if available
      if (data.title) title = data.title;
      if (data.message || data.body) body = data.message || data.body;
      
      // Special formatting for ticket requests
      const isTicketRequest = data.ticket_request_id;
      if (isTicketRequest) {
        title = '🎫 New Ticket Request';
        const userName = data.user_name || 'Someone';
        const quantity = data.ticket_quantity || '';
        const gameName = data.game_name || 'your game';
        body = `${userName} requested ${quantity} ticket(s) for ${gameName}`;
        
        // Add amount if available
        if (data.total_amount) {
          body += `\n💰 Amount: ₹${data.total_amount}`;
        }
      }
      
      console.log(`📨 Showing: ${title}`);
      console.log(`📝 Body: ${body}`);
      
      // 🔥 FIXED: Remove badgeIconType and use correct AndroidBadgeIconType
      const notificationId = await notifee.displayNotification({
        id: notificationKey,
        title: title,
        body: body,
        data: data,
        android: {
          channelId: 'urgent_channel',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
          priority: 'high',
          autoCancel: true,
          showTimestamp: true,
          timestamp: now,
          // Remove badgeIconType or use proper enum
          color: '#4facfe',
        },
        ios: {
          foregroundPresentationOptions: {
            banner: true,
            list: true,
            badge: true,
            sound: true,
            alert: true,
          },
        },
      });
      
      console.log('✅ Notification displayed with ID:', notificationId);
      
      // Trigger vibration for immediate feedback
      if (Platform.OS === 'android') {
        try {
          Vibration.vibrate(500);
          console.log('📳 Vibration triggered');
        } catch (e) {
          console.log('Vibration not supported');
        }
      }
      
      // Also try to show a heads-up notification as a second notification
      setTimeout(async () => {
        try {
          const headsUpId = await notifee.displayNotification({
            id: `${notificationKey}_heads`,
            title: title,
            body: body,
            data: data,
            android: {
              channelId: 'urgent_channel',
              importance: AndroidImportance.HIGH,
              pressAction: {
                id: 'default',
                launchActivity: 'default',
              },
              smallIcon: 'ic_launcher',
              priority: 'max',
              fullScreenAction: {
                id: 'default',
                launchActivity: 'default',
              },
              category: AndroidCategory.SOCIAL,
              autoCancel: true,
              asForegroundService: true,
              timeoutAfter: 10000,
              showTimestamp: true,
              timestamp: Date.now(),
            },
          });
          console.log('✅ Heads-up also displayed:', headsUpId);
        } catch (error) {
          console.log('Heads-up failed:', error.message);
        }
      }, 100);
      
      return notificationId;
      
    } catch (error) {
      console.log('❌ Error displaying notification:', error.message);
      
      // If all else fails, try with absolute minimal configuration
      try {
        console.log('🔄 Trying minimal notification...');
        
        // Extract title and body for minimal notification
        let title = 'New Ticket Request';
        let body = 'You have a new ticket request';
        
        if (remoteMessage.data) {
          const data = remoteMessage.data;
          if (data.user_name && data.ticket_quantity && data.game_name) {
            body = `${data.user_name} requested ${data.ticket_quantity} ticket(s) for ${data.game_name}`;
          }
        }
        
        const minimalId = await notifee.displayNotification({
          title: title,
          body: body,
          data: remoteMessage.data || {},
          android: {
            channelId: 'urgent_channel',
            importance: AndroidImportance.HIGH,
          },
        });
        console.log('✅ Minimal notification displayed:', minimalId);
        return minimalId;
      } catch (minError) {
        console.log('❌ All methods failed:', minError.message);
        return null;
      }
    }
  };

  testNotification = async () => {
    console.log('🔔 Testing notification...');
    await this.initialize();
    
    await this.displayNotification({
      notification: {
        title: '🔔 TEST NOTIFICATION',
        body: 'If you can see this, notifications are working!',
      },
      data: {
        type: 'test',
        timestamp: Date.now().toString(),
      },
    });
  };

  checkNotificationSettings = async () => {
    try {
      const settings = await notifee.getNotificationSettings();
      console.log('🔍 Settings:', {
        authorizationStatus: settings.authorizationStatus,
        android: settings.android,
      });
    } catch (error) {
      console.log('Could not check settings:', error);
    }
  };
}

export default new NotifeeService();