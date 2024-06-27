import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import Path from "../../path";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

function Assignment({ route }) {
  const [user, setUser] = useState(route.params.user);
  const [course, setCourse] = useState(route.params.course);
  const [document, setDocument] = useState([]);
  moment.locale("th");
  const [backUpDocument, setBackUpDocument] = useState([]);
  const [submitStatus, setSubmitstatus] = useState(true);
  const [gradestatus, setGradestatus] = useState(false);
  const [checkFile, setCheckFile] = useState(false);
  const [modified, setModefied] = useState("-");
  const [duedate, setDueDate] = useState("-");
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type != "cancel") {
      setDocument(result);
    }
  };

  async function getFileStudent() {
    await axios
      .post(`${Path}/getDescription/Assignment`, {
        d_id: route.params.data.d_id,
        c_id: course.course_id,
      })
      .then((response) => {
        setDueDate(moment(response.data.date).format("D MMMM YYYY, h:mm:ss a"));
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(`${Path}/getFileStudent/id`, {
        h_id: route.params.h_id,
        d_id: route.params.data.d_id,
        u_id: user.user_id,
      })
      .then((response) => {
        if (response.data.length != 0) {
          setDocument(response.data);
          setBackUpDocument(response.data);
          setModefied(
            moment(response.data.date).format("D MMMM YYYY, h:mm:ss a")
          );
          setCheckFile(true);
          if (response.data.status == "Pass") {
            setGradestatus(true);
          } else if (response.data.status == "Not Pass") {
            setGradestatus(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getFileStudent();
  }, []);

  async function addFile() {
    if (checkFile) {
      const data = new FormData();
      data.append("u_id", user.user_id);
      data.append("h_id", route.params.h_id);
      data.append("d_id", route.params.data.d_id);
      data.append("s_id", backUpDocument.s_id);
      data.append("filename", document.name);
      data.append("path", backUpDocument.path);
      const newUri = "file:///" + document.uri.split("file:/").join("");
      data.append("fileStudent", {
        uri: newUri,
        type: document.mimeType,
        name: document.name,
      });
      axios
        .post(`${Path}/updateAssignment/file`, data)
        .then((response) => {
          if (response.data.length != 0) {
            let path = response.data[0].path;
            axios
              .post(`${Path}/checksyntax`, {
                filepath: path,
                s_id: response.data[0].s_id,
              })
              .then((res) => {
                if (res.data) {
                  getFileStudent();
                  alert("Success");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const data = new FormData();
      data.append("u_id", user.user_id);
      data.append("h_id", route.params.h_id);
      data.append("d_id", route.params.data.d_id);
      data.append("filename", document.name);
      const newUri = "file:///" + document.uri.split("file:/").join("");
      data.append("fileStudent", {
        uri: newUri,
        type: document.mimeType,
        name: document.name,
      });
      axios
        .post(`${Path}/uploadAssignment/file`, data)
        .then((response) => {
          if (response.data != "err") {
            let path = response.data.path;
            axios
              .post(`${Path}/checksyntax`, {
                filepath: path,
                s_id: response.data.s_id,
              })
              .then((res) => {
                if (res.data) {
                  getFileStudent();
                  alert("Success");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  function File_upload(props) {
    return (
      <View
        style={{
          width: "100%",
          padding: 13,
          borderBottomWidth: 1,
          borderColor: "darkgrey",
          justifyContent: "space-between",
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
          <AntDesign name="pdffile1" size={28} color="black" />
          <Text style={{ marginLeft: 10 }}>{props.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setDocument(backUpDocument);
          }}
        >
          <MaterialIcons name="delete" size={28} color="red" />
        </TouchableOpacity>
      </View>
    );
  }
  let no_file = <Text style={{ alignSelf: "center" }}>Empty!</Text>;
  const submitContentHandle = async () => {
    const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
    const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

    if (replaceWhiteSpace.length <= 0) {
      setShowDescError(true);
    } else {
      if (document.name == undefined) {
      } else {
      }
      // send data to your server!
    }
  };
  let submited = <Text>Submitted for grading</Text>;
  let nonsubmit = <Text>Nothing has been submitted for this assignment</Text>;
  let pass = <Text>Pass</Text>;
  let notPass = <Text>Not Pass</Text>;
  let notGrade = <Text>Not graded</Text>;
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Text style={styles.headerStyle}>Submission status</Text>
      <View
        style={[
          styles.showdata,
          submitStatus ? { backgroundColor: "#CFEECE" } : null,
        ]}
      >
        {submitStatus && submited}
        {!submitStatus && nonsubmit}
      </View>
      <Text style={styles.headerStyle}>Grading status</Text>
      <View
        style={[
          styles.showdata,
          gradestatus && submitStatus ? { backgroundColor: "#CFEECE" } : null,
          !gradestatus && submitStatus
            ? { backgroundColor: "lightcoral" }
            : null,
        ]}
      >
        {gradestatus && submitStatus && pass}
        {!gradestatus && submitStatus && notPass}
        {!submitStatus && notGrade}
      </View>
      <Text style={styles.headerStyle}>Due date</Text>
      <View style={styles.showdata}>
        <Text>{duedate}</Text>
      </View>
      <Text style={styles.headerStyle}>Last modified</Text>
      <View style={styles.showdata}>
        <Text>{modified}</Text>
      </View>
      <Text style={styles.headerStyle}>file submissions</Text>
      <View
        style={[
          styles.upload,
          no_file ? { justifyContent: "center", height: 100 } : null,
        ]}
      >
        {document.length == 0 && no_file}
        {document.length != 0 && (
          <File_upload key={document} name={document.name} />
        )}
      </View>
      <TouchableOpacity
        style={[styles.saveButtonStyle]}
        onPress={() => {
          pickDocument();
        }}
      >
        <Text style={styles.textButtonStyle}>Add file</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.saveButtonStyle,
          document != backUpDocument || document.length == 0
            ? { backgroundColor: "royalblue" }
            : { backgroundColor: "gray" },
        ]}
        onPress={() => {
          if (document != backUpDocument) {
            addFile();
          } else {
            alert("Please Add Submission");
          }
        }}
      >
        <Text style={styles.textButtonStyle}>Submit Assignment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8EA",
  },

  upload: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
    padding: 10,
  },
  saveButtonStyle: {
    borderRadius: 10,
    padding: 13,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
    marginTop: 15,
    backgroundColor: "#ffbA00",
  },

  textButtonStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  scroll: {
    backgroundColor: "#FFF8EA",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerStyle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
  },
  showdata: {
    width: "100%",
    backgroundColor: "white",
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
});
export default Assignment;
