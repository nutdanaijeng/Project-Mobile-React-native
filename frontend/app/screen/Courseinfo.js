import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  useWindowDimensions,
} from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Youtube from "react-native-youtube-iframe";
import RenderHtml from "react-native-render-html";
import Path from "../../path";
import { useNavigation } from "@react-navigation/native";

function RenderCourseInfo(props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Course Info</Text>
      </View>
      <View style={[styles.box, { paddingVertical: 10 }]}>
        <View style={[styles.insidecourse]}>
          <View style={styles.boxofinfo}>
            <MaterialCommunityIcons
              name="clipboard-text-multiple-outline"
              size={22}
              color="black"
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.headinfo}>Course name</Text>
              <Text style={styles.text}>{props.name}</Text>
            </View>
          </View>
          <View style={styles.boxofinfo}>
            <Feather name="file-text" size={22} color="black" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.headinfo}>Course description</Text>
              <Text style={styles.text}>{props.description}</Text>
            </View>
          </View>
          <View style={[styles.boxofinfo]}>
            <FontAwesome name="user-o" size={22} color="black" />
            <View
              style={{
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={[styles.headinfo, { marginBottom: 0 }]}>
                Number of member
              </Text>
              <Text style={{ marginLeft: 10, marginTop: 1 }}>
                {props.member}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function RenderVideo(props) {
  const [playing, setPlaying] = useState(false);
  const togglePlaying = () => {
    setPlaying((prev) => !prev);
  };
  return (
    <Youtube
      height={200}
      width={props.width}
      play={playing}
      videoId={props.videoId}
    />
  );
}

function CourseInfo({ route }) {
  const router = useNavigation();
  const [user, setUser] = useState(route.params.user);
  const [course, setCourse] = useState(route.params.course);
  const [member, setmember] = useState(0);
  const { width } = useWindowDimensions();
  const [listDocument, setListDocument] = useState([]);
  const [allDescription, setAllDescription] = useState([]);
  const [allLesson, setAllLesson] = useState([]);

  function RenderCourseOverView(props) {
    let sendDocument = [];
    const [toggle, setToggle] = useState(false);
    let sendYoutube = [];
    return (
      <View style={styles.container}>
        <View style={styles.header2}>
          <Text style={styles.text_header}>{props.lesson}</Text>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14 }}>{props.course_description}</Text>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {user.role != "Student" && (
              <TouchableOpacity
                onPress={() => {
                  router.navigate("createDescription", {
                    user: user,
                    course: course,
                    h_id: props.value.h_id,
                  });
                }}
                style={{ marginRight: 6 }}
              >
                <Ionicons name="add-circle-outline" size={23} color="black" />
              </TouchableOpacity>
            )}
            {user.role != "Student" && (
              <TouchableOpacity
                onPress={() => {
                  router.navigate("EditYoutube", {
                    data: sendYoutube,
                    h_id: props.value.h_id,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="movie-edit-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
            {user.role != "Student" && (
              <TouchableOpacity
                style={{ marginLeft: 6 }}
                onPress={() => {
                  router.navigate("allfile", {
                    course: course,
                    h_id: props.value.h_id,
                  });
                }}
              >
                <MaterialIcons name="assignment" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.inside}>
            <RenderHtml contentWidth={width} source={{ html: props.data }} />
            {allDescription &&
              allDescription.map((value) => {
                if (props.value.h_id == value.h_id) {
                  if (value.type == "Youtube") {
                    sendYoutube.push(value);
                    return (
                      <RenderVideo
                        key={value.d_id}
                        videoId={value.data.substring(32)}
                      />
                    );
                  }
                  if (value.type == "Assignment") {
                    return (
                      <RenderAssignment
                        key={value.d_id}
                        text={value.data}
                        user={user}
                        Assignment={() => {
                          router.navigate("Assignment", {
                            user: user,
                            data: value,
                            h_id: props.value.h_id,
                            course: course,
                          });
                        }}
                        value={value}
                      />
                    );
                  }
                }
              })}
            <View style={styles.material}>
              <TouchableOpacity
                style={[
                  styles.topMaterial,
                  !toggle
                    ? { borderBottomEndRadius: 10, borderBottomStartRadius: 10 }
                    : null,
                ]}
                onPress={() => {
                  setToggle(!toggle);
                }}
              >
                <FontAwesome name="book" size={20} color="white" />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  Material
                </Text>
              </TouchableOpacity>
              {toggle && (
                <View style={styles.mainMaterail}>
                  {listDocument.length != 0 &&
                    listDocument.map((value) => {
                      if (props.value.h_id == value.h_id) {
                        sendDocument.push(value);
                        return (
                          <Render_File_Upload
                            key={value.f_id}
                            name={value.name}
                            path={value.path}
                          />
                        );
                      }
                    })}
                </View>
              )}
            </View>
          </View>
        </View>
        {user.role != "Student" && (
          <View style={[styles.buttoncontainer1, { paddingHorizontal: 20 }]}>
            <TouchableOpacity
              style={[
                styles.editcontainer,
                { flex: 0.5, width: "50%", alignItems: "center" },
              ]}
              onPress={() => [
                router.navigate("EditLesson", {
                  course: course,
                  user: user,
                  data: props.data,
                  lesson: props.lesson,
                  h_id: props.value.h_id,
                  listDocument: sendDocument,
                }),
              ]}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={30}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.deletecontainer,
                { flex: 0.5, width: "50%", alignItems: "center" },
              ]}
              onPress={() => {
                confirmDel(props.value.h_id);
              }}
            >
              <MaterialCommunityIcons name="delete" size={30} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  function RenderAssignment(props) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            props.Assignment();
          }}
        >
          <Text style={{ fontSize: 18, color: "#FF9A00", fontWeight: "bold" }}>
            {props.text}
          </Text>
        </TouchableOpacity>
        {props.user.role != "Student" && (
          <TouchableOpacity
            style={{ marginLeft: 12 }}
            onPress={() => {
              router.navigate("editassignment", { value: props.value });
            }}
          >
            <Feather name="edit" size={22} color="black" />
          </TouchableOpacity>
        )}
        {props.user.role != "Student" && (
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => {
              confirmDelAssign(props.value.d_id);
            }}
          >
            <MaterialCommunityIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
  function Render_File_Upload(props) {
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(`${Path}${props.path}`);
        }}
        style={{
          width: "90%",
          padding: 13,
          borderColor: "darkgrey",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign name="pdffile1" size={24} color="black" />
          <Text style={{ marginLeft: 10, fontSize: 14 }}>{props.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const confirmDel = (id) => {
    return Alert.alert("Are your sure?", "Are you sure to Delete lesson?", [
      {
        text: "Yes",
        onPress: async () => {
          DeleteLesson(id);
        },
      },
      {
        text: "No",
      },
    ]);
  };

  const confirmDelAssign = (id) => {
    return Alert.alert("Are your sure?", "Are you sure to Delete Assignment?", [
      {
        text: "Yes",
        onPress: async () => {
          DeleteAssign(id);
        },
      },
      {
        text: "No",
      },
    ]);
  };
  async function DeleteAssign(id) {
    await axios
      .post(`${Path}/deleteAssignment`, {
        d_id: id,
      })
      .then((response) => {
        if (response.data == "success") {
          getDesciption();
          alert("Delete success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function DeleteLesson(lesson_id) {
    await axios
      .post(`${Path}/DeleteLesson`, {
        lesson_id: lesson_id,
      })
      .then((response) => {
        if (response.data == "success") {
          getLesson();
          alert("Delete success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function getMember() {
    let users = await AsyncStorage.getItem("@login");
    await axios
      .post(`${Path}/getMember`, {
        course_id: course.course_id,
      })
      .then((response) => {
        setmember(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    await axios
      .post(`${Path}/getUserId`, {
        id: JSON.parse(users).user_id,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getLesson() {
    await axios
      .post(`${Path}/getLesson`, {
        course_id: course.course_id,
      })
      .then((response) => {
        setAllLesson(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function getFile() {
    await axios
      .post(`${Path}/getFile`, {
        course_id: course.course_id,
      })
      .then((response) => {
        setListDocument(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function getDesciption() {
    await axios
      .post(`${Path}/getDescription`, {
        course_id: course.course_id,
      })
      .then((response) => {
        setAllDescription(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getMember();
    getLesson();
    getDesciption();
    getFile();
    const willFocusSubscription = router.addListener("focus", () => {
      getLesson();
      getDesciption();
      getFile();
    });

    return willFocusSubscription;
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
      style={[styles.scrollview]}
    >
      <RenderCourseInfo
        name={course.title}
        description={course.subtitle}
        member={member}
      />
      {user.role != "Student" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "500" }}>Create Lesson</Text>

          <TouchableOpacity
            onPress={() => {
              router.navigate("createLesson", {
                course: course,
                user: user,
              });
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "500" }}>+</Text>
          </TouchableOpacity>
        </View>
      )}
      {allLesson.map((value) => {
        return (
          <RenderCourseOverView
            key={value.h_id}
            lesson={value.lesson}
            data={value.data}
            course_description="Description"
            material="Material"
            value={value}
            width={width}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    // alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    // marginLeft: 50,
    width: "87%",

    borderRadius: 10,
  },
  scrollview: {
    flex: 1,
    backgroundColor: "#FFF8EA",
    // marginTop: 50,
  },
  logo: {
    width: 300,
    height: 140,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "#7AAFFF",
    width: "100%",
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 10,
  },

  box: {
    paddingHorizontal: 10,
    // marginTop: 10,
  },

  header2: {
    paddingHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "#FF9A00",
    width: "100%",
    // justifyContent: "fl",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 10,
  },
  inside: {
    width: "100%",
    // alignItems: "center",
    padding: 10,
  },
  text: {
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  material: {
    width: "100%",
    backgroundColor: "#fff",
    shadowRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 0 },
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 100,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#FA9828",
  },
  buttonConfirm: {
    backgroundColor: "#56F280",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    // width: "90%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  textArea: {
    height: 300,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttoncontainer1: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#ffd7a8",
    padding: 5,
    // width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  editcontainer: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
  },
  deletecontainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingRight: 5,
  },
  topMaterial: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#7AAFFF",
    borderTopStartRadius: 10,
    borderTopRightRadius: 10,
  },
  mainMaterail: {
    padding: 10,
    width: "100%",
  },
  headinfo: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },
  text_header: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
  },
  boxofinfo: {
    flexDirection: "row",
    // alignItems: "center",
  },
  insidecourse: {
    width: "100%",
    // alignItems: "center",
    paddingLeft: 5,
    paddingVertical: 10,
    paddingRight: 25,
  },
});

export default CourseInfo;
