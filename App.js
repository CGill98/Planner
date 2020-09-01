import React from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import MainScreen  from "./app/screens/MainScreen";

export default function App() {
  return <MainScreen window={[Dimensions.get("window").width, Dimensions.get("window").height]}/>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
