import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snap from "./Snap";

const Home = ({ navigati, route, setAuth }) => {
  // console.log(route.params.isAuth);

  const [snaps, setSnaps] = useState([]);
  const [snap, setSnap] = useState(false);
  const [duration, setDuration] = useState(0);
  const [snapId, setSnapId] = useState();
  // const [userToken, setUserToken] = useState("");
  //   console.log(users);
  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("popp!");
      fetch("http://snapi.epitech.eu:8000/snaps", {
      headers: {
        token: route.params.isAuth,
      },
      method: "GET",
    })
      .then(async (res) => {
        return await res.json();
      })
      .then((res) => {
        setSnaps(res.data);
        // console.log(res);
      })
      .catch((error) => console.log(error));
    }, 1000);

    
    return () => clearInterval(interval);
  }, [snap]);

  const Logout = () => {
    const deleteData = async () => {
      setAuth(false);
      await AsyncStorage.removeItem("auth");
    };
    deleteData();
  };

  const getSnap = async (id, duration) => {
    // const token = route.params.isAuth;
    // console.log(id)
    setSnapId(id);
    setDuration(duration);
    await fetch("http://snapi.epitech.eu:8000/snap/" + id, {
      headers: {
        token: route.params.isAuth,
      },
      method: "GET",
    })
      // .then((res) => res.blob())
      .then(async (res) => {
        return await res.blob();
      })
      // .then(res => console.log(res))

      .then((res) => {
        // if (Platform.OS === "ios") {
        //   RNFetchBlob.ios.openDocument(res);
        // }
        const blob = new Blob([res], {
          type: "image",
        });

        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
        fileReader.onload = () => {
          let base64 = fileReader.result;
          setSnap(base64);
          // console.log(base64)
          // console.log(snap)
        };
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.main}>
      {!snap ? (
        <>
          <TouchableOpacity style={styles.logout} onPress={Logout}>
            <Text>LOGOUT</Text>
          </TouchableOpacity>
          <ScrollView>
            {snaps.map((snap, i) => (
              <View style={styles.user} key={snap.snap_id}>
                <TouchableOpacity
                  value={snap.from}
                  onPress={() => getSnap(snap.snap_id, snap.duration)}
                >
                  <View>
                    <Text style={styles.userLogin}>{snap.from}</Text>
                    <Image
                      source={require("../assets/camera.png")}
                      style={styles.logoPhoto}
                    />
                  </View>
                  <Text style={styles.duration}>{snap.duration}s</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <Snap
          image={snap}
          setSnap={setSnap}
          duration={duration}
          setDuration={setDuration}
          token={route.params.isAuth}
          snapId={snapId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginBottom: 25,
  },
  container: {
    paddingLeft: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  user: {
    backgroundColor: "white",
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    // alignSelf: 'flex-end',
  },

  duration: {
    alignSelf: "flex-start",
    fontSize: 12,
  },

  logout: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#A8EAA8",
  },
  userLogin: {
    alignSelf: "flex-start",
    marginBottom: -10,
    fontSize: 16,
  },
  logoPhoto: {
    alignSelf: "flex-end",
  },
});

export default Home;
