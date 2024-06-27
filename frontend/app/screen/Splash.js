import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Path from "../../path";
import { useNavigation } from "@react-navigation/native";

function Splash(props) {
  const { width } = useWindowDimensions();
  const router = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      checkUser();
    }, 1000);
  }, []);

  const checkUser = async () => {
    try {
      const value = await AsyncStorage.getItem("@login");
      if (!value) {
        router.replace("login");
      } else {
        router.replace("TabHome");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={{ width: width, height: 150 }}
        source={require("../assets/logo.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8EA",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Splash;
