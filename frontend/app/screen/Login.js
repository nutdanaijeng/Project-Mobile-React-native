import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Path from "../../path";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [sec, setSec] = useState(true)
  let TextError = null;

  const SignIn = async () => {
    axios
      .post(`${Path}/checkUser`, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data != "error login") {
          setError(false);
          AsyncStorage.setItem("@login", JSON.stringify(response.data));
          {
            props.navigation.replace("TabHome", { user: response.data });
          }
        } else {
          setError(true);
        }
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
        <View style={styles.TextInput}>
          {/* <Text style={styles.text}>Email</Text> */}
          <FontAwesome style={styles.user} name="user-o" size={22} color="gray" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"darkgrey"}
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.TextInput}>
          {/* <Text style={styles.text}>Password</Text> */}
          <View style={{flexDirection: "row"}}>
            <MaterialIcons style={styles.password} name="lock-outline" size={24} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={"darkgrey"}
              secureTextEntry={sec}
              onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity style={styles.secret} onPress={() => {setSec(!sec)}}>
              {!sec && <Ionicons name="eye-outline" size={24} color="gray" />}
              {sec && <Ionicons name="eye-off-outline" size={24} color="gray" />}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{marginBottom: 5}} onPress={()=>{
            props.navigation.navigate("resetpassword");
          }}>
            <Text style={{fontSize : 13, color: "#ffbA00"}}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <View>{TextError}</View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            SignIn();
          }}
        >
          <Text style={{ color: "white", fontSize: 18}}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: "royalblue"}]}
          onPress={() => {
            props.navigation.navigate("register");
          }}
        >
          <Text style={{ color: "white", fontSize: 18}}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.countContainer}>
        <Text style={styles.countText}></Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8EA",
    paddingTop: 60,
  },
  text: {
    fontSize: 20,
  },
  TextInput: {
    justifyContent: "flex-start",
    marginBottom: 5
  },
  input: {
    width: 330,
    paddingLeft: 30,
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
    color: "gray"
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
    right: 15,
    top: 22
  },
  user:{
    position: "absolute",
    left: 4,
    top: 23
  },
  password: {
    position: "absolute",
    left: 2,
    top: 24
  }
});
export default Login;
