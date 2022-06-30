import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Snap({
  image,
  setSnap,
  duration,
  setDuration,
  token,
  snapId
}) {

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  useEffect(() => {
    if (duration <= 0)
      return
    (async () => {
      await sleep(1000);
      setDuration(duration - 1);
      if (duration - 1 === 0) {
        console.log("Snap end");
        deleteSnap();
        setSnap(false);
      }
    })(); 
  }, [duration]);

  const deleteSnap = () => {
    fetch("http://snapi.epitech.eu:8000/seen", {
      headers: {
        "Content-Type": "application/json",
        token: token
      },
      body: JSON.stringify({
        id: snapId
      }),
      method: "POST"
    })
    .then(async (res) => {
      return await res.text();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => console.log(error));
  };
  const navigation = useNavigation();
  const back = () => {
    setSnap(false);
  };

  return (
    <>
      <View style={styles.main}>
        <TouchableOpacity onPress={back}>
          <Text style={styles.button}>back</Text>
        </TouchableOpacity>
        <Text style={styles.TextInput}>{duration}</Text>
      </View>
      <View style={styles.container}>
        
        <View style={styles.containerPic}>
          <Image source={{ uri: image }} style={styles.camera} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    marginTop: 20,
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    backgroundColor: "#000",
    justifyContent: "center",
    marginLeft: -20,
    height: "100%",
    width: "110%",
  },
  containerPic: {
    marginTop: -145,
    backgroundColor: "#000",
    justifyContent: "center",
    height: "80%",
    width: "100%",
  },
  button: {
    marginTop: 6
  },
  valid: {
    color: "white",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#f1f1f1",
    marginLeft: 10,
  },
  TextInput: {
    height: 30,
    width: 30,
    paddingTop: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 50,
    textAlign: "center",
  },
  camera: {
    flex: 1,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
});
