import { useNotification } from "../store";

const Notification = () => {
  const { message, isSuccess } = useNotification();

  if (!message) return null;

  const style = isSuccess
    ? {
        border: "solid",
        color: "green",
        padding: 10,
        borderWidth: 1,
        marginBottom: 10,
      }
    : {
        border: "solid",
        color: "red",
        padding: 10,
        borderWidth: 1,
        marginBottom: 10,
      };

  return <div style={style}>{message}</div>;
};

export default Notification;
