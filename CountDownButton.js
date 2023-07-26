import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { setScreenDownCoordinates, setScreenUpCoordinates } from './storagefunctions';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


export default function CountDownButton(props) {

    let [seconds, setSeconds] = useState(0)
    let countDownSeconds = useRef(0)
    let countDownInterval = useRef(null)
    let [isCountDownStarted, setIsCountDownStarted] = useState(false)


    return (
        <TouchableOpacity
            onPress={() => {
                if (!isCountDownStarted) {
                    setIsCountDownStarted(true)
                    countDownSeconds.current = 5
                    console.log(countDownSeconds)
                
countDownInterval.current = setInterval(()=>{
        console.log(countDownSeconds.current)
        if (countDownSeconds.current <= 0) {
            console.log(countDownSeconds.current+" is less than 0")
            clearInterval(countDownInterval.current)
            setIsCountDownStarted(false)
            props.record()
        }
        else {
            countDownSeconds.current = countDownSeconds.current-1
            setSeconds(countDownSeconds.current) 
        }

    }, 1000)
                
                    
                }

            }}
            style={{ borderWidth: 3, borderColor: "black", borderRadius: 100, padding: 10, justifyContent: "center", alignItems: "center", width:"50%" }}>

            <Text style={{fontSize:32}}>{isCountDownStarted ? countDownSeconds.current : "Start"}</Text>

        </TouchableOpacity>
    )

}