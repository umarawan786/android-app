import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { wp } from "@/helpers/common";
import { useTheme } from "@/providers/ThemeProvider";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useUpdateGifs } from "@/api/profileGifs";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router";

const TENOR_API_KEY = process.env.EXPO_PUBLIC_TENOR_API_KEY;
const TENOR_BASE_URL = process.env.EXPO_PUBLIC_TENOR_BASE_URL;

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const GifSelection = () => {
  const searchTerm = React.useRef("");
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { profile } = useAuth();
  const { mutate, isSuccess, error: mutationError } = useUpdateGifs();

  const router = useRouter();
  const { gifContainer } = useLocalSearchParams();
  console.log(gifContainer);

  const { theme } = useTheme();

  const handleSearchClick = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      key: TENOR_API_KEY,
      q: searchTerm.current,
      limit: 10,
      country: "UK",
      searchfilter: "sticker",
      contentfilter: "high",
      media_filter: "gif_transparent",
    });

    try {
      const response = await fetch(
        TENOR_BASE_URL + `/search?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("error with code:", response.status);
      }
      const json = await response.json();
      setData(json.results);
    } catch (error) {
      console.error(error);
      Alert.alert("Failed to load. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleGifPressed = async (url) => {
    await mutate({
      user_id: profile?.id,
      column_name: gifContainer,
      column_value: url,
    });

    router.replace("/child/onboarding/customize_profile");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        defaultValue={searchTerm.current}
        onChangeText={(text) => {
          searchTerm.current = text;
        }}
        style={styles.textInput}
      />
      <Pressable style={styles.searchButton} onPress={handleSearchClick}>
        <Text style={styles.searchButtonText}>Search</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <FlatList
          keyboardDismissMode="on-drag"
          data={data}
          ListEmptyComponent={() => (
            <View>
              <Text>Empty</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Pressable
              style={styles.imageContainer}
              onPress={() => {
                handleGifPressed(item?.media_formats?.gif_transparent?.url);
              }}
            >
              <Image
                source={item?.media_formats?.gif_transparent?.url}
                placeholder={blurhash}
                transition={1500}
                contentFit="contain"
                style={styles.gif}
              />
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

export default GifSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  textInput: {
    marginTop: 40,
    width: "80%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: theme.colors.mint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: wp(50),
  },
  searchButtonText: {
    color: theme.colors.white,
    fontFamily: "Poppins-Bold",
  },
  imageContainer: {
    width: 200,
    aspectRatio: 1,
    borderColor: "black",
    borderWidth: 1,
    marginVertical: 10,
  },
  gif: {
    width: "100%",
    aspectRatio: 1,
  },
});
