import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as React from "react";
import axios from "axios";
import {
  AntDesign,
  Zocial,
  Ionicons,
  MaterialIcon,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Path from "../../path";

function Register(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPass, setConfirmpass] = React.useState("");
  const [key, setKey] = React.useState("");
  const [checkpass, setCheckpass] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [objectImg, setObjectImg] = React.useState([]);
  const [secret, setSecret] = React.useState("");
  const [sec, setSec] = React.useState(true);
  const [secCon, setSeccon] = React.useState(true);
  const checkHandle = () => {
    // console.log(email.indexOf("@it.kmitl.ac.th"));
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
      const data = new FormData();
      const newImageUri = "file:///" + objectImg.uri.split("file:/").join("");
      data.append("email", email);
      data.append("password", password);
      data.append("profile", {
        uri: newImageUri,
        type: "image",
        name: newImageUri.split("/").pop(),
      });
      axios
        .post(`${Path}/register/account`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data == "success") {
            alert("Register Success");
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
      .post(`${Path}/confirmemail`, { email: email })
      .then((response) => {
        if (response.data == "used") {
          alert("Email is already taken");
        } else {
          setSecret(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let profile_user_not_upload = (
    <View style={styles.inputcontainer}>
      <Image
        source={require("../assets/user.png")}
        style={{ width: 150, height: 150, borderRadius: 999 }}
      />
    </View>
  );
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setObjectImg(result);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 30 }}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}>
        <Image
          source={require("../assets/newLogo.png")}
          style={styles.logo}
        ></Image>
        <View style={styles.box}>
          {!image && profile_user_not_upload}
          {image && (
            <View style={styles.inputcontainer}>
              <Image
                source={{ uri: image }}
                style={{ width: 150, height: 150, borderRadius: 999 }}
              />
            </View>
          )}
          <View style={styles.inputcontainer}>
            <TouchableOpacity
              onPress={pickImage}
              style={[
                styles.button,
                { backgroundColor: "royalblue" },
                { marginBottom: 20 },
              ]}
            >
              <Text style={{ color: "white", fontSize: 15 }}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setImage(null)}
              style={[styles.button, { backgroundColor: "darkgray" }]}
            >
              <Text style={{ color: "white", fontSize: 15 }}>Remove Photo</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.inputcontainer,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            {/* <Zocial name="email" size={24} color="black" /> */}
            <FontAwesome
              style={styles.user}
              name="user-o"
              size={24}
              color="gray"
            />
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
            <Ionicons
              style={styles.key}
              name="key-outline"
              size={24}
              color="gray"
            />
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
              {sec && (
                <Ionicons name="eye-off-outline" size={24} color="gray" />
              )}
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
              {!secCon && (
                <Ionicons name="eye-outline" size={24} color="gray" />
              )}
              {secCon && (
                <Ionicons name="eye-off-outline" size={24} color="gray" />
              )}
            </TouchableOpacity>
            {checkpass ? (
              <Text style={{ color: "red", marginTop: 5 }}>
                Password not match
              </Text>
            ) : null}
          </View>
          <View style={[styles.inputcontainer, { marginBottom: 0 }]}>
            <TouchableOpacity style={styles.button} onPress={checkHandle}>
              <Text style={{ color: "white", fontSize: 15 }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8EA",
    paddingTop: 30,
    paddingHorizontal: 25,
    flex: 1,
  },
  inputcontainer: {
    alignItems: "center",
    marginBottom: 25,
    justifyContent: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "darkgrey",
    backgroundColor: "white",
    fontSize: 18,
    paddingLeft: 35,
    color: "gray",
  },
  button: {
    width: "100%",
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
  logo: {
    alignSelf: "center",
    width: 180,
    height: 80,
    marginBottom: 30,
  },
  box: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  secret: {
    position: "absolute",
    right: 6,
    top: 8,
  },
  user: {
    position: "absolute",
    left: 9,
    top: 11,
    zIndex: 5,
  },
  password: {
    position: "absolute",
    left: 6,
    top: 8,
    zIndex: 2,
  },
  key: {
    position: "absolute",
    left: 6,
    top: 8,
    zIndex: 2,
  },
});
export default Register;
