import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Preview from "./Preview";

const Users = ({ token, validated, setValidated, setImage }) => {
  const [users, setUsers] = useState([]);
  const [snapTime, setSnapTime] = useState(3);
  const [toUser, setToUser] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetch("http://snapi.epitech.eu:8000/all", {
      headers: {
        token: token,
      },
      method: "GET",
    })
      .then(async (res) => {
        return await res.json();
      })
      .then((res) => {
        setUsers(res.data);
      });
  }, []);

  const back = () => {
    setImage(validated.image);
    setValidated({ valid: false, image: false });
  };

  const handlePick = (email) => {
    setToUser(email);
  };

  return (
    <View style={styles.container}>
      {!toUser ? (
        <>
          <TouchableOpacity style={styles.backCont} onPress={back}>
            <Text style={styles.button}>🔙</Text>
          </TouchableOpacity>
          <ScrollView>
            {users.map((user, i) => (
              <View style={styles.user} key={i}>
                <TouchableOpacity
                  value={user.email}
                  onPress={(e) => handlePick(user.email)}
                >
                  <Text style={styles.CircleShape} />
                  <Text style={styles.userLogin}>{user.email}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <Preview
          token={token}
          setImage={setImage}
          validated={validated}
          setValidated={setValidated}
          snapTime={snapTime}
          setSnapTime={setSnapTime}
          toUser={toUser}
          setToUser={setToUser}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  user: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
  },
  userLogin: {
    marginTop: -17,
    marginBottom: 17,
  },

  CircleShape: {
    width: 20,
    height: 20,
    borderRadius: 150 / 2,
    backgroundColor: "transparent",
    borderColor: "black",
    borderWidth: 1,
    marginTop: 15,
    alignSelf: "flex-end",
  },
  backCont: {
    width: "100%"
  },
  button: {
    marginTop: 15,
    marginLeft: 20,
    alignSelf: "flex-start",
    fontSize: 20,  
  },
});

export default Users;
