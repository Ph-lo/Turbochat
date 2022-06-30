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
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigati, route, setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);
  const navigation = useNavigation();
  // console.log(route.params.email);
  const handleLogin = () => {
    
    if (email !== "" && password !== "") {
      const body = {
        email: email,
        password: password
      };

      fetch("http://snapi.epitech.eu:8000/connection", {
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
        setAuth(res.data.token);
        if (res.data.token) {
          await AsyncStorage.setItem('auth', res.data.token);
        } else {
          setMessage(res.data);
        }
      })
      .catch((error) => {
        console.log(error)
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
      {(route.params.email) ? (
        <View>
          <Text>Account created !</Text>
        </View>
      ) : <></>}
      <View>
        <Image
          source={require("../assets/logooo.png")}
          style={styles.logooPhoto}
          />
      </View>
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
        onPress={handleLogin}
        title="Login"
      />

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8EAA8",
    alignItems: "center",
    justifyContent: "center",
  },

  inputView: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  TextInput: {
    height: 50,
    textAlign: 'center',
    padding: 10,
  },

  registerText: {
    fontSize: 18,
    textDecorationLine: 'underline',
  },

  logooPhoto: {
    width: 250,
    height: 350,
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

export default Login;
