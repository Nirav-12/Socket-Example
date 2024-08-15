import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import io from "socket.io-client";

export default function App() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const socket = io("http://localhost:3000"); // <------- replace it with ip adress

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to socket server");
    });

    socket.on("message", (msg) => {
      setChatMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {chatMessages.map((msg, index) => (
          <Text key={index} style={styles.chatMessage}>
            {msg}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.input}>
        <TextInput
          onChangeText={setMessage}
          value={message}
          placeholder="Enter city name"
          style={styles.text_input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.send_btn}>
          <Text style={styles.send_txt}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  chatMessage: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    marginVertical: 5,
    borderRadius: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text_input: {
    width: "80%",
    padding: 10,
  },
  send_btn: { backgroundColor: "black", padding: 5, borderRadius: 5 },
  send_txt: { color: "white", fontSize: 18, fontWeight: "500" },
});
