import {Tabs} from "expo-router";

export default function TabLayout() {
    return <Tabs>
        <Tabs.Screen name="map" options={{title: "쉬크릿 지도"}}/>
        <Tabs.Screen name="my-shhhcret" options={{title: "마이 쉬크릿"}}/>
    </Tabs>;
}
