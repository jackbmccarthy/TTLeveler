import React, { useState, useEffect } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { setScreenDownCoordinates, setScreenUpCoordinates } from './storagefunctions';
import FrontOrBack from './FrontOrBack';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CountDownButton from './CountDownButton';

function showRecommendationText(upOrDown, leftOrRight) {
  if (leftOrRight === "none" && upOrDown === "none") {
    return "Congrats! The table is level!"
  }
  else if (leftOrRight === "none" && upOrDown !== "none") {
    return `Adjust both legs ${upOrDown} the same amount.`
  }
  else if (leftOrRight !== "none" && upOrDown === "none") {
    return `Move the ${leftOrRight} leg up a little bit.`
  }
  else {
    return `Adjust both legs ${upOrDown}, then raise the ${leftOrRight} side a little more.`
  }

}


function ShowResults(props) {
  let [showDetails, setShowDetails] = useState(false)




  return (
    <SafeAreaView style={{ justifyContent: "space-between", alignItems: "center", height: "100%", width: "100%" }}>
      {/* <div dangerouslySetInnerHTML={{_html:`<script>DeviceMotionEvent.requestPermission().then(response => {
        if (response == 'granted') {
            console.log("accelerometer permission granted");
            // Do stuff here
        }
    });</script>`}}></div> */}
      <View>
        <Text style={{ fontSize: 32, fontWeight: "bold", }}>Results</Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24 }}>{showRecommendationText(props.upOrDown, props.leftOrRight)}</Text>
      </View>

      <TouchableOpacity
        style={{ width: "100%", padding: 10, flex: 1 }}
        onPress={() => {
          setShowDetails(showDetails ? false : true)

        }}>
        <View style={{ width: "100%" }}>
          <View>
            <Text>See Details</Text>
          </View>
          {
            showDetails ?
              <View style={{ padding: 10 }}>
                <View>
                  <Text style={{ fontSize: 20 }}>Table End-To-Net:<Text style={{ fontWeight: "bold" }}>{Math.round(props.rawSensorY * 1000) / 1000}</Text></Text>
                </View>
                <View>
                  <Text style={{ fontSize: 20 }}>Left To Right Side:<Text style={{ fontWeight: "bold" }}>{Math.round(props.rawSensorX * 1000) / 1000}</Text></Text>
                </View>
                <View>
                  <Text style={{ fontSize: 12 }}>These measurements are meant to show the amount of tilt on the table, use this number to determine <Text style={{ fontWeight: "bold" }}>how much tilt to correct</Text>. The number will never be exactly zero, but instead the goal is to get as close to zero as possible. Please follow the guidelines mentioned above to level the table.</Text>
                </View>
              </View>

              :
              null
          }
        </View>

      </TouchableOpacity>


      <View>
        <TouchableOpacity style={{ padding: 10, }}
          onPress={() => {
            props.onClose()
          }}
        >
          <Text style={{ fontSize: 32 }}>Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )

}

export default function App() {


  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const [isCalibrated, setIsCalibrated] = useState(null)
  const [tiltDiffernce, setTiltDifference] = useState({ x: 0, y: 0, z: 0 })
  const [upsideCoordinates, setUpsideCoordinates] = useState({ x: 0, y: 0, z: 0 })
  const [downsideCoordinates, setDownsideCoordinates] = useState({ x: 0, y: 0, z: 0 })
  const [selectedTolerance, setSelectedTolerance] = useState(0.015)

  const measurementTolerance = [
    {
      name: "High",
      tolerance: 0.01
    },
    {
      name: "Medium",
      tolerance: 0.015
    },
    {
      name: "Low",
      tolerance: 0.02
    }
  ]

  const [isRecording, setIsRecording] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState({})

  const [isFlatSideSelected, setIsFlatSideSelected] = useState(false)

  const [flatSide, setFlatSide] = useState("front")
  const recordUpSideCoordinates = async ({ x, y, z }) => {
    await setScreenUpCoordinates(x, y, z)
    setUpsideCoordinates({ x: x, y: y, z: z })
  }

  const recordDownSideCoordinates = async ({ x, y, z }) => {
    await setScreenDownCoordinates(x, y, z)
    setDownsideCoordinates({ x: x, y: y, z: z })
  }

  const record = () => {
    if (flatSide === "front") {
      setIsRecording(true)
      let xList = []
      let yList = []
      let zList = []
      let downSideListener = Accelerometer.addListener((measurements) => {
        console.log(measurements)
        xList.push(measurements.x)
        yList.push(measurements.y)
        zList.push(measurements.z)


      })
      setTimeout(() => {
        const xAverage = xList.reduce((a, b) => a + b) / xList.length;
        const yAverage = yList.reduce((a, b) => a + b) / yList.length;
        const zAverage = zList.reduce((a, b) => a + b) / zList.length;

        //           let pitch = Math.atan(xAverage / Math.sqrt((Math.pow(yAverage,2) + Math.pow(zAverage,2))) );
        // let roll = Math.atan(yAverage / Math.sqrt((Math.pow(xAverage,2) + Math.pow(zAverage,2))) );
        // let theta = Math.atan(Math.sqrt((Math.pow(xAverage,2) + Math.pow(yAverage,2))) /zAverage);

        // console.log(pitch, roll, theta)
        recordDownSideCoordinates({
          x: xAverage,
          y: yAverage,
          z: zAverage
        })
        console.log(determineAdjustment(xAverage, yAverage, selectedTolerance))
        downSideListener.remove()
        setIsRecording(false)

      }, 5000)


    }
    else if (flatSide === "back") {
      setIsRecording(true)
      let xList = []
      let yList = []
      let zList = []
      let upSideListener = Accelerometer.addListener((measurements) => {
        console.log(measurements)
        xList.push(measurements.x)
        yList.push(measurements.y)
        zList.push(measurements.z)


      })

      setTimeout(() => {
        const xAverage = xList.reduce((a, b) => a + b) / xList.length;
        const yAverage = yList.reduce((a, b) => a + b) / yList.length;
        const zAverage = zList.reduce((a, b) => a + b) / zList.length;
        recordUpSideCoordinates({
          x: xAverage,
          y: yAverage,
          z: zAverage
        })
        console.log(determineAdjustment(xAverage, yAverage, selectedTolerance))
        upSideListener.remove()
        setIsRecording(false)
      }, 5000)



    }
  }

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(200);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // useEffect(() => {

  //   return () => _unsubscribe();
  // }, []);

  useEffect(() => { 
    DeviceMotionEvent.requestPermission()
    console.log("useEffect Ran")
    async function getPermission() {
      console.log("getPermission ran", Platform.OS === "web")
      if (Platform.OS === "web") {
        let permission =await Accelerometer.requestPermissionsAsync() 
        console.log(permission)
        if (permission.granted) {
          if(await Accelerometer.isAvailableAsync())
          console.log("Have Permission")
          _subscribe();
          _fast()

        }
        else {
          if (permission.canAskAgain) {
            let askPermissions = await Accelerometer.requestPermissionsAsync() 
            console.log(askPermissions)
          }
          else{
            console.log(permission)
          }
        }

      }
    }
    getPermission()
  }, [])

  const determineHighSideX = (xAverage, allowableThreshold = 0.02) => {
    if (Math.abs(xAverage) < allowableThreshold) {
      return "none"
    }
    else if (xAverage >= 0) {
      return "left"
    }
    else if (xAverage < 0) {
      return "right"
    }


  }
  const determineHighSideY = (yAverage, allowableThreshold = 0.02) => {
    console.log(Math.abs(yAverage) < allowableThreshold)
    if (Math.abs(yAverage) < allowableThreshold) {
      return "none"
    }
    else if (yAverage >= 0) {
      return "front"
    }
    else if (yAverage < 0) {
      return "back"
    }
  }

  const determineAdjustment = (xAverage, yAverage, allowableThreshold = 0.02) => {

    console.log(allowableThreshold)

    let startingDirection = {
      upOrDown: "",
      leftOrRight: "",
      rawSensorX: xAverage,
      rawSensorY: yAverage
    }


    if (determineHighSideX(xAverage, allowableThreshold) === "none" && determineHighSideY(yAverage, allowableThreshold) === "none") {
      startingDirection.upOrDown = "none"
      startingDirection.leftOrRight = "none"
    }
    else if (determineHighSideX(xAverage, allowableThreshold) === "none" && determineHighSideY(yAverage, allowableThreshold) !== "none") {
      startingDirection.leftOrRight = "none"
      if (determineHighSideY(yAverage, allowableThreshold) === "back") {
        startingDirection.upOrDown = "up"
      }
      else {
        startingDirection.upOrDown = "down"
      }
    }
    else if (determineHighSideX(xAverage, allowableThreshold) !== "none" && determineHighSideY(yAverage, allowableThreshold) === "none") {
      startingDirection.upOrDown = "none"
      if (determineHighSideX(xAverage, allowableThreshold) === "left") {
        startingDirection.leftOrRight = "right"
      }
      else {
        startingDirection.leftOrRight = "left"
      }
    }
    else if (determineHighSideY(yAverage, allowableThreshold) === "back") {
      startingDirection.upOrDown = "up"

      if (determineHighSideX(xAverage, allowableThreshold) === "left") {
        startingDirection.leftOrRight = "right"
      }
      else {
        startingDirection.leftOrRight = "left"
      }
    }
    else {
      startingDirection.upOrDown = "down"
      if (determineHighSideX(xAverage, allowableThreshold) === "left") {
        startingDirection.leftOrRight = "left"
      }
      else {
        startingDirection.leftOrRight = "right"
      }
    }
    setShowResults(true)
    setResults(startingDirection)
    return startingDirection
  }

  if (!isFlatSideSelected) {
    return (
      <FrontOrBack setFlatSide={(flatSide) => {
        setFlatSide(flatSide)
        setIsFlatSideSelected(true)
      }} />
    )
  }
  else {
    return (
      <SafeAreaView>
        <View style={{ height: "100%", }} >

          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                padding: 3,
                backgroundColor: "lightgray", borderRadius: 10
              }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18
                }}>Accuracy:</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTolerance(0.01)
                }}
                style={{ padding: 1, backgroundColor: selectedTolerance === 0.01 ? "white" : "lightgray", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18
                  }}>High</Text>


              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTolerance(0.015)
                }}
                style={{ padding: 1, backgroundColor: selectedTolerance === 0.015 ? "white" : "lightgray", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18
                  }}>Medium</Text>


              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTolerance(0.02)
                }}
                style={{ padding: 1, backgroundColor: selectedTolerance === 0.02 ? "white" : "lightgray", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18
                  }}>Low</Text>


              </TouchableOpacity>
            </View>

            <View
              style={{
                padding: 3,

              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsFlatSideSelected(false)
                }}
                style={{ padding: 10, backgroundColor: "lightgray", borderRadius: 10, flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18
                  }}>{flatSide === "front" ? "Front" : "Back"}</Text>
                {
                  flatSide === "front" ?
                    <SimpleLineIcons
                      name="screen-smartphone"
                      size={24}
                      color="black" />
                    :
                    <MaterialCommunityIcons name="camera-rear" size={24} color="black" />

                }

              </TouchableOpacity>
            </View>
          </View>



          <View>
            <Text style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" }}>Measuring Table Levelness</Text>

            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 32, textAlign: "center" }}>Press <Text style={{ fontWeight: "bold" }}>Start</Text>, to begin the count down.</Text>
            </View>
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 32, textAlign: "center" }}>Place the {flatSide === "front" ? "Front" : "Back"} side of the phone near the edge of the table, on the middle line.</Text>
            </View>
          </View>

          {/* <View>
        <Text>Which side of your phone is flat?</Text>
        <Button color={flatSide=== "front" ?"blue":"gray"}
        onPress={()=>{
          setFlatSide("front")
        }}
        title='Front'></Button>
        <Button
        color={flatSide=== "back" ?"blue":"gray"}
        onPress={()=>{
          setFlatSide("back")
        }}title='Back'></Button>
      </View> */}
          {
            isRecording ?
              <View style={{ padding: 10, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 32, textAlign: "center" }}>Please wait, measuring level of table. Do not move the table.</Text>
              </View>

              : <View style={{ justifyContent: "center", alignItems: "center" }}>
                <CountDownButton record={record}></CountDownButton>
              </View>
          }


          {/* <View>
            <Text >Current:</Text>
            <Text>x: {x}</Text>
            <Text >y: {y}</Text>
            <Text >z: {z}</Text>
          </View> */}
          {/* <View>
      <Text >Upside:</Text>
      <Text>x: {upsideCoordinates.x}</Text>
      <Text>y: {upsideCoordinates.y}</Text>
      <Text>z: {upsideCoordinates.z}</Text>
      </View>
      <View>
      <Text >Downside:</Text>
      <Text>x: {downsideCoordinates.x}</Text>
      <Text>y: {downsideCoordinates.y}</Text>
      <Text>z: {downsideCoordinates.z}</Text>
      </View>
      <View>
      <Text >Difference:</Text>
      <Text>x: {tiltDiffernce.x}</Text>
      <Text>y: {tiltDiffernce.y}</Text>
      <Text>z: {tiltDiffernce.z}</Text>
      </View> */}

          {/* <View>
            <Button
              onPress={() => {
               record()

                // setTimeout(()=>{
                //   upSideListener.remove()
                // }, 300)

              }}
              title='Record Flat Side'></Button>
          </View> */}
          <View>
            {/* <Button
              onPress={() => {
                let upSideListener = Accelerometer.addListener((measurements) => {
                  console.log(measurements)
                  recordUpSideCoordinates(measurements)
                  upSideListener.remove()
                })
                // setTimeout(()=>{
                //   upSideListener.remove()
                // }, 300)

              }}
              title='Record Upside'></Button>
            <Button
              onPress={() => {
                setTimeout(() => {
                  let downSideListener = Accelerometer.addListener((measurements) => {
                    console.log(measurements)
                    recordDownSideCoordinates(measurements)
                    downSideListener.remove()
                  })


                }, 5000)

              }}
              title='Record Downside'></Button>
            <Button
              onPress={() => {
                setTiltDifference({
                  x: Math.abs(Math.abs(upsideCoordinates.x) - Math.abs(downsideCoordinates.x)),
                  y: Math.abs(Math.abs(upsideCoordinates.y) - Math.abs(downsideCoordinates.y)),
                  z: Math.abs(Math.abs(upsideCoordinates.z) - Math.abs(downsideCoordinates.z))
                })
              }}
              title='Calculate Difference'></Button> */}
          </View>

          <Modal
            animationType="fade"
            transparent={false}

            visible={showResults}

            onRequestClose={() => {
              setShowResults(false)
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
              <ShowResults onClose={() => {
                setShowResults(false)
              }}  {...results} />


            </View>
          </Modal>
        </View>
      </SafeAreaView>

    );
  }


}
