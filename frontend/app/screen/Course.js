import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import Path from "../../path";



function Course(props) {
  const [allCourse, setAllCourse] = useState([]);
  const [user, setUser] = useState([]);
  const [course, setCourse] = useState([]);
  const [backUpCourse, setBackUpCourse] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [secretkey, setSecretKey] = useState("");
  const [textKey, setTextKey] = useState("");
  const [selectCourse, setSelectCourse] = useState(0);
  const getUser = async () => {
    let users = await AsyncStorage.getItem("@login");
    let s_id;
    await axios
      .post(`${Path}/getUserId`, {
        id: JSON.parse(users).user_id,
      })
      .then((response) => {
        setUser(response.data);
        s_id = response.data.user_id;
      })
      .catch((err) => {
        console.log(err);
      });
    await axios
      .post(`${Path}/getSubjectStudent`, { id: s_id })
      .then((response) => {
        let loopcourse = [];
        response.data.forEach((value) => {
          loopcourse.push(value.c_id);
        });
        setCourse(loopcourse);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function getSubject() {
    await axios
      .get(`${Path}/getSubject`)
      .then((response) => {
        setAllCourse(response.data);
        setBackUpCourse(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function RenderCrouse(props) {
    let img = "";
    if (props.img) {
      img = `${Path}` + props.img;
    }
    return (
      <View style={[styles.box]}>
        <View style={styles.inside}>
          <Image style={styles.courselogo} source={{ uri: img }}></Image>
        </View>
        <View style={{ padding: 5 }}>
          <Text
            numberOfLines={1}
            style={{ fontSize: 20, fontWeight: "600", padding: 10 }}
          >
            {props.title}
          </Text>
        </View>
        <ScrollView
          style={{ padding: 10, height: 100, marginBottom: 10 }}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <Text style={{ fontSize: 16, paddingLeft: 5, paddingRight: 5 }}>
            {props.subtitle}
          </Text>
        </ScrollView>
        {props.role == "Student" && (
          <View style={styles.buttoncontainer}>
            {course.indexOf(props.id) == -1 && (
              <TouchableOpacity
                style={styles.enterclassbutton}
                onPress={() => {
                  setSecretKey(props.secretkey);
                  setSelectCourse(props.id);
                  setModalVisible(!modalVisible);
                }}
              >
                <Entypo name="lock" size={30} color="red" />
              </TouchableOpacity>
            )}
            {course.indexOf(props.id) > -1 && (
              <TouchableOpacity
                style={styles.enterclassbutton}
                onPress={() => {
                  props.courseInfo();
                }}
              >
                <Ionicons name="ios-enter-outline" size={30} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
        {(props.role == "Teacher" || props.role == "Admin") && (
          <View style={[styles.buttoncontainer1, { paddingHorizontal: 20 }]}>
            <TouchableOpacity
              style={[styles.enterclassbutton]}
              onPress={() => {
                props.courseInfo();
              }}
            >
              <Ionicons name="ios-enter-outline" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editcontainer}
              onPress={() => {
                props.editcourse();
              }}
            >
              <AntDesign name="edit" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deletecontainer}
              onPress={() => {
                confirmDel(props.id);
              }}
            >
              <MaterialCommunityIcons name="delete" size={30} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  async function DeleteCourse(course_id) {
    await axios
      .post(`${Path}/DeleteCourse`, {
        course_id: course_id,
      })
      .then((response) => {
        if (response.data == "success") {
          getUser();
          getSubject();
          alert("Delete success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const confirmDel = (id) => {
    return Alert.alert("Are your sure?", "Are you sure to Delete course?", [
      {
        text: "Yes",
        onPress: async () => {
          DeleteCourse(id);
        },
      },
      {
        text: "No",
      },
    ]);
  };
  useEffect(() => {
    getUser();
    getSubject();
    const willFocusSubscription = props.navigation.addListener("focus", () => {
      getSubject();
    });

    return willFocusSubscription;
  }, []);

  async function myCourse() {
    let filter = allCourse.filter((value) => {
      if (course.indexOf(value.course_id) > -1) {
        return value;
      }
    });
    setAllCourse(filter);
  }

  async function AddCourse() {
    if (secretkey == textKey) {
      await axios
        .post(`${Path}/enrollCourse`, {
          id: user.user_id,
          course_id: selectCourse,
        })
        .then((response) => {
          if (response.data == "success") {
            getUser();
            setModalVisible(!modalVisible);
            alert("Enroll success");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Secret key is wrong");
    }
  }

  return (
    <ScrollView
      style={[styles.scrollview]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enroll Course</Text>
              <TextInput
                onChangeText={(text) => setTextKey(text)}
                style={styles.input}
                placeholder="Enroll Key"
              />
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { marginLeft: 5, marginRight: 5 },
                  ]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonConfirm,
                    { marginRight: 5, marginLeft: 5 },
                  ]}
                  onPress={() => {
                    AddCourse(props.id);
                  }}
                >
                  <Text style={styles.textStyle}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/courselogo.png")}
        ></Image>

        {user.role == "Student" && (
          <View style={styles.header}>
            <Text style={styles.text_header}>Course</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => {
                  setAllCourse(backUpCourse);
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  ALL COURSE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  myCourse();
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  MY COURSE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {(user.role == "Teacher" || user.role == "Admin") && (
          <View style={styles.header1}>
            <Text style={styles.text_header}>Course</Text>
            <TouchableOpacity
              style={styles.plus}
              onPress={() => {
                props.navigation.navigate("coursecreate", {
                  teacher: user.user_id,
                });
              }}
            >
              <AntDesign name="plus" size={30} color="black" />
            </TouchableOpacity>
          </View>
        )}
        {/* <FlatList data={allCourse} renderItems={RenderCrouse} style={{ width: "100%" }}/> */}
        {allCourse.map((value) => {
          return (
            <RenderCrouse
              key={value.course_id}
              id={value.course_id}
              data={value}
              img={value.img}
              title={value.title}
              subtitle={value.subtitle}
              role={user.role}
              secretkey={value.s_key}
              courseInfo={() => {
                props.navigation.navigate("courseinfo", {
                  course: value,
                  user: user,
                });
              }}
              editcourse={() => {
                props.navigation.navigate("Editcourse", {
                  teacher: user.user_id,
                  value: value,
                });
              }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8EA",
    alignItems: "center",
  },
  scrollview: {
    flex: 1,
    backgroundColor: "#FFF8EA",
  },
  logo: {
    width: 450,
    height: 200,
    // marginTop: 50,
  },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  text_header: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 30,
    justifyContent: "flex-end",
    // marginRight: 250,
  },
  box: {
    backgroundColor: "#fff",
    alignItems: "center",
    width: 350,
    borderRadius: 20,
    borderColor: "gray",
    // borderWidth: 1,
    marginTop: 50,
    flexDirection: "column",
    borderColor: "#FF9A00",
  },
  courselogo: {
    width: 350,
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textbutton: {
    height: 35,
    marginTop: 10,
    fontSize: 25,
  },
  enterclassbutton: {
    padding: 10,
    backgroundColor: "#ffd7a8",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  buttoncontainer: {
    width: "100%",
  },
  buttoncontainer1: {
    flexDirection: "row",
    backgroundColor: "#ffd7a8",
    padding: 5,
    width: "100%",
    justifyContent: "space-between",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  header1: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent : "space-between",
    width : "100%"
  },
  plus: {
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "70%",
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
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  darkness: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bright: {},
});

export default Course;
