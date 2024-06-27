import { useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Button
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
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function CreateLesson({ route }) {
  const router = useNavigation();
  const richText = useRef();
  const [user, setUser] = useState(route.params.user);
  const [course, setCourse] = useState(route.params.course);
  const [descHTML, setDescHTML] = useState("");
  const [lesson, setLesson] = useState("");
  const [listDocument, setListDocument] = useState([]);
  const [showDescError, setShowDescError] = useState(false);
  const { width } = useWindowDimensions();
  const richTextHandle = (descriptionText) => {
    if (descriptionText) {
      setShowDescError(false);
      setDescHTML(descriptionText);
    } else {
      setShowDescError(true);
      setDescHTML("");
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if(result.type != "cancel"){
      setListDocument([...listDocument, result]);
    }
  };
  const submitContentHandle = async () => {
    const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
    const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

    if (replaceWhiteSpace.length <= 0) {
      setShowDescError(true);
    } else {
      if (listDocument.length == 0) {
        await axios
          .post(`${Path}/createLesson`, {
            course_id: course.course_id,
            u_id: user.user_id,
            lesson: lesson,
            data: descHTML,
          })
          .then((response) => {
            if (response.data == "success") {
              alert("Create Lesson Success");
              router.goBack();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log(1)
        const data = new FormData();
        data.append("course_id", course.course_id);
        data.append("u_id", user.user_id);
        data.append("lesson", lesson);
        data.append("data", descHTML);
        listDocument.map((value)=>{
          const newUri = "file:///" + value.uri.split("file:/").join("");
          data.append("fileSubject", {
            uri: newUri,
            type: value.mimeType,
            name: value.name,
          });
        })
        axios
          .post(`${Path}/createLesson/file`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.data == "success") {
              alert("Create Lesson Success");
              router.goBack();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // send data to your server!
    }
  };
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
            const listsave = [...listDocument];
            listsave.splice(props.index, 1);
            setListDocument(listsave);
            // setListDocument(listDocument.splice(props.index, 1));
          }}
        >
          <MaterialIcons name="delete" size={28} color="red" />
        </TouchableOpacity>
      </View>
    );
  }
  let no_file = <Text style={{ alignSelf: "center" }}>Empty!</Text>;
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ marginBottom: 20 }}
    >
      <SafeAreaView edges={["bottom", "left", "right"]} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={[styles.headerStyle, { alignSelf: "flex-start" }]}>
            Lesson
          </Text>
          <TextInput
            style={styles.textinput}
            onChangeText={(text) => {
              setLesson(text);
            }}
          />
          {/* <Pressable onPress={() => richText.current?.dismissKeyboard()}>
            <Text style={[styles.headerStyle, {marginTop : 10}]}>Your Awesome Content</Text>
            <View style={styles.htmlBoxStyle}>
              <RenderHtml contentWidth={width} source={{ html: descHTML }} />
            </View>
          </Pressable> */}
          <Text style={[styles.headerStyle, { alignSelf: "flex-start" }]}>
            Description
          </Text>
          <View style={styles.richTextContainer}>
            <RichEditor
              ref={richText}
              onChange={richTextHandle}
              placeholder="Description :)"
              androidHardwareAccelerationDisabled={true}
              style={styles.richTextEditorStyle}
              initialHeight={250}
            />
            <RichToolbar
              editor={richText}
              selectedIconTint="#873c1e"
              iconTint="#312921"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.setStrikethrough,
                actions.undo,
                actions.redo,
              ]}
              style={styles.richTextToolbarStyle}
            />
          </View>
          {showDescError && (
            <Text style={styles.errorTextStyle}>
              Your content shouldn't be empty 🤔
            </Text>
          )}
          <Text style={[styles.headerStyle, { alignSelf: "flex-start" }]}>
            Material
          </Text>
          <View
            style={[
              styles.upload,
              no_file ? { justifyContent: "center", minHeight: 100 } : null,
            ]}
          >
            {listDocument.length == 0 && no_file}
            {listDocument.length != 0 &&
              listDocument.map((value, index) => {
                // console.log(value)
                return (
                  <File_upload key={index} name={value.name} index={index} />
                );
              })}
          </View>
          <TouchableOpacity
            style={[styles.saveButtonStyle, { marginTop: 20 , backgroundColor: "royalblue"}]}
            onPress={() => {
              pickDocument();
            }}
          >
            <Text style={[styles.textButtonStyle]}>Upload your file</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButtonStyle, { marginBottom: 10 }]}
            onPress={submitContentHandle}
          >
            <Text style={styles.textButtonStyle}>Add</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#FFF8EA",
    padding: 20,
    alignItems: "center",
  },

  headerStyle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#312921",
    marginBottom: 10,
  },

  htmlBoxStyle: {
    height: 200,
    width: 374,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },

  richTextContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    width: "100%",
    marginBottom: 10,
  },

  richTextEditorStyle: {
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: "#ccaf9b",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },

  richTextToolbarStyle: {
    backgroundColor: "#ffbA00",
    borderColor: "#ffbA00",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },

  errorTextStyle: {
    color: "#FF0000",
    marginBottom: 10,
  },

  saveButtonStyle: {
    borderWidth: 1,
    borderColor: "#ffbA00",
    borderRadius: 10,
    padding: 10,
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
    marginTop: 10,
    backgroundColor: "#ffbA00",
  },

  textButtonStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  textinput: {
    backgroundColor: "white",
    width: "100%",
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },
  scroll: {
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
});

export default CreateLesson;
