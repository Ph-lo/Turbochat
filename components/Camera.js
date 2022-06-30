import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Entypo } from "@expo/vector-icons";
import Button from "./Button";
import Users from "./Users";
import {
  NavigationContainer,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";

export default function CameraPage({navigation, route}) {
  const [hasCameraPermission, setHasCameraPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [validated, setValidated] = useState({ valid: false, image: false });
  // console.log(route.params.isAuth);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPosition(cameraStatus.status === "granted");
    })();
  }, []);

  const validateImage = () => {
    // console.log(validated);
    setValidated({valid: true, image: image});
    setImage(null);
    // show users
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    //   aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert("Picture saved !");
        setImage(null);
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      {(validated.valid && validated.image && !image) ? (
      <Users token={route.params.isAuth} validated={validated} setValidated={setValidated} setImage={setImage} />
      // <Text>CACA</Text>
      ) : (
      <View style={styles.container}>
        { !image && isFocused ? (
          <Camera
            style={styles.camera}
            type={type}
            flashMode={flash}
            ref={cameraRef}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 30,
              }}
            >
              <Button
                icon={"retweet"}
                onPress={() => {
                  setType(
                    type === CameraType.back ? CameraType.front : CameraType.back
                  );
                }}
              />
              <Button
                icon={"flash"}
                color={
                  flash === Camera.Constants.FlashMode.off ? "gray" : "#f1f1f1"
                }
                onPress={() => {
                  setFlash(
                    flash === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off  
                  );
                }}
              />
            </View>
          </Camera>
        ) : (
          <Image source={{ uri: image }} style={styles.camera} />
        )}
        <View>
                <Image source={{ uri: image }} style={styles.edit} />
                
          { image ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingTop: 15,
              }}
            >
              <Button
                title={"Re-take"}
                icon="retweet"
                onPress={() => setImage(null)}
              />
              <Button title={"Save"} icon="download" onPress={saveImage} />
              <Button title={"Save"} icon="check" onPress={validateImage} /> 
              <Button name={"edit"} icon={"edit"} />                     
            </View>
          ) : (
            <View style={styles.bottomBut}>
              <Button
                title={"Take a picture"}
                icon="camera"
                onPress={takePicture}
              />
              <Button title={'Choose from gallery'} icon="upload" onPress={pickImage}/>
            </View>
          )}
        </View>
      </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingBottom: 20,
    // paddingTop: 20
  },
  camera: {
    flex: 1,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15
  },
  bottomBut: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingHorizontal: 100,
    paddingTop: 15
  },
  
});
