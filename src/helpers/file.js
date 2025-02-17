import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export const readFileAsBase64ArrayBuffer = async (uri) => {
  if (typeof uri !== "string") {
    throw new Error("Invalid URI: URI should be a string");
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return decode(base64);
};

export const getFileExtension = (fileUri) => {
  if (typeof fileUri !== "string") {
    throw new Error("Invalid URI: URI should be a string");
  }

  const match = fileUri.match(/\.(\w+)(\?.*)?$/);
  if (match && match[1]) {
    return match[1]; // Return the file extension (e.g., "mp4")
  }

  // If no extension is found
  return null;
};
