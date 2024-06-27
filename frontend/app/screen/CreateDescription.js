import { useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Button,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import RenderHtml from "react-native-render-html";
import * as DocumentPicker from "expo-document-picker";
import Path from "../../path";
import axios from "axios";
import { AntDesign, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectDropdown from "react-native-select-dropdown";
import Youtube from "react-native-youtube-iframe";
import moment from "moment";


function CreateDescription({ route }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(null);
  const [course, setCourse] = useState(route.params.course);
  const [user, setUser] = useState(route.params.user);
  const { width } = useWindowDimensions();
  const [description, setDescription] = useState("");
  const [selectType, setSelectType] = useState("Youtube");
  const type = ["Youtube", "Assignment"];
  const [selectedDate, setSelectedDate] = useState();
  const router = useNavigation();
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  async function createDescription() {
    await axios
      .post(`${Path}/createDescription`, {
        type: selectType,
        data: description,
        course_id: course.course_id,
        h_id: route.params.h_id,
        u_id: user.user_id,
        time: selectedDate,
      })
      .then((response) => {
        if (response.data == "success") {
          alert("success");
          router.goBack();
        }
        // console.log(response.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function RenderVideo(props) {
    const [playing, setPlaying] = useState(false);
    // console.log(props);
    const togglePlaying = () => {
      setPlaying((prev) => !prev);
    };
    return (
      <Youtube
        height={220}
        width={width - 50}
        play={playing}
        videoId={props.videoId}
      />
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
    }}>
      <View style={styles.container}>
        <SelectDropdown
          data={type}
          dropdownStyle={[styles.dropdown]}
          defaultButtonText={"Youtube"}
          buttonTextStyle={{color: "white"}}
          buttonStyle={
            selectType == "Youtube"
              ? styles.buttonYoutube
              : styles.buttonAssignment
          }
          onSelect={(selectedItem, index) => {
            {
              setSelectType(selectedItem);
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
        <Text style={styles.headerStyle}>{selectType == "Youtube" ? "Link Youtube" : "Title"}</Text>
        <TextInput
          onChangeText={(text) => setDescription(text)}
          multiline={true}
          style={styles.textInput}
          placeholderTextColor={"darkgrey"}
          placeholder={
            selectType == "Youtube"
              ? "Please input link youtube"
              : "Please input title assignment"
          }
        />
        {selectType == "Youtube" && description != "" && (
          <RenderVideo videoId={description.substring(32)} />
        )}
        {selectType == "Assignment" && (
          <View style={{width: "100%"}}>
            <Text style={styles.headerStyle}>
              Due Date
            </Text>
            <View style={styles.showDate}>
              <Text>{`Date:  ${
                selectedDate
                  ? moment(selectedDate).format("D MMMM YYYY, h:mm:ss a")
                  : "Please select date"
                }`}
              </Text>
            </View>
            <TouchableOpacity onPress={showDatePicker} style={styles.date}>
              <AntDesign name="calendar" size={24} color="white" />
              <Text style={{marginLeft: 7, color: "white", fontSize: 16, fontWeight: "600"}}>Select Due Date</Text>
            </TouchableOpacity>
          </View>
        )}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <TouchableOpacity
          style={styles.upload}
          onPress={() => {
            createDescription();
          }}
        >
          <Feather name="upload" size={24} color="white" />
          <Text style={{marginLeft: 7, color: "white", fontSize: 16, fontWeight: "600"}}>Upload</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8EA",
    paddingHorizontal: 30,
  },
  buttonYoutube: {
    width: "100%",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    backgroundColor: "lightcoral",
  },
  buttonAssignment: {
    width: "100%",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    backgroundColor: "darkseagreen",
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
  input: {
    // width: "90%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  upload:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 13,
    width: "100%",
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: "#ffbA00",
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  textInput:{
    marginBottom: 10,
    padding: 13,
    paddingTop: 13,
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  date:{
    width: "100%",
    backgroundColor: "royalblue",
    padding: 13,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.62,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems:"center",
  },
  showDate:{
    width: "100%",
    padding: 13,
    borderColor: "gray",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.62,
    elevation: 4,
  },
  headerStyle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
  },
});

export default CreateDescription;
