import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { setScreenDownCoordinates, setScreenUpCoordinates } from './storagefunctions';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FrontOrBack(props) {

    return (

        <View style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <View style={{height:"40%", justifyContent:"space-around"}}>
<View style={{padding:3}}>
                <Text style={{fontSize:20, textAlign:"center"}}>Please choose the side of your phone that is flat.</Text>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around"
                }}>
                <View
                    style={{
                        padding: 3,
                        width: "40%"
                    }}>
                    <TouchableOpacity 
                        onPress={() => {
                            props.setFlatSide("front")
                        }}
                        style={{padding:10,backgroundColor:"lightgray", borderRadius:10, flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 30
                            }}>Front</Text>
                        <SimpleLineIcons
                            name="screen-smartphone"
                            size={50}
                            color="black" />

                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        padding: 3,
                        width: "40%"
                    }}>
                <TouchableOpacity 
                        onPress={() => {
                            props.setFlatSide("back")
                        }}
                        style={{padding:10,backgroundColor:"lightgray", borderRadius:10, flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 30
                            }}>Back</Text>
                       <MaterialCommunityIcons name="camera-rear" size={50} color="black" />

                    </TouchableOpacity>
                </View>
            </View>
            </View>
            
            
        </View>
    )
}