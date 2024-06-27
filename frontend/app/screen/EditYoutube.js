import { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  AntDesign,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { TextInput } from "react-native-gesture-handler";
import Youtube from "react-native-youtube-iframe";
import axios from "axios";
import Path from "../../path";

function EditYoutube({ route }) {
  const [listYoutube, setListYoutube] = useState([]);
  const router = useNavigation();

  async function getYoutube() {
    await axios
      .post(`${Path}/getYoutubeLesson`, {h_id : route.params.h_id})
      .then((response) => {
        setListYoutube(response.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getYoutube();
  }, []);

  const confirmDelYoutube = (id) => {
    return Alert.alert("Are your sure?", "Are you sure to Delete Link", [
      {
        text: "Yes",
        onPress: async () => {
          DeleteYoutube(id);
        },
      },
      {
        text: "No",
      },
    ]);
  };
  async function DeleteYoutube(id) {
    await axios
      .post(`${Path}/deleteYoutube`, {
        d_id: id,
      })
      .then((response) => {
        if (response.data == "success") {
          getYoutube();
          alert("Delete success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const confirmUpdate = (link, value) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure to Update Link Youtube?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: async () => {
            UpdateLink(link, value);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  async function UpdateLink(link, value) {
    await axios
      .post(`${Path}/EditYoutube`, {
        c_id: value.c_id,
        d_id: value.d_id,
        data: link,
        u_id: value.u_id,
      })
      .then((response) => {
        if (response.data == "success") {
          alert("Update Success");
          router.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function RenderVideo(props) {
    const [playing, setPlaying] = useState(false);
    const [link, setLink] = useState(props.value.data);
    const togglePlaying = () => {
      setPlaying((prev) => !prev);
    };
    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.headerStyle}> Link </Text>
        <View style={styles.inputcontainer}>
          <Entypo style={styles.link} name="link" size={24} color="gray" />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input]}
              defaultValue={link}
              onChangeText={(value) => {
                setLink(value);
              }}
            />
            {props.value.data != link && (
              <TouchableOpacity
                style={styles.save}
                onPress={() => {
                  confirmUpdate(link, props.value);
                }}
              >
                <Entypo name="save" size={24} color="black" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                confirmDelYoutube(props.value.d_id);
              }}
            >
              <MaterialCommunityIcons name="delete" size={30} color="red" />
            </TouchableOpacity>
          </View>
        </View>
        <Youtube
          height={220}
          width={props.width}
          play={playing}
          videoId={link.substring(32)}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      {listYoutube && listYoutube.map((value) => {
        return <RenderVideo key={value.d_id} value={value} />;
      })}
      {/* <TouchableOpacity onPress={() =>{
        editAssign();
    }} style={[styles.button, {backgroundColor: "royalblue"}]}>
        <Text style={{color: "white"}}>Update Assignment</Text>
    </TouchableOpacity> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scroll: {
    paddingTop: 60,
    backgroundColor: "#FFF8EA",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  input: {
    width: "90%",
    backgroundColor: "white",
    padding: 13,
    paddingLeft: 35,
    paddingRight: 40,
    borderRadius: 10,
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
  button: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#ffbA00",
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
  },
  inputcontainer: {
    alignItems: "center",
    marginBottom: 25,
    justifyContent: "center",
  },
  link: {
    position: "absolute",
    left: 3,
    top: 8,
    zIndex: 2,
  },
  save: {
    position: "absolute",
    right: 50,
    top: 10,
    zIndex: 2,
  },
});
export default EditYoutube;
