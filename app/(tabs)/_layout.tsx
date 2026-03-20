import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    return <Tabs screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#94A3B8",
    }}>
        <Tabs.Screen
            name="map"
            options={{
                title: "쉬크릿 지도",
                tabBarLabel: "지도",
                tabBarIcon: ({color, size, focused}) => (
                    <Ionicons name={focused ? "map" : "map-outline"} size={size} color={color}/>
                ),
            }}
        />
        <Tabs.Screen
            name="my-shhhcret"
            options={{
                title: "마이 쉬크릿",
                tabBarIcon: ({color, size, focused}) => (
                    <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color}/>
                ),
            }}
        />
    </Tabs>;
}
