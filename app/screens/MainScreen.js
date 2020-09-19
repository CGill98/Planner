import React from 'react';
import {View, StyleSheet, Text, Div, Button, FlatList, TextInput, TouchableWithoutFeedback, ScrollView} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {styles, addingTaskSection} from "../assets/styles.js"
import { AdMobBanner, PublisherBanner, setTestDeviceIDAsync } from 'expo-ads-admob';
import AsyncStorage from '@react-native-community/async-storage'
import {setStartID, setEndID, storeTask, clearTask} from '../global/LocalStorage.js'

//ca-app-pub-3088532579762761~4235259950 - app id
//ca-app-pub-3088532579762761/1376344086 - banner ad id
//ca-app-pub-3088532579762761~8077128583 - IOS APP ID
//ca-app-pub-3088532579762761/3946311880 - banner ad id IOS

//console.log("main screen.js")

async function testAds() {
    await setTestDeviceIDAsync('EMULATOR')

} 

const getAllTasks = async () => {
    //console.log("get all Tasks called")
    //console.log(typeof parseInt("1"))
    
    try {
        //console.log("first try block")
        let startID = parseInt(await AsyncStorage.getItem('@startID'))
        let endID = parseInt(await AsyncStorage.getItem('@endID'))
        let initTasks = []; //local list
        //console.log("startID: ", startID)
        if (typeof startID !== "number") {
            //console.log("start ID nan")
            setStartID(0)
        } else {
            if (typeof endID !== "number") {
                //console.log("end ID nan")
                setEndID(0)
            } else {
                //console.log("start ID not null")
                //console.log(startID)
                //console.log(endID)
                //console.log("state-end ids: ", startID, endID)
                
                for (let i = startID; i <= endID; i++) {
                    //console.log(`@task:${i}`)
                    
                    try {
                        let key = `@task:${i}`
                        let jsonValue = JSON.parse(await AsyncStorage.getItem(key))
                        //console.log("jsonvalue retrieved", jsonValue)

                        if (typeof jsonValue === "object" && jsonValue != null) { 
                            //console.log("jsonValue: ", jsonValue)
                            initTasks.push(jsonValue)
                        }

                    } catch(e) {
                        //console.log("b")
                        console.log(e)
                    }
                    
                }
                //console.log(initTasks)
            }
        }
        /*
        return new Promise(function(resolve, reject) { 
            if (0 < initTasks.length) {
                resolve(initTasks)
            } else {
                reject("rejected")
            }
        })*/
        return initTasks

    } catch(e) {
        // error reading value
        //console.log("a")
        console.log(e)
    }
}
  
  

function MainScreen({window, storedTasks}) {
    //testAds()  
    //setTimeout(()=>{console.log("timed out")}, 400)  
    //console.log("stored tasks ", storedTasks)
    //replace below with getalltask
    const [taskList, setTaskList] = React.useState(storedTasks) //tasks stored in global map

    let MSState = new Map();
    MSState["tasks"] = [taskList, setTaskList]
    const [tasksAdded, setTasksAdded] = React.useState(0) //refreshes the flat list
    const [addingTask, setAddingTask] = React.useState(false)
    const [taskTitle, setTaskTitle] = React.useState("")
    const [showDatePicker, setShowDatePicker] = React.useState(false)
    const [showTimePicker, setShowTimePicker] = React.useState(false)
    const [taskDate, setTaskDate] = React.useState(false)
    const [taskTime, setTaskTime] = React.useState(false)
    const [editingTask, setEditingTask] = React.useState(-1) //the items id
    //console.log(`stored tasks last element: ${parseInt(storedTasks[storedTasks.length - 1].id)}`)
    const length = 0 < storedTasks.length ? parseInt(storedTasks[storedTasks.length - 1].id) : 0
    const [endID, setEndID] = React.useState(length)
    const [addTaskButtonTitle, setAddTaskButtonTitle] = React.useState("ADD TASK")
    const [addingSubTasks, setAddingSubTasks] = React.useState([])
    const [addNewSubTask, setAddNewSubTask] = React.useState(0)
    const [subTaskCheckMap, setSubTaskCheckMap] = React.useState({})
    //console.log(`type of endID: ${typeof endID}`)
    //console.log("initTasks length", initTasks.length)
    //console.log("tasklist", taskList)a
    function timeToString(time) {
        if (time) { //if date has been set
            console.log(time)
            let timeString = typeof time === "string" ? time : time.toLocaleTimeString('en-US').substring(0, 5)
            return timeString
        }
        else {
            return ""
        }
    }

    function dateToString(date) {
        if (date) { //if date has been set
            console.log(date)
            let dateString = typeof date === "string" ? date : date.toLocaleDateString()
            return dateString
        }
        else {
            return ""
        }
    }

    const deleteTask = (task) => {
        //console.log(task.id)
        //const newList = taskList.filter(item => item.id != task.id) 
        //console.log(newList)
        //console.log("task id:", task.id)
        setTaskList(taskList.filter(item => item != task))
        clearTask(task.id)
        //setStartID(taskList[0].id)
    }

    const EditTaskView = ({task}) => {
        return(
            <View>
                <Button onPress={()=>deleteTask(task)} title={"Delete Task"}/>
            </View>)
    }

    const SubTask = ({item}) => {
        return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={styles.extraDesc}>{item.str}</Text>
            <CheckBox 
            disabled={false}
            value={subTaskCheckMap[item.id]} 
            onChange={
                () => {
                    //console.log("change")
                    //console.log(subTaskCheckMap)
                    let newVal = !subTaskCheckMap[item.id]
                    let newSubTaskCheckMap = subTaskCheckMap
                    newSubTaskCheckMap[item.id] = newVal
                    //console.log(newSubTaskCheckMap)
                    setSubTaskCheckMap(newSubTaskCheckMap)
                }
            }/>
        </View>)
}

    const SubTaskSection = ({item}) => {
        /*
        let subTasks = []
        for (let i =  0; i < item.subTasks.length; i++) {
            subTasks.push({subTask: item.subTasks[i], id: subTaskObjIndex++})
        }*/
        const subTasks = item.subTasks
        //console.log(subTasks)
        if (subTasks != []) {
            return (
            <FlatList
                data={subTasks}
                renderItem={SubTask}
                keyExtractor={item => `${item.id}`}/>)
            }
        else {
            return <View/>
        }
    }

    const Task = ({item}) => {

        return(
            <TouchableWithoutFeedback onPress={() => setEditingTask( (editingTask == item.id) ? -1 : item.id )}>
                <View style={styles.task}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <SubTaskSection item={item}/>
                    {(item.date != false) ? <Text style={styles.extraDesc}>{"Due date: " + dateToString(item.date)}</Text> : <View/>}
                    {(item.time != false) ? <Text style={styles.extraDesc}>{"Due date: " + timeToString(item.time)}</Text> : <View/>}
                    {(editingTask == item.id) ? <EditTaskView task={item}/> : <View/>}
                </View>
            </TouchableWithoutFeedback>)
    }

    const AddingSubTask= ({item}) => {
        return(
            <View style={{height:"10%", background: "white", borderRadius: 4, margin: 2}}>
                <Text>{item.str}</Text>
            </View>
        )
    }

    const addTask = () => {
        let newTaskList = taskList
        console.log(`endID: ${endID}`)
        
        console.log(`after endID: ${endID}`)
        let newTask = {id: endID + 1, title: taskTitle, subTasks: addingSubTasks, date: taskDate, time: taskTime}
        
        newTaskList.push(newTask)
        setTaskList(newTaskList)
        storeTask(newTask)
        setEndID(endID + 1)    
        setTasksAdded(tasksAdded + 1)
        setAddingTask(false)

        //add subtask to subtask check map
        let newSubTaskCheckMap = subTaskCheckMap
        for (let i = 0; i < addingSubTasks.length; i++) {
            newSubTaskCheckMap[addingSubTasks[i].id] = false
        }
        setSubTaskCheckMap(newSubTaskCheckMap)
        setAddingSubTasks([])
        setTaskDate(false)
        setTaskTime(false)
        setAddTaskButtonTitle("ADD TASK")
       
    }
    
    const pickTime = (event, time) => {
        setShowTimePicker(false)
        setTaskTime(time)   
    }

    const pickDate = (event, date) => {
        setShowDatePicker(false)
        setTaskDate(date)
        
    }

    const TimePickerView = () => {
        if (showTimePicker) {
            return( 
                    <DateTimePicker
                    onChange={pickTime}
                    mode="time"
                    display="clock"
                    value={new Date()}/>
                )
        }
        else {
            return(<View/>)
        }
    }

    const DatePickerView = () => {
        if (showDatePicker) {
            return( 
                    <DateTimePicker
                    onChange={pickDate}
                    value={new Date()}/>
                )
        }
        else {
            return(<View/>)
        }
    }

    const AddTaskSection = (props) => {
        //set the props height
        if (addingTask) {
            return(
                <View style={styles.addingTaskSection}>
                    <View style={{height:"28%", justifyContent:"center", alignItems:"center", fontFamily:"sans-serif"}}>
                        <Text style={{fontSize:24, color:"white"}}>Task Title</Text>
                        <TextInput onChangeText={(text) => setTaskTitle(text)} style={styles.addTaskInput}/>
                    </View>
                    {/*
                    <View style={{height:"30%", justifyContent:"center", alignItems:"center"}}>
                        <Button title="Add SUBTASK" 
                                color="black"
                        onPress={()=>{
                            let newAddingSubTasks = addingSubTasks
                            subTaskCount = 1 + subTaskCount
                            console.log("subtaskcount: ")
                            console.log(subTaskCount)
                            newAddingSubTasks.push({str: taskText, id: subTaskCount})
                            setAddingSubTasks(newAddingSubTasks)
                            setAddNewSubTask(newAddingSubTasks.length)
                        }}/>
                        <TextInput onChangeText={(text) => setTaskText(text)} style={styles.addTaskInput}/>
                        <FlatList
                            data={addingSubTasks}
                            renderItem={AddingSubTask}
                            keyExtractor={item => `${item.id}`}
                            extraData={addNewSubTask}/>
                    </View>
                    */}
                    <View style={{height: "35%", justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize:24, color: "white"}}>Add a completion date</Text>
                        <Text style={{fontSize:12, color: "white"}}>(optional)</Text>
                        <View style={{flexDirection: "row", alignItems:"center", justifyContent:"space-evenly", height: "50%", width:"85%"}}>
                            <TouchableWithoutFeedback onPress={() => setShowTimePicker(true)}>
                                <View style={{...styles.addTaskInput, width:"45%", height: "50%"}}>
                                    <Text>{taskTime !== false ? timeToString(taskTime) : "Time"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
                                <View style={{...styles.addTaskInput, width:"45%", height: "50%"}}>
                                    <Text>{taskDate !== false ? dateToString(taskDate) : "Date"}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    {TimePickerView()}
                    {DatePickerView()}
                    <View style={{height:"9%"}}/>
                    <Button title="Add Task" onPress={()=>addTask()}
                     color="#091225"/>
                </View>
            )
            } else {
                return(
                    <View/>
                )
        }
    }


    return(
        <View style={styles.background}>
            <ScrollView style={styles.content}>
                    <View style={styles.safetyPadding}/>
                    <View style={addingTask ? styles.navPanelsAdding : styles.NavPanels}>
                        <Button 
                            onPress={()=> {  
                                setAddingTask(!addingTask); 
                                setAddTaskButtonTitle(!addingTask ? "UNDO" : "ADD TASK");}} 
                            title={addTaskButtonTitle} color="#091225"/>
                        {AddTaskSection()}
                    </View>
                    <View style={styles.taskSection}>
                        <View style={styles.taskBox}>
                            <FlatList
                                data={taskList}
                                renderItem={Task}
                                keyExtractor={item => `${item.id}`}
                                extraData={tasksAdded}    
                            />
                        </View>
                    </View>
            </ScrollView>
            <AdMobBanner
            bannerSize="smartBannerPortrait"
            adUnitID="ca-app-pub-3088532579762761/1376344086" // Test ID, Replace with your-admob-unit-id
            style={styles.ad}
            onDidFailToReceiveAdWithError={()=>console.log("add not loaded")}/>
        </View>
    );
}

export default MainScreen;

