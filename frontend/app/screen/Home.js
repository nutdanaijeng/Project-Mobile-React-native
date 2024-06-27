import { StyleSheet, Text, View , Image, TouchableOpacity, ScrollView} from "react-native";
import * as React from "react";
import axios from 'axios';
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Entypo, FontAwesome5, MaterialIcons, MaterialCommunityIcons    } from '@expo/vector-icons';







function Home(props) {
  const [user, setUser] = React.useState([]);
  const router = useNavigation();
  const getUser = async () =>{
    let users = await AsyncStorage.getItem("@login");
    setUser(JSON.parse(users))
    // return JSON.parse(user);
  }
  React.useEffect(() =>{
    getUser();
  }, [])

  // // let user = await AsyncStorage.getItem("@login");
  // console.log(user);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.logocontainer}>
        <Image style={styles.logo} source={require('../assets/logo.png')}/>
      </View>
      <View style={styles.buttoncontainer}>
        <TouchableOpacity style={styles.enterclassbutton} onPress={() => {
          router.navigate("coursepage");
        }}>
          <Text style={styles.textbutton}>Getting Started</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.containercenter}>
        <FontAwesome5 name="user-friends" size={40} color="black" />
          <Text style={styles.textlogo}>ใช้งาน</Text>
          <Text style={styles.textcard}>ระบบ J: Learn ออกแบบมาเพื่อให้ผู้ใช้สามารถใช้งานได้อย่างง่ายดาย ไม่มีความซับซ้อน</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.containercenter}>
          <Entypo name="code" size={50} color="black" />
          <Text style={styles.textlogo}>โค้ด</Text>
          <Text style={styles.textcard}>ระบบตรวจโครงสร้างอัตโนมัติ ช่วยลดระยะการตรวจของผู้สอน</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.containercenter}>
        <MaterialIcons name="featured-play-list" size={50} color="black" />
          <Text style={styles.textlogo}>ฟีเจอร์</Text>
          <Text style={styles.textcard}>ส่วนช่วยจัดการผู้เรียนได้ง่าย ตรวจสอบผู้เรียนได้ง่าย และจัดการงานแต่ละงานได้ง่าย</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.containercenter}>
          <MaterialCommunityIcons name="comment-question" size={50} color="black" />
          <Text style={styles.textlogo}>เพิ่มประสิทธิภาพ</Text>
          <Text style={styles.textcard}>เพิ่มประสิทธิภาพให้กับผู้เรียน เนื่องจากลดภาระของผู้สอน ให้ผู้สอนสามารถครอบคลุมผู้เรียนได้อย่างทั่วถึง</Text>
        </View>
      </View>
      <View style={{backgroundColor : "#B4DAFF", padding : 20}}>
        <Text style={{fontSize : 15, textAlign : "center", fontWeight : "bold"}}>© FIT-KMITL</Text>
        <Text style={{fontSize : 13, textAlign : "center"}}>Faculty of Information Technology, King Mongkut's Institute of Technology Ladkrabang</Text>
        <Text style={{fontSize : 13, textAlign : "center"}}>1 Chalongkrung Road Bangkok Thailand 10520</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container :{
      backgroundColor : "#FFF8EA"
    },
    logo:{
        width : 300,
        height : 120,
        marginTop : 30,
    },
    logocontainer:{
        // flex : 1,
        alignItems : "center"
    },
    textcenter: {
      textAlign : "center",
      // marginTop : 20,
      fontSize : 18 
    },
    textcontainer:{
      paddingLeft : 5,
      paddingRight : 5, 
      // marginTop : 40
    },
    enterclassbutton:{
      paddingTop : 12,
      paddingLeft : 12,
      paddingRight : 12,
      borderRadius : 5,
      backgroundColor: "#ffbA00",
      height: 50,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8.30,
    },
    textbutton:{
      textAlign : "center",
      fontSize : 20,
      color: "white"
    },
    buttoncontainer :{
      // flex : 1,
      alignItems : "center",
      marginVertical : 30
    },
    textlogo : {
      fontSize : 20,
      textAlign : "center",
      marginTop: 10
    },
    containercenter : {
      // flex : 1,
      alignItems : "center",
      padding : 10
    },
    card:{
      backgroundColor : "#EBF9FF",
      padding : 20,
      marginLeft : 20,
      marginRight : 20,
      marginBottom : 30,
      borderRadius : 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.09,
      shadowRadius: 8.30,
    },
    textcard:{
      fontSize : 17,
      marginTop : 45,
      textAlign : "center"
    },
    start: {
      backgroundColor: "white",
      flexDirection: "row",

    }
});
export default Home;
