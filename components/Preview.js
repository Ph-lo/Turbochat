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

export default function Preview({
  token,
  setImage,
  validated,
  setValidated,
  snapTime,
  setSnapTime,
  toUser,
  setToUser,
}) {
  const navigation = useNavigation();
  const sendSnap = () => {
    let filename = validated.image.split("/").pop();
    let type = "image/" + filename.split(".").pop();

    let formData = new FormData();
    formData.append("duration", snapTime);
    formData.append("to", toUser);
    formData.append("image", {
      uri: validated.image,
      name: filename,
      type: type,
    });

    fetch("http://snapi.epitech.eu:8000/snap", {
      headers: {
        "Content-Type": "multipart/form-data",
        token: token,
      },
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        return await res.json();
      })
      .then((res) => {
        console.log(res.data);
        alert("snap sent !");
        setImage(null);
        setValidated({ valid: false, image: false });
        navigation.goBack();
      })
      .catch((error) => {
        console.log(console.log(error));
        alert(error.data);
      });
  };

  const back = () => {
    setToUser(false);
  };

  return (
    <>
      <View style={styles.main}>
        <TouchableOpacity onPress={back}>
          <Text style={styles.button}>🔙</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.TextInput}
          placeholder="3"
          keyboardType="numeric"
          placeholderTextColor="#003f5c"
          onChangeText={(time) => setSnapTime(parseInt(time))}
        />
        <TouchableOpacity onPress={sendSnap}>
          <Text style={styles.TextInput2}>✓</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View></View>
        <View style={styles.containerPic}>
          <Image source={{ uri: validated.image }} style={styles.camera} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    marginTop: 40,
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
    marginTop: -85,
    backgroundColor: "#000",
    justifyContent: "center",
    height: "80%",
    width: "100%",
  },
  button: {
    marginTop: 15,
    fontSize: 20,  
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
    marginTop: 7,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 50,
    textAlign: "center",
  },
  TextInput2: {
    height: 30,
    width: 30,
    paddingTop: 2,
    marginTop: 7,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 50,
    textAlign: "center",
    fontSize: 20,
  },
  camera: {
    flex: 1,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
});
