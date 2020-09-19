import AsyncStorage from '@react-native-community/async-storage'

const setID = async (key, id) => {
    try {
        const IDstr = id.toString() 
        console.log("IDstr: ", IDstr)
        await AsyncStorage.setItem(key , IDstr)
    } catch (e) {
        // saving error
        console.log(e)
    }    
}

const setStartID = async (id) => {
    setID("@startID", id)
}

const setEndID = async (id) => {
    setID("@endID", id)
}

//store an object as a string, (use to store individual tasks)
const storeTask = async (task) => {
    try {
        const jsonValue = JSON.stringify(task)
        console.log("jsonValue: ",typeof jsonValue)
        let key = `@task:${task.id}`
        console.log("stored key: ", key)
        await AsyncStorage.setItem(key , jsonValue)
        setEndID(task.id)
        const startID = parseInt(await AsyncStorage.getItem("@startID")) 
        if (isNaN(startID) || typeof startID !== "number") {
            setStartID(task.id)
        }

        const i = await AsyncStorage.getItem(key)
        console.log("just stored: ", i)
    } catch (e) {
        // saving error
        console.log(e)
    }
}

const clearTask = async (id) => {
    try {
        const key = `@task:${id}` 
        console.log("key ", key)
        await AsyncStorage.removeItem(key)
        let startID = parseInt(await AsyncStorage.getItem("@startID"))
        let endID = parseInt(await AsyncStorage.getItem("@endID"))
        
        if (id == startID) { //change StartID
            console.log("clearTask: id === startID ")
            console.log(`startID ${startID}, endID ${endID}`)
            for (let i = 1 + startID; i <= endID; i++) {
                const taskstr = await AsyncStorage.getItem(`@task:${i}`)
                console.log(`taskstr: ${taskstr}, `)
                if (taskstr !== null) {
                    console.log("clearTask, id == startID: taskstr !== null")
                    const task = JSON.parse(taskstr)
                    console.log("task:", task)
                    setStartID(task.id)
                    startID = task.id
                    break; 
                }
            }

            if (id == startID) { //set id to nan if not changed
                setStartID(NaN)
            }
        }  
        
        if (id == endID) { //change endID
            for (let i = endID - 1; startID <= i; i--) {
                const taskstr = await AsyncStorage.getItem(`@task:${i}`)
                if (taskstr !== null) {
                    const task = JSON.parse(taskstr)
                    setEndID(task.id)
                    endID = task.id
                    break; 
                }
            }

            if (id == endID) {
                setEndID(NaN)
            }
        } 

      } catch(e) {
        // remove error
        console.log(e)
      }
}

//NOTE THERE IS ARE LOCAL GET ALL TASK FUNCTIONS THAT WORK ALONG THESE
export {setStartID, setEndID, storeTask, clearTask};