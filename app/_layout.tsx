import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import React from "react";
import CustomHeader from "@/components/CustomHeader";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <View style={styles.container}>
        <View style={styles.stackContainer}>
          <Stack
            screenOptions={({ route }) => ({
              headerShown: !["(auth)/login", "(auth)/register"].includes(route.name), // Hide header for login and register pages
              header: ({ options }) =>
                options.headerShown ? (
                  <CustomHeader title={route.name} />
                ) : null,
            })}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 QuickFistAid. All rights reserved.</Text>
        </View>
      </View>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    flex: 1,
  },
  footer: {
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#888",
  },
});