import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Camera from "./components/Camera";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import AsyncStorage from "@react-native-async-storage/async-storage";

const MyStack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
// const navigation = useNavigation();

export default function App() {
  const [isAuth, setIsAuth] = useState("");

  const setAuth = (value) => {
    setIsAuth(value);
  };

  const getUserInfos = async () => {
    try {
      const data = await AsyncStorage.getItem("auth");
      if (data == null) {
        setAuth(false);
      } else {
        setAuth(data);
      }
    } catch (e) {
      console.log(e);
      setAuth(false);
    }
  };

  React.useEffect(() => {
    getUserInfos();
  }, []);

  console.log(isAuth);

  return (
    <NavigationContainer>
      {!isAuth ? (
        <MyStack.Navigator>
          <MyStack.Screen
            name="Login"
            initialParams={{ isAuth: isAuth }}
          >
            {(props) => <Login {...props} setAuth={setAuth} />}
          </MyStack.Screen>
          <MyStack.Screen name="Register" component={Register} />
        </MyStack.Navigator>
      ) : (
        <Tab.Navigator style={styles.container}>
          <Tab.Screen
            name="Home"
            initialParams={{ isAuth: isAuth }}
          >
            {(props) => <Home {...props} setAuth={setAuth} />}
          </Tab.Screen>
          <Tab.Screen name="Camera" component={Camera} initialParams={{ isAuth: isAuth }}/>
        </Tab.Navigator>
      )}

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    // paddingTop: 20,
    marginTop: 25
  },
});
