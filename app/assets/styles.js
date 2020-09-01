import {View, StyleSheet, Text, Div, Button} from 'react-native';
/*
const windowWidth = useWindowDimensions().width;
const windowHeight = useWindowDimensions().height;

function addingTaskSectionSize() {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    return windowHeight * 0.5
}*/


const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'white',
        //justifyContent: "flex-start"
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
    },
    ad: {
        width: "100%", backgroundColor:"white", alignSelf: "flex-end"
    },
    taskSection: {
        flex: 1,
    },
    NavPanels: {
        flex: 1,
        backgroundColor: '#44E',
    },
    safetyPadding: {
        height: 30,
        backgroundColor: '#FFF',
    },
    navPanelsAdding: {
        height: 250,
        //backgroundColor: '#44E',
        backgroundColor: 'white',
    },
    taskBoxHeader: {
        flex: 1,
        padding: '2%',
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: '#33E',
    },
    taskHeaderText: {
        flex: 1,
    },
    taskBox: {
        flex: 5,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: "black", 
    },
    task: {
        padding: '1%',
        //fontSize: 20,
        backgroundColor: 'white',
        borderTopColor:'black', 
        borderTopWidth: 1,
        
        marginTop: '0%',
    },
    taskTitle: {
        fontSize: 30,
    },
    extraDesc: {
        fontSize: 18,
    },
    addingTaskSection: {
        backgroundColor: "#CCCCCC",
        //flex: 1,
        height: "96%",
        justifyContent: "flex-start",
        //height:"70%"
    },
    addTaskInput: {
        backgroundColor:"white", 
        width:"50%",
        borderRadius: 4,
        height: "35%"
    }
})

const addingTaskSection = (window) => {
    const height = window[1]
    return({
        backgroundColor: "#c94eff",
        height: "50%"
    })
}


export {styles, addingTaskSection};