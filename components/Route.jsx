import { Text, View, ScrollView, Pressable } from "react-native";
import styles from '../stylesheets/global'
import BottomBar from "./Bottom";
import { useState, useContext, useEffect } from 'react';
import { BusContext } from "../functions/bus";
import Bus from "./Bus";
import calculateTimestamps from "../functions/extra.js";
import { getTime, getNearestLoc } from "../functions/database";
import * as Location from 'expo-location';
import alert from '../components/Alert';
import { showAlert_ } from "../components/Alert";

const Route = () => {
    const { busStops } = useContext(BusContext);
    const { busStop } = useContext(BusContext);
    const { eta } = useContext(BusContext);
    const { changeBusStop, setETA } = useContext(BusContext);
    
    const [busstopcount, setBusstopcount] = useState(0);
    const [arrayOfTimeStamps, setArrayOfTimeStamps] = useState([]);
    const [showAlert, setShowAlert] = useState(false); // State to trigger alert

    useEffect(() => {
        if (eta) {
            let tempBusstopcount = 0;
            busStops.map((stop, idx) => {
                if (stop === busStop) {
                    tempBusstopcount = idx;
                }
            });

            setBusstopcount(tempBusstopcount);
            const timestamps = calculateTimestamps(eta, busStops.length - tempBusstopcount - 1);
            setArrayOfTimeStamps(timestamps);

        }
    }, [eta]);

    const getLocation = async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {

            console.error('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const newloc = `${location.coords.latitude}, ${location.coords.longitude}`;
        const nearestLocBody = await getNearestLoc(newloc);

        const nearestLoc = nearestLocBody.nearest;
        let ok = 0;

        for (var i = 0; i < busStops.length; i++) {
            if (nearestLoc === busStops[i]) ok = 1;
        }

        if (ok === 0) {
            alert('TMT is restricted to Thane only!', `Nearest bus stop is ${nearestLoc}`, [
                { text: 'OK', onPress: () => console.log('') },
            ]);
            return
        } else {
            changeBusStop(nearestLoc);
        }

        setETA(nearestLocBody.timeAndDistance);
    };

    useEffect(() => {
        // Delay the alert until after the component is rendered
        const timer = setTimeout(() => setShowAlert(true), 500);
        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, []);

    useEffect(() => {
        if (showAlert) {
            showAlert_(
                'Are you in this bus right now ?',
                't-Indicator will use your location to track bus',
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            setShowAlert(false); // Dismiss the alert
                            getLocation(); // Trigger location retrieval
                        },
                        style: 'default'
                    },
                    { text: 'No', onPress: () => setShowAlert(false) , style: 'cancel' },
                ]
            );
        }
    }, [showAlert]);

    return (
        <View style={styles.root}>
            <ScrollView style={styles.sv}>
                {busStops.map((stop, idx) => (
                    <View key={idx} style={{ flexDirection: 'row' }}>
                        <View style={styles.buspath}>{stop === busStop && <Bus />}</View>

                        <Pressable
                            onPress={async () => {
                                changeBusStop(stop);
                                const eta_ = await getTime(stop);
                                setETA(eta_);
                            }}
                            style={styles.busstop}
                        >
                            <Text style={styles.bstext}>{stop}</Text>
                            <Text>
                                {idx >= busstopcount + 1 ? arrayOfTimeStamps[idx - busstopcount - 1] : ''}
                            </Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>

            <BottomBar />
        </View>
    );
};

export default Route;
