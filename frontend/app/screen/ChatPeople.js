import {
  View,
} from "react-native";
import { useState, useCallback , useLayoutEffect} from "react";
import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import { db } from "../../firebase";
import Path from "../../path";

function ChatPeople({ route }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(route.params.user);
  let target_id = route.params.data.item.user_id;
  async function getAllMessage() {
    const docId =
      target_id > users.user_id
        ? users.user_id + "-" + target_id
        : target_id + "-" + users.user_id;
    const chatData = await db
      .collection("chats")
      .doc(docId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          }))
        );
      });
    return chatData;
  }
  useLayoutEffect(() => {
    getAllMessage();
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            style={{ marginBottom: 5, marginRight: 5 }}
            name="send-circle"
            size={32}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2e64e5",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };

  const onSend = useCallback((messages = []) => {
    const docId =
    target_id > users.user_id
      ? users.user_id + "-" + target_id
      : target_id + "-" + users.user_id;
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    db.collection("chats").doc(docId).collection("messages").add({ _id, createdAt, text, user });
  }, []);
  const docId =
    target_id > users.user_id
      ? users.user_id + "-" + target_id
      : target_id + "-" + users.user_id;
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      showAvatarForEveryMessage={true}
      alwaysShowSend
      user={{
        _id: users.user_id,
        email: users.email,
        avatar: `${Path}` + users.img,
        _target: target_id,
        room: docId,
      }}
      renderBubble={renderBubble}
      renderSend={renderSend}
    />
  );
}
export default ChatPeople;
