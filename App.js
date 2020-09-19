import React from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import MainScreen  from "./app/screens/MainScreen";
import { AppLoading } from 'expo';
import AsyncStorage from '@react-native-community/async-storage'
let GLOBAL_storedTasks = []

function extractDate(datestr) {
  return new Date(Date.parse(datestr))
}

clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch(e) {
    // clear error
  }

  //console.log('Done.')
}

const getAllTasks = async () => {
  
  try {
      let startID = parseInt(await AsyncStorage.getItem('@startID'))
      let endID = parseInt(await AsyncStorage.getItem('@endID'))
      let initTasks = []; //local list
      if (typeof startID !== "number") {
          setStartID(0)
      } else {
          if (typeof endID !== "number") {
              setEndID(0)
          } else {

              //console.log("start-end ids: ", startID, endID)
              
              for (let i = startID; i <= endID; i++) {
                  //console.log(`@task:${i}`)
                  
                  try {
                      let key = `@task:${i}`
                      let jsonValue = JSON.parse(await AsyncStorage.getItem(key))
                      //console.log("jsonvalue retrieved", jsonValue)

                      if (typeof jsonValue === "object" && jsonValue != null) { 
                          //console.log("jsonValue: ", jsonValue)
                          if (jsonValue.date !== false) {
                            jsonValue.date = extractDate(jsonValue.date)
                          }

                          if (jsonValue.time !== false) {
                            jsonValue.time = extractDate(jsonValue.time)
                          }

                          initTasks.push(jsonValue)
                      }

                  } catch(e) {
                      console.log(e)
                  }
                  
              }

              return initTasks;
          }
          
        }

  } catch(e) {
      // error reading value
      console.log(e)
  }
}

export default function App() {
  const [init, setInit] = React.useState(false)
  const [storedTasks, setStoredTasks] = React.useState([])

  async function initialise() {
    //await clearAll()

    //console.log("initialise")
    GLOBAL_storedTasks = await getAllTasks()
    
  }

  if (init) {
    
    return <MainScreen window={[Dimensions.get("window").width, Dimensions.get("window").height]}
                       storedTasks={GLOBAL_storedTasks}/>;
  } else {
    return <AppLoading
      startAsync={initialise}
      onFinish={()=>{
        setStoredTasks(GLOBAL_storedTasks)
        setInit(true)}}></AppLoading>
  }
}


