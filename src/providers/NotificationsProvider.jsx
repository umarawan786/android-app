import React from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../helpers/registerForPushNotificationsAsync";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";
import { useRouter } from "expo-router";

const NotificationsContext = React.createContext({});

const NotificationsProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = React.useState(null);
  const [notifications, setNotifications] = React.useState(null);
  const [error, setError] = React.useState(null);

  const notificationsListener = React.useRef();
  const responseListener = React.useRef();

  const { profile } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // Upload to db
    const updateExpoToken = async () => {
      const { error } = await supabase.from("expo_push_tokens").upsert(
        {
          profile_id: profile.id,
          "expo-push-token": expoPushToken,
        },
        { onConflict: ["profile_id"] } // profile_id has a uniqueness constraint
      );

      console.error(error);
    };

    if (profile && expoPushToken) {
      updateExpoToken();
    }
  }, [expoPushToken]);

  React.useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationsListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // App open, notif received, do smthng
        console.log("Notification: ", notification);
        setNotifications(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // When a user interacts with the notification
        console.log(
          "Notification Response",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );

        const data = response.notification.request.content.data || null;
        const { route, notification_data } = data;

        if (route) {
          router.push({
            pathname: `/${route}`,
            params: {
              notification_id: notification_data.id,
              notification_type: notification_data.type,
            },
          });
        }
      });

    return () => {
      if (notificationsListener.current) {
        Notifications.removeNotificationSubscription(
          notificationsListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const value = React.useMemo(
    () => ({ expoPushToken, notifications, error }),
    [expoPushToken, notifications, error]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;

export const useNotificationsContext = () => {
  const context = React.useContext(NotificationsContext);

  if (context === undefined) {
    throw new Error(
      "Wrap this component with NotificationsProvider to use this context"
    );
  }

  return context;
};
