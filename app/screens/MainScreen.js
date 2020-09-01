import React from 'react';
import {View, StyleSheet, Text, Div, Button, FlatList, TextInput, TouchableWithoutFeedback, ScrollView} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {styles, addingTaskSection} from "../assets/styles.js"
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';
import AsyncStorage from '@react-native-community/async-storage'

//ca-app-pub-3088532579762761~4235259950 - app id
//ca-app-pub-3088532579762761/1376344086 - banner ad id
//ca-app-pub-3088532579762761~8077128583 - IOS APP ID
//ca-app-pub-3088532579762761/3946311880 - banner ad id IOS



let initTasks = [{id: 0, title:"title", subTasks: [], date: false}] //
//console.log("main screen.js")
let subTaskCount = 0;
async function testAds() {
    await setTestDeviceIDAsync('EMULATOR')

} 

//changes the start string for the tasks
const setID = async (id, type) => {
    try {
        const IDstr = parseInt(id) 
        await AsyncStorage.setItem(type , IDstr)
    } catch (e) {
        // saving error
        console.log(e)
    }    
}

const setStartID = async (id) => {
    setID(id, "@startID")
}

const setEndId = async (id) => {
    setID(id, "@endID")
}

//store an object as a string, (use to store individual tasks)
const storeTask = async (task) => {
    try {
        const jsonValue = JSON.stringify(task)
        let key = `@task: ${task.id}`
        await AsyncStorage.setItem(key , jsonValue)
    } catch (e) {
        // saving error
        console.log(e)
    }
}

const getAllTasks = async () => {
    console.log("get all Tasks called")

    try {
        console.log("first try")
        const startID = await AsyncStorage.getItem('@startID')
        const endID = await AsyncStorage.getItem('@endID')
        
        if (startID === null || endID === null) {
            console.log("start ID null")
            setStartID(0)
            return null;
        } else {
            console.log("start ID not null")

            for (let i = parseInt(startID); i <= parseInt(endID); i++) {
                try {
                    let key = `@task: ${task.id}`
                    let jsonValue = await AsyncStorage.getItem(key)

                    if (jsonValue != null) { 
                        initTasks.push(JSON.parse(jsonValue))
                    }

                } catch(e) {
                    console.log(e)
                }
            }
            console.log(initTasks)
        }

    } catch(e) {
        // error reading value
        console.log(e)
    }
}
  
  

function MainScreen({window}) {
    testAds()
    

    let MSState = new Map();
    const [taskList, setTaskList] = React.useState(initTasks) //tasks stored in global map
    MSState["tasks"] = [taskList, setTaskList]
    const [tasksAdded, setTasksAdded] = React.useState(0) //refreshes the flat list
    const [addingTask, setAddingTask] = React.useState(false)
    const [taskTitle, setTaskTitle] = React.useState("")
    const [taskText, setTaskText] = React.useState("")
    const [showDatePicker, setShowDatePicker] = React.useState(false)
    const [taskDate, setTaskDate] = React.useState(false)
    const [editingTask, setEditingTask] = React.useState(-1) //the items id
    const [numTasks, setNumTasks] = React.useState(1)
    const [addTaskButtonTitle, setAddTaskButtonTitle] = React.useState("ADD TASK")
    const [addingSubTasks, setAddingSubTasks] = React.useState([])
    const [addNewSubTask, setAddNewSubTask] = React.useState(0)
    const [subTaskCheckMap, setSubTaskCheckMap] = React.useState({})
    const [initialised, setInitialsed] = React.useState(false)

    if (!initialised) {
        getAllTasks()
        setInitialsed(true)
    }

    
    //const window = [100 , 100]
    //const window = [useWindowDimensions().width, useWindowDimensions().height]
    //console.log("mainscreen")

    function dateToString(date) {
        if (date) { //if date has been set
            let dateString = date.toLocaleDateString()
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
        setTaskList(taskList.filter(item => item != task))
        setStartID(taskList[0].id)
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
            onc={
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
        setNumTasks(numTasks + 1)
        let newTask = {id: numTasks, title: taskTitle, subTasks: addingSubTasks, date: taskDate}
        newTaskList.push(newTask)
        setTaskList(newTaskList)
        storeTask(newTask)
        setEndId(numTasks)
        setTasksAdded(tasksAdded + 1)
        setAddingTask(false)
        
        //setAddNewSubTask(0)

        //add subtask to subtask check map
        newSubTaskCheckMap = subTaskCheckMap
        for (let i = 0; i < addingSubTasks.length; i++) {
            newSubTaskCheckMap[addingSubTasks[i].id] = false
        }
        setSubTaskCheckMap(newSubTaskCheckMap)
        setAddingSubTasks([])
        setTaskDate(false)
        setAddTaskButtonTitle("ADD TASK")

       
    }
    
    const pickDate = (event, date) => {
        setShowDatePicker(false)
        setTaskDate(date)
        
    }

    const DatePickerView = () => {
        if (showDatePicker) {
            return( 
                <DateTimePicker
                onChange={pickDate}
                value={new Date()}/>)
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
                    <View style={{height:"35%", justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize:24}}>Task Title</Text>
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
                        <Text style={{fontSize:24}}>Add a completion date</Text>
                        <Text style={{fontSize:12}}>(optional)</Text>
                        <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
                            <View style={styles.addTaskInput}>
                                <Text>{dateToString(taskDate)}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {DatePickerView()}
                    <View style={{height:"5%"}}/>
                    <Button title="Add Task" onPress={()=>addTask()}
                     color="black"/>
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
                            title={addTaskButtonTitle} color="black"/>
                        {AddTaskSection()}
                    </View>
                    <View style={styles.taskSection}>
                        <View style={styles.taskBox}>
                            <FlatList
                                data={MSState["tasks"][0]}
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
            servePersonalizedAds={false}
            onDidFailToReceiveAdWithError={()=>console.log("add not loaded")}/>
        </View>
    );
}



export default MainScreen;

