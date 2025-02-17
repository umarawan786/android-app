import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";
import { useChildrenInfo } from "../api/profile";
import Avatar from "./Avatar";
import ChildCard from "./ChildCard";

const RenderAllChilds = () => {
  const [data, setData] = useState(null);
  const { profile } = useAuth();

  const { isPending, isError, error, data: childData } = useChildrenInfo();

  if (isPending) {
    return <ActivityIndicator color={"white"} />;
  }

  if (isError) {
    console.error(error.message);
  }

  const handlePress = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile.id)
      .single();

    if (error) {
      console.error(error.message);
      setData(null);
      return;
    }

    setData(data);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.text}>Load profile details</Text>
      </TouchableOpacity>
      {data ? (
        <Text style={styles.text}>{data.email}</Text>
      ) : (
        <Text style={styles.text}>Nothing to show</Text>
      )}

      {/* Child Data */}
      {childData.map(({ first_name, avatar_file_location }, idx) => {
        return (
          <ChildCard
            key={idx}
            first_name={first_name}
            avatar_file_location={avatar_file_location}
          />
        );
      })}
    </View>
  );
};

export default RenderAllChilds;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 32,
    color: "white",
  },
});
