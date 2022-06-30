import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Register = ({}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);
  const navigation = useNavigation();

  const handleRegister = () => {

    if (email !== "" && password !== "") {
      const body = {
        email: email,
        password: password
      };

      fetch("http://snapi.epitech.eu:8000/inscription", {
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        method: "POST"
      })
      .then(async (res) => {
        return await res.json();
      })
      .then(async (res) => {
        console.log(res);
        navigation.navigate("Login", {email: res.data.email});
      })
      .catch((error) => {
        console.log(error)
        setMessage(res.data.error);
      });
    } else {
      setMessage('You must fill every field');
    }
  }

  return (
    <View style={styles.container}>
      {(message) ? (
        <View>
          <Text>{message}</Text>
        </View>
      ) : <></>}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <Button
        onPress={handleRegister}
        title="Register"
      />

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.registerText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  inputView: {
    backgroundColor: "#e8e5dc",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  TextInput: {
    height: 50,
    textAlign: "center",
    // flex: 1,
    padding: 10,
  },

  registerText: {
    fontSize: 16,
    textDecorationLine: "underline",
  },

  registerBtn: {
    width: "20%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    //   backgroundColor: "#FF1493",
  },
});

export default Register;
