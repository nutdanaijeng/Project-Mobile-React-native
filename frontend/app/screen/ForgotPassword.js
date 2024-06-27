import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
  Feather
} from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Path from "../../path";

function ResetPasword(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [sec, setSec] = useState(true);
  const [secCon, setSeccon] = useState(true);
  const [checkpass, setCheckpass] = useState(false);
  const [secret, setSecret] = useState("");
  const [key, setKey] = useState("");
  const [confirmPass, setConfirmpass] = useState("");
  let TextError = null;

  const checkHandle = async () => {
    setCheckpass(false);
    if (!email) {
      alert("Please Enter Email");
    } else if (email.indexOf("@it.kmitl.ac.th") == -1) {
      alert("Please use email IT KMITL");
    } else if (!password) {
      alert("Please Enter Password");
    } else if (!confirmPass) {
      alert("Please Enter Confirm Password");
    } else if (password != confirmPass) {
      alert("Password not match");
      setCheckpass(true);
    } else if (!key) {
      alert("Please Enter Secret Key");
    } else if (key != secret) {
      alert("Secret key is not true");
    } else {
      axios
        .post(`${Path}/resetPassword`, {
            email : email,
            password : password
        })
        .then((response) => {
          if (response.data == "success") {
            alert("Reset Password Success");
            {
              props.navigation.replace("login");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const sendSecretCode = () => {
    axios
      .post(`${Path}/resetPasswordMail`, { email: email })
      .then((response) => {
        alert("Send Success");
        setSecret(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (error) {
    TextError = (
      <Text style={{ color: "red", marginBottom: 10, fontSize: 15 }}>
        The username or password is incorrect
      </Text>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logocontainer}>
        <Image
          style={styles.logo}
          source={require("../assets/logo_login.png")}
        />
      </View>
      <View style={styles.box}>
        <View
          style={[
            styles.inputcontainer,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          {/* <Zocial name="email" size={24} color="black" /> */}
          <FontAwesome style={styles.user} name="user-o" size={24} color="gray" />
          <TextInput
            style={[styles.input, { width: "65%" }]}
            placeholder="Email"
            placeholderTextColor={"darkgrey"}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(mail) => {
              setEmail(mail);
            }}
          />
          <TouchableOpacity
            style={[styles.button_send, { width: "30%" }]}
            onPress={() => {
              sendSecretCode();
            }}
          >
            <Text style={{ color: "white", fontSize: 15 }}>Send</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputcontainer}>
          <Ionicons style={styles.key} name="key-outline" size={24} color="gray" />
          <TextInput
            style={styles.input}
            placeholder="Secret Key"
            placeholderTextColor={"darkgrey"}
            autoCapitalize="none"
            onChangeText={(key) => {
              setKey(key);
            }}
          />
        </View>
        <View style={styles.inputcontainer}>
          <MaterialIcons
            style={styles.password}
            name="lock-outline"
            size={24}
            color="gray"
          />
          <TextInput
            style={styles.input}
            // autoCapitalize='none'
            placeholder="Password"
            placeholderTextColor={"darkgrey"}
            secureTextEntry={sec}
            autoCorrect={false}
            onChangeText={(pass) => {
              setPassword(pass);
            }}
          />
          <TouchableOpacity
            style={styles.secret}
            onPress={() => {
              setSec(!sec);
            }}
          >
            {!sec && <Ionicons name="eye-outline" size={24} color="gray" />}
            {sec && <Ionicons name="eye-off-outline" size={24} color="gray" />}
          </TouchableOpacity>
        </View>
        <View style={styles.inputcontainer}>
          <MaterialCommunityIcons
            style={styles.password}
            name="lock-plus-outline"
            size={24}
            color="gray"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={"darkgrey"}
            secureTextEntry={secCon}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(pass) => {
              setConfirmpass(pass);
            }}
          />
          <TouchableOpacity
            style={styles.secret}
            onPress={() => {
              setSeccon(!secCon);
            }}
          >
            {!secCon && <Ionicons name="eye-outline" size={24} color="gray" />}
            {secCon && <Ionicons name="eye-off-outline" size={24} color="gray" />}
          </TouchableOpacity>
          {checkpass ? (
            <Text style={{ color: "red", marginTop: 5 }}>
              Password not match
            </Text>
          ) : null}
        </View>
        <View style={[styles.inputcontainer, { marginBottom: 0 }]}>
          <TouchableOpacity style={styles.button} onPress={checkHandle}>
            <Text style={{ color: "white", fontSize: 15 }}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8EA",
    paddingTop: 30,
    paddingHorizontal : 25,
    flex: 1,
  },
  text: {
    fontSize: 20,
  },
  TextInput: {
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: 330,
    paddingLeft: 35,
    padding: 15,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 2,
    //   height: 4,
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: 3,
    // elevation: 5,
    // backgroundColor: "white",
    marginVertical: 9,
    borderColor: "darkgrey",
    borderBottomWidth: 1,
    fontSize: 18,
    color: "gray",
  },
  button: {
    width: 330,
    backgroundColor: "#FF9A00",
    alignItems: "center",
    padding: 13,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
    marginVertical: 9,
  },
  countContainer: {
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  box: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
    marginVertical: 9,
  },
  logo: {
    width: 300,
    height: 140,
  },
  logocontainer: {
    // flex : 1,
    alignItems: "center",
  },
  cop: {
    alignItems: "center",
  },
  secret: {
    position: "absolute",
    right: 8,
    top: 22,
  },
  user: {
    position: "absolute",
    left: 9,
    top: 22,
  },
  password: {
    position: "absolute",
    left: 6,
    top: 24,
  },
  key: {
    position: "absolute",
    left: 6,
    zIndex: 2,
  },
  button_send: {
    width: "100%",
    backgroundColor: "#FF9A00",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  inputcontainer: {
    alignItems: "center",
    // marginBottom: 25,
    justifyContent: "center",
  },
});
export default ResetPasword;
