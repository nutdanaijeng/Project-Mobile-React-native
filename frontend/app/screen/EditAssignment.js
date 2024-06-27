import { useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";
import Path from "../../path";

function EditAssignment({route}){
    const [selectedDate, setSelectedDate] = useState(route.params.value.date);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [data, setData] = useState(route.params.value.data);
    const [assignment, setAssignment] = useState(route.params.value);
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

    async function editAssign(){
        await axios.post(`${Path}/EditAssignment`, {
            c_id : assignment.c_id,
            d_id : assignment.d_id,
            u_id : assignment.u_id,
            data : data,
            date : selectedDate
        })
        .then((response) =>{
            if(response.data == 'success'){
                alert("Edit Assignment Success");
                router.goBack();
            }
        })
        .catch((err) =>{
            console.log(err)
        })
    }




    return(
        <ScrollView style={styles.scroll}>
            <Text style={styles.headerStyle}>Title</Text>
            <TextInput style={styles.input} defaultValue={data} onChangeText={(value)=>{
                setData(value);
            }}/>
            <Text style={styles.headerStyle}>Due date</Text>
            <View style={styles.input}>
                <Text>
                    {selectedDate
                    ? moment(selectedDate).format("D MMMM YYYY, h:mm:ss a")
                    : "Please select date"}
                </Text>
            </View>
            <TouchableOpacity onPress={showDatePicker} style={styles.button}>
                <Text style={{color: "white", fontSize: 16, fontWeight: "600"}}>Select Due Date</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <TouchableOpacity onPress={() =>{
                editAssign();
            }} style={[styles.button, {backgroundColor: "royalblue"}]}>
                <Text style={{color: "white", fontSize: 16, fontWeight: "600"}}>Update Assignment</Text>
            </TouchableOpacity>
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
    }
});
export default EditAssignment;