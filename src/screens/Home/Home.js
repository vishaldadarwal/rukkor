import React, { useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicatorBase,
  ActivityIndicator
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logoutUser } from "../../redux/reducers/user";

const Home = ({ navigation }) => {
  const userData = useSelector((state) => state.user?.user);
  const token = useSelector((state) => state?.user?.AuthToken);
  console.log(userData);

  const dispatch = useDispatch();

  const logOutUserMutation = useMutation({
    mutationFn: () => {
      return axios.post(
        "users/log_out",
        {
          device_id: userData.device_id
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );
    }
  });

  useEffect(() => {
    if (logOutUserMutation.isSuccess) {
      console.log("logout-----", logOutUserMutation.data?.data);
      Alert.alert(logOutUserMutation.data?.data?.message);
      let payload = {
        user: null,
        loggedIn: false,
        AuthToken: null
      };
      dispatch(logoutUser(payload));
      logOutUserMutation.reset();
      navigation.navigate("Login");
    }
    if (logOutUserMutation.isError) {
      Alert.alert("Something went wrong!");
      console.log("error", logOutUserMutation.error,userData.device_id);
      logOutUserMutation.reset();
    }
  }, [logOutUserMutation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={styles.container}>
        <View style={styles.container}>
          <Text>Welcome to Home Screen</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            logOutUserMutation.mutate();
          }}
          style={{
            backgroundColor: "#E7651C",
            padding: 15,
            borderRadius: 8,
            marginBottom: 10
          }}
        >
          {logOutUserMutation.isPending ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ textAlign: "center", color: "white" }}>Log Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between"
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Home;
