import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Path from "../../path";
import {useNavigation } from '@react-navigation/native';

function CourseCreate({route}) {
  const router = useNavigation();
  const [CourseName, setCourseName] = React.useState("");
  const [CourseSubTitle, setCourseSubTitle] = React.useState("");
  const [CourseKey, setCourseKey] = React.useState("");
  const [objectImg, setObjectImg] = React.useState([]);
  const [image, setImage] = React.useState(null);

  let Subject_not_upload = (
    <Image
    source={require("../assets/noimg.png")}
    style={{ width: 300, height: 200, borderRadius: 10, borderRadius: 10, }}
    />
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setObjectImg(result);
    }
  };

  async function createCourse() {
    const data = new FormData();
    const newImageUri = "file:///" + objectImg.uri.split("file:/").join("");
    data.append("title", CourseName);
    data.append("subTitle", CourseSubTitle);
    data.append("teacherId", route.params.teacher);
    data.append("key", CourseKey);
    data.append("img_subject", {
      uri: newImageUri,
      type: "image",
      name: newImageUri.split("/").pop(),
    });
    await axios
      .post(`${Path}/addSubject`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data == "success") {
          alert("Create Success");
          {
            router.replace("coursepage");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 , alignItems: "center"}}
    >
        <View style={styles.box}>
        </View>
        <View style={styles.inside}>
            <View style={styles.inputcontainer}>
                <View style={styles.inputcontainer}>
                    {!image && Subject_not_upload}
                    {image && (
                        <>
                        <Image
                            source={{ uri: image }}
                            style={{
                            width: 300,
                            height: 200,
                            borderRadius: 10,
                            }}
                        />
                        </>
                    )}
                </View>
                <TouchableOpacity
                onPress={pickImage}
                style={[
                    styles.buttonpho,
                    { backgroundColor: "royalblue", marginBottom: 20},
                ]}
                >
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Upload Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => setImage(null)}
                style={[
                    styles.buttonpho,
                    image ? styles.rered : styles.regray,
                ]}
                >
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Remove Photo</Text>
                </TouchableOpacity>
            </View>
            <TextInput
            placeholder="Course Title"
            placeholderTextColor={"darkgrey"}
            onChangeText={(title) => {
                setCourseName(title);
            }}
            style={styles.textinput}
            />
            <TextInput
            multiline={true}
            placeholderTextColor={"darkgrey"}
            placeholder="Course Subtitle"
            onChangeText={(subtitle) => {
                setCourseSubTitle(subtitle);
            }}
            style={styles.textinput}
            />
            <TextInput
            placeholderTextColor={"darkgrey"}
            placeholder="Course Key"
            onChangeText={(key) => {
                setCourseKey(key);
            }}
            style={styles.textinput}
            />
            <TouchableOpacity
            onPress={() => createCourse()}
            style={[
                styles.buttonpho,{
                backgroundColor: "orange",
            }]}
            >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Create Course</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8EA",
  },
  text_header: {
    fontSize: 30,
    fontWeight: "600"
  },
  header: {
    // marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  box: {
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "#FF9A00",
    height: 210,
    position: "absolute"
  },
  inside: {
    marginTop: 80,
    width: "90%",
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 4,
  },
  textinput: {
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: "darkgrey",
    fontSize: 17
  },
  text: {
    fontSize: 20,
  },
  inputcontainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  buttonpho: {
    width: "100%",
    backgroundColor: "#FF9A00",
    alignItems: "center",
    padding: 13,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  rered: {
    backgroundColor: "red",
  },
  regray: {
    backgroundColor: "darkgray",
  },
});

export default CourseCreate;
