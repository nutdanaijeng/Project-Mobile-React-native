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
import { FlatList } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Path from "../../path";
const role = ["Student", "Teacher", "Student"];
import { MaterialIcons } from '@expo/vector-icons';

const changeDataBaseRole = (id, role) => {
  axios.post(`${Path}/updateRole`, {
    id : id,
    role : role
  }).then((response) =>{
    console.log(response.data)
  }).catch((err) =>{
    console.log(err)
  })
}

const MapData = (props) => {
  return (
    <View style={styles.inside}>
      <Text style={styles.text}>{props.email}</Text>
      <SelectDropdown
        data={role}
        dropdownStyle={styles.dropdown}
        defaultButtonText={props.role}
        buttonStyle={styles.button}
        onSelect={(selectedItem, index) => {
          {changeDataBaseRole(props.id, selectedItem)};
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
  );
};



function ManageRole() {
  const [search, setSearch] = useState("");
  const [allUser, setAllUser] = useState([]);
  const [backUp, setBackUp] = useState([]);
  const {width} = useWindowDimensions();


  function Search(text) {
    const filteredData = backUp.filter(
      (data) => data.email.toUpperCase().indexOf(text.toUpperCase()) + 1
    );
    setAllUser(filteredData);
  }




  useEffect(() => {
    axios
      .get(`${Path}/getUser`)
      .then((response) => {
        // setAllUser(response.data);
        setAllUser(response.data);
        setBackUp(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const renderItem = (itemData) => {
    // console.log(itemData);
    return (
      <MapData data={itemData}/>
    );
  };
  return (
    <ScrollView
      nestedScrollEnabled={true}
      // horizontal={true}
      style={styles.scrollview}
    >
      {/* <View> */}
        <View style={styles.header}>
          <Text style={styles.text_header}>Manage Role</Text>
          <View>
            <MaterialIcons style={styles.search} name="search" size={28} color="gray" />
            <TextInput style={styles.textInput} placeholder="Search" placeholderTextColor={"darkgrey"} onChangeText={(text) => {Search(text)}}/>
          </View>
        </View>
        <View style={[styles.box, {width : "100%"}]}>
          {/* <FlatList data={allUser} renderItems={MapData} style={{ width: "100%" }}/> */}
          {allUser.map((value) => {
            return <MapData key={value.user_id} email={value.email} role={value.role} id={value.user_id}/>;
          })}
        </View>
      {/* </View> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    backgroundColor: "#FFF8EA",
    paddingHorizontal: 20
  },

  container: {
    padding : 12
  },
  header: {
    marginTop: 40,
    justifyContent: "flex-end",
    // paddingHorizontal: 20,
    paddingBottom: 50,
  },
  text_header: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 30,
  },
  textInput: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 18,
    paddingLeft: 40
  },
  box: {
    backgroundColor: "#fff",
    paddingLeft: 15,
    alignItems: "center",
    // width: 400,
    borderRadius: 10,
    borderColor: "gray",
    // borderWidth: 1,
    marginTop: 10,
    flexDirection: "column",
    // borderColor: "#FF9A00",
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.62,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  dropdown: {
    width: 200,
    height: 100,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  button: {
    width: 110,
    height: 40,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#FF9A00",
  },
  inside: {
    flexDirection: "row",
    marginBottom: 10,
    marginLeft : 8,
  },
  search: {
    position: "absolute",
    top: 33,
    left: 8,
    zIndex: 2
  }
});
export default ManageRole;
