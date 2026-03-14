// components/NotificationList.js

export default function NotificationList({ notifications }) {
  return (
    <>
      {notifications && notifications.length > 0 ? (
        notifications.map((msg, key) => (
          <div
            key={key}
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
          >
            {msg}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm text-center">
          No new notifications 🎉
        </p>
      )}
    </>
  );
}