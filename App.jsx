import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Route from './components/Route'; 
import Home from './components/Home';
import Chat from './components/Chat';
import Contribute from './components/Contribute';
import Account from './components/Account'
import { BusContext } from './functions/bus';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';


// IMPORTANT REGARDING NAVIATION LIBRARY.

// you need to add the react-native-screens and react-native-safe-area-context dependency when using navigation dependency as well otherwise apk won't work
// Set a property called  "androidStatusBar": {"translucent": true } in app.json. I think you can use StatusBar dependency as well but just in case it fails, I can't be bothered to make another apk and it worked acc to one guy on stackoverflow

const Drawer = createDrawerNavigator();

const RouteDrawer = ({ route }) => {

  const { busRoute } = route.params; // Accessing busRoute from route params

  const [busStop, changeBusStop] = useState("Pawar Nagar"); // glowy thing
  const [busStops, changeBusStops] = useState([]);
  const [color, setColor] = useState("red")

  const tmtBusStops = [
      [
          "PAWAR NAGAR",
          "MUNICIPAL SCHOOL",
          "EDENWOOD",
          "LOKPURAM",
          "VASANT VIHAR",
          "JAWAHAR NAGAR",
          "GANDHI NAGAR",
          "VOLTAS",
          "SUBHASH NAGAR",
          "OSWAL PARK",
          "MAJIWADA NAKA",
          "MUKTAI NAGAR",
           "GOKUL NAGAR", 
         "UTHALSAR NAKA",  
         "CIVIL HOSPITAL", 
          "CENTRAL MAIDAN",
          "COURTNAKA",
          "TALAO PALI",
          "THANE STATION"
      ],
      [
        "ANAND NAGAR",
        "VIJAY NAGARI",
        "WAGHBIL",
        "DONGRI PADA",
        "PATLI PADA",
        "AZAD NAGAR",
        "MULLA BAGH",
        "MANPADA",
        "LOCKIM COMPANY",
        "HIDE PARK",
        "KAPURBAWDI",
        "ASHAPURA MANDIR",
        "MAJIWADA",
        "MUKTAI NAGAR",
        "GOKUL NAGAR",
        "CENTRAL MAIDAN",
        "COURT NAKA",
        "CIVIL COURT",
        "TALAV PALI",
        "THANE RAILWAY STATION"
        ]
  ];

  useEffect(() => {
      changeBusStops(tmtBusStops[busRoute]);
  }, [busRoute]);

  return (
      <BusContext.Provider value={{ busStop, busStops, changeBusStop, setColor, color }}>
          <Drawer.Navigator>
              <Drawer.Screen name="RoutesList" component={Route} options={() => ({ headerShown: false })} />
              <Drawer.Screen name="Chat" component={Chat} options={() => ({ headerShown: false })} />
              <Drawer.Screen name="Contribute" component={Contribute} options={() => ({ headerShown: false })} />
          </Drawer.Navigator>
      </BusContext.Provider>
  );
};

const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
        <StatusBar translucent backgroundColor="transparent"/>
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Route"
                component={RouteDrawer}
                options={{

                headerStyle: {
                    backgroundColor: 'red', 
                  },

                headerBackImageSource: require('./assets/back-icon.png')
                  }}
                  
            />
            <Stack.Screen
                name="Account"
                component={Account}
            />
        </Stack.Navigator>
    </NavigationContainer>
);
};

export default App;
