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
import { Entypo } from "@expo/vector-icons";
import Path from "../../path";
import { useNavigation } from "@react-navigation/native";

function EditCourse({ route }) {
  const router = useNavigation();
  const [CourseName, setCourseName] = React.useState(route.params.value.title);
  const [CourseSubTitle, setCourseSubTitle] = React.useState(
    route.params.value.subtitle
  );
  const [CourseKey, setCourseKey] = React.useState(route.params.value.s_key);
  const [objectImg, setObjectImg] = React.useState([]);
  const [image, setImage] = React.useState(`${Path}${route.params.value.img}`);
  let Subject_not_upload = (
    <Image
      source={require("../assets/noimg.png")}
      style={{ width: 300, height: 200, borderRadius: 10, borderRadius: 10 }}
    />
  );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setObjectImg(result);
    }
  };

  async function editCourse() {
    // console.log(objectImg.length == undefined, image != `${Path}${route.params.value.img}`);
    if (
      objectImg.length == undefined &&
      image != `${Path}${route.params.value.img}`
    ) {
      const data = new FormData();
      const newImageUri = "file:///" + objectImg.uri.split("file:/").join("");
      data.append("title", CourseName);
      data.append("course_id", route.params.value.course_id);
      data.append("subTitle", CourseSubTitle);
      data.append("teacherId", route.params.teacher);
      data.append("key", CourseKey);
      data.append("img_subject", {
        uri: newImageUri,
        type: "image",
        name: newImageUri.split("/").pop(),
      });
      await axios
        .post(`${Path}/editSubjectImg`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data == "success") {
            alert("Edit Success");
            {
              router.goBack();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .post(`${Path}/editSubject`, {
          title: CourseName,
          course_id: route.params.value.course_id,
          subTitle: CourseSubTitle,
          teacherId: route.params.value.teacher_id,
          key: CourseKey,
        })
        .then((response) => {
          if (response.data == "success") {
            alert("Edit Success");
            {
              router.goBack();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30, alignItems: "center" }}
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
              { backgroundColor: "royalblue", marginBottom: 20 },
            ]}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Upload Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setImage(`${Path}${route.params.value.img}`);
              setObjectImg([]);
            }}
            style={[
              styles.buttonpho,
              image != `${Path}${route.params.value.img}`
                ? styles.rered
                : styles.regray,
            ]}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Remove Photo</Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.text}>Course Name</Text> */}
        <TextInput
          placeholder="Course Title"
          placeholderTextColor={"darkgrey"}
          defaultValue={route.params.value.title}
          onChangeText={(title) => {
            setCourseName(title);
          }}
          style={styles.textinput}
        />
        {/* <Text style={styles.text}>Sub title</Text> */}
        <TextInput
          multiline={true}
          defaultValue={route.params.value.subtitle}
          placeholder="Course Subtitle"
          placeholderTextColor={"darkgrey"}
          onChangeText={(subtitle) => {
            setCourseSubTitle(subtitle);
          }}
          style={styles.textinput}
        />
        {/* <Text style={styles.text}>Enroll Key</Text> */}
        <TextInput
          placeholder="Course Key"
          placeholderTextColor={"darkgrey"}
          defaultValue={route.params.value.s_key}
          onChangeText={(key) => {
            setCourseKey(key);
          }}
          style={styles.textinput}
        />
        <TouchableOpacity
          onPress={() => editCourse()}
          style={[
            styles.buttonpho,
            {
              backgroundColor: "orange",
            },
          ]}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Edit Course</Text>
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
    fontWeight: "600",
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
    position: "absolute",
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
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  textinput: {
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    padding: 10,
    // height: 30,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: "darkgray",
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
    shadowOpacity: 0.2,
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

export default EditCourse;
