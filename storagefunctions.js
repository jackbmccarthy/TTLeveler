import AsyncStorage from "@react-native-async-storage/async-storage"


export async function getScreenUpCoordinates(){
    let coordinates = await AsyncStorage.getItem("screenUpCoordinates")
    return JSON.parse(coordinates)
}

export async function setScreenUpCoordinates(x,y,z){
    await AsyncStorage.setItem("screenUpCoordinates", JSON.stringify({
        x:x,
        y:y,
        z:z
    }))
    return true
}

export async function getScreenDownCoordinates(){
    let coordinates = await AsyncStorage.getItem("screenUpCoordinates")
    return JSON.parse(coordinates)
}

export async function setScreenDownCoordinates(x,y,z){
    await AsyncStorage.setItem("screenUpCoordinates", JSON.stringify({
        x:x,
        y:y,
        z:z
    }))
    return true
}

export async function getIsCalibrated(){
    let isCalibrated = await AsyncStorage.getItem("isCalibrated")
    if(isCalibrated === "true"){
        return true
    }
    else{
        return false
    }
}
export async function setIsCalibrated(isCalibrated=true){
    
    await AsyncStorage.setItem("isCalibrated", isCalibrated ? "true":"false")
    return 
}