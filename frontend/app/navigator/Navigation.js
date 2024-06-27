import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  AntDesign,
  Ionicons,
  Entypo,
  FontAwesome,
  Octicons,
} from "@expo/vector-icons";
import Login from "../screen/Login";
import Home from "../screen/Home";
import Register from "../screen/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Profile from "../screen/Profile";
import Chat from "../screen/Chat";
import Course from "../screen/Course";
import ManageRole from "../screen/ManageRole";
import CourseCreate from "../screen/CourseCreate";
import ChatPeople from "../screen/ChatPeople";
import CourseInfo from "../screen/Courseinfo";
import CreateLesson from "../screen/CreateLesson";
import axios from "axios";
import Path from "../../path";
import Assignment from "../screen/Assignment";
import EditLesson from "../screen/EditLesson";
import EditCourse from "../screen/EditCourse";
import Splash from "../screen/Splash";
import CreateDescription from "../screen/CreateDescription";
import EditAssignment from "../screen/EditAssignment";
import EditYoutube from "../screen/EditYoutube";
import AllFile from "../screen/Alls_file";
import ResetPasword from "../screen/ForgotPassword";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const LoginNavigator = createNativeStackNavigator();
const CourseNavigator = createNativeStackNavigator();
const ChatNavigator = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ChatStack() {
  return (
    <ChatNavigator.Navigator initialRouteName="Messages">
      <ChatNavigator.Screen name="Messages" component={Chat} />
      <ChatNavigator.Screen
        name="chatinfo"
        component={ChatPeople}
        options={({ route }) => ({
          title: route.params.data.item.email,
          headerBackTitleVisible: false,
        })}
      />
    </ChatNavigator.Navigator>
  );
}

function CourseStack() {
  return (
    <CourseNavigator.Navigator>
      <CourseNavigator.Screen
        name="coursepage"
        component={Course}
        options={{
          title: "Course",
        }}
      />
      <CourseNavigator.Screen
        name="courseinfo"
        component={CourseInfo}
        options={({ route }) => ({
          title: route.params.course.title,
          headerBackTitleVisible: false,
        })}
      />
      <CourseNavigator.Screen
        name="createLesson"
        component={CreateLesson}
        options={{
          title: "Create Lesson",
          headerBackTitleVisible: false,
        }}
      />
      <CourseNavigator.Screen
        name="coursecreate"
        component={CourseCreate}
        options={{
          title: "Create Course",
          headerBackTitleVisible: false,
        }}
      />
      <CourseNavigator.Screen
        name="Editcourse"
        component={EditCourse}
        options={{
          title: "Edit Course",
          headerBackTitleVisible: false,
        }}
      />
      <CourseNavigator.Screen
        name="EditLesson"
        component={EditLesson}
        options={{
          title: "Edit Lesson",
          headerBackTitleVisible: false,
        }}
      />
      <CourseNavigator.Screen
        name="Assignment"
        component={Assignment}
        options={{
          title: "Assignment",
          headerBackTitleVisible: false,
        }}
      />
      <CourseNavigator.Screen
        name="createDescription"
        component={CreateDescription}
        options={{
          title: "Create Description",
          headerBackTitleVisible: false,
        }}
      />
      <CourseNavigator.Screen
        name="editassignment"
        component={EditAssignment}
        options={{
          title: "Edit Assignment",
          headerBackTitleVisible: false,
        }}
      />
      <CourseNavigator.Screen
        name="EditYoutube"
        component={EditYoutube}
        options={{
          title: "Edit Youtube",
          headerBackTitleVisible: false,
        }}
      />
      <CourseNavigator.Screen
        name="allfile"
        component={AllFile}
        options={{
          title: "All File",
          headerBackTitleVisible: false,
        }}
      />
    </CourseNavigator.Navigator>
  );
}

function TabNavigater() {
  const [role, setRole] = useState("");
  const checkRole = async () => {
    try {
      const value = await AsyncStorage.getItem("@login");
      if (value !== null) {
        axios
          .post(`${Path}/getUserId`, {
            id: JSON.parse(value).user_id,
          })
          .then((response) => {
            setRole(response.data.role);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  let page_componet = <LoginStackNavigator />;
  useEffect(() => {
    checkRole();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="home" size={size} color="black" />;
          },
        }}
      />
      <Tab.Screen
        name="Course"
        component={CourseStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <Entypo name="open-book" size={size} color="black" />;
          },
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          let hide = false
          if(routeName == "chatinfo"){
            hide = true;
          }
          return (
            ({
              tabBarStyle: { display: hide ? "none" : "flex"},
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                return (
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={size}
                    color="black"
                  />
                );
              },
            })
          )
        }}
      />
      {role == "Admin" && (
        <Tab.Screen
          name="Manage"
          component={ManageRole}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Octicons name="gear" size={size} color="black" />;
            },
          }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome name="user-circle" size={size} color="black" />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

function LoginStackNavigator() {
  return (
    <LoginNavigator.Navigator initialRouteName="Splash">
      <LoginNavigator.Screen
        name="login"
        component={Login}
        options={{
          title: "Login",
        }}
      />
      <LoginNavigator.Screen
        name="register"
        component={Register}
        options={{
          title: "Register",
        }}
      />
      <LoginNavigator.Screen
        name="resetpassword"
        component={ResetPasword}
        options={{
          title: "Reset Password",
        }}
      />
      <LoginNavigator.Screen
        name="TabHome"
        component={TabNavigater}
        options={{
          headerShown: false,
        }}
      />
      <LoginNavigator.Screen
        name="Splash"
        component={Splash}
        options={{
          headerShown: false,
        }}
      />
    </LoginNavigator.Navigator>
  );
}
function MyNavigator(props) {
  const [login, setLogin] = useState(false);
  let page_componet = <LoginStackNavigator />;

  return <NavigationContainer>{page_componet}</NavigationContainer>;
}

export default MyNavigator;
