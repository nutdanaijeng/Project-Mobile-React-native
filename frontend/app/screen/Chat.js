import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserInfoText,
  UserImg,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from "../styles/chat";
import SelectDropdown from "react-native-select-dropdown";
import Path from "../../path";
import { MaterialIcons } from '@expo/vector-icons';

function Chat(props) {
  const [allUser, setAllUser] = useState([]);
  const [user, setUser] = useState([]);
  const [backUp, setBackUp] = useState([]);
  const Role = ["All", "Student", "Teacher", "Admin"];
  const [text, setText] = useState("");
  const [role, setRole] = useState("All");

  function Search(text) {
    const filteredData = backUp.filter(
      (data) => {
        if(data.email.toUpperCase().indexOf(text.toUpperCase()) + 1){
          if(data.role == role || role == "All"){
            return data;
          }
        }
      }
    );
    setAllUser(filteredData);
  }

  function SearchRole(role){
    const filteredData = backUp.filter(
      (data) => {
        if(data.role == role || role == "All"){
          if(data.email.toUpperCase().indexOf(text.toUpperCase()) + 1){
            return data;
          }
        }
      }
    );
    setAllUser(filteredData);
  }

  const getUser = async () => {
    let users = await AsyncStorage.getItem("@login");
    axios
      .post(`${Path}/getUserId`, {
        id: JSON.parse(users).user_id,
      })
      .then((response) => {
        setUser(response.data);
        axios
          .post(`${Path}/getUserChat`, {
            id: response.data.user_id,
          })
          .then((response) => {
            setAllUser(response.data);
            setBackUp(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    // return JSON.parse(user);
  };

  const renderItem = (itemData) => {
    let check = false;
    if (itemData.index == 0) {
      check = true;
    }
    return (
      // <View style={[styles.boxchat, check ? styles.boxeven : styles.boxodd]}>
      //   <Image style={styles.profile} source={{uri : "${Path}" + props.item.img}}/>
      //   <Text style={{fontSize : 20, paddingLeft : 12, fontWeight : "700"}}>
      //     {props.item.email}
      //   </Text>
      // </View>
      <Card
        onPress={() =>
          props.navigation.navigate("chatinfo", { data: itemData, user: user })
        }
      >
        <UserInfo>
          <UserImgWrapper>
            <UserImg
              source={{ uri: `${Path}` + itemData.item.img }}
            />
          </UserImgWrapper>
          <TextSection>
            <UserName>{itemData.item.email}</UserName>
          </TextSection>
        </UserInfo>
      </Card>
    );
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <Container>
      <View style={{flexDirection : "row", alignItems : "center"}}>
        <MaterialIcons style={styles.search} name="search" size={28} color="gray" />
        <TextInput
          style={[styles.textInput, {width : "60%"}]}
          placeholder="Search"
          placeholderTextColor={"darkgrey"}
          onChangeText={(text) => {
            setText(text);
            Search(text);
          }}
        />
        <SelectDropdown
          data={Role}
          dropdownStyle={styles.dropdown}
          defaultButtonText="All"
          buttonStyle={styles.button}
          onSelect={(selectedItem, index) => {
            {
              setRole(selectedItem);
              SearchRole(selectedItem);
              // changeDataBaseRole(props.id, selectedItem);
            }
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />
      </View>
      {allUser && (
        <FlatList
          data={allUser}
          keyExtractor={(user) => user.user_id}
          renderItem={renderItem}
        />
      )}
    </Container>
  );
}
const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    backgroundColor: "#FFF8EA",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    // paddingTop : 50,
    padding: 10,
    // alignItems: "center",
    // justifyContent : "center"
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 999,
  },
  boxchat: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  boxeven: {
    backgroundColor: "#DBDBDB",
  },
  boxodd: {
    backgroundColor: "#B6B6B6",
  },
  textInput: {
    height: 50,
    width: 350,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 35,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderColor: "#FF9A00",
  },
  dropdown: {
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  button: {
    width: 120,
    borderColor: "#FF9A00",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  search: {
    position: "absolute",
    top: 21,
    left: 8,
    zIndex: 2
  }
});
export default Chat;
