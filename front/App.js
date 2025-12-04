import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ProductosScreen from './screens/ProductosScreen';
import ProductoFormScreen from './screens/ProductoFormScreen';
import PersonasScreen from './screens/PersonasScreen';
import PersonaFormScreen from './screens/PersonaFormScreen';
import { DatabaseProvider } from './context/DatabaseContext';

import DeveloperScreen from './screens/DeveloperScreen';
import SplashScreen from './screens/SplashScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function ProductosStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProductosList" component={ProductosScreen} />
            <Stack.Screen name="ProductoForm" component={ProductoFormScreen} />
        </Stack.Navigator>
    );
}

function PersonasStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PersonasList" component={PersonasScreen} />
            <Stack.Screen name="PersonaForm" component={PersonaFormScreen} />
        </Stack.Navigator>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Catálogo') {
                        iconName = focused ? 'shopping' : 'shopping-outline';
                    } else if (route.name === 'Mi Agenda') {
                        iconName = focused ? 'book-account' : 'book-account-outline';
                    } else if (route.name === 'Dev') {
                        iconName = focused ? 'hammer-wrench' : 'hammer-wrench';
                    }

                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#3498db',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Catálogo"
                component={ProductosStack}
            />
            <Tab.Screen
                name="Mi Agenda"
                component={PersonasStack}
            />
            <Tab.Screen
                name="Dev"
                component={DeveloperScreen}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <PaperProvider>
            <DatabaseProvider>
                <NavigationContainer>
                    <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
                        <RootStack.Screen name="Splash" component={SplashScreen} />
                        <RootStack.Screen name="Home" component={MainTabs} />
                    </RootStack.Navigator>
                </NavigationContainer>
            </DatabaseProvider>
        </PaperProvider>
    );
}
