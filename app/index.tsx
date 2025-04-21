import React from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Image } from "@/components/ui/image";
import { Link } from "expo-router";
import { Linking, ScrollView, StyleSheet, Text, } from "react-native";

export default function Index() {

  const handleCall = async () => {
    const phoneNumber = '1122';
    const url = `tel:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Phone call not supported on this device");
      }
    } catch (error) {
      console.error("Failed to make a call:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Grid
        className="gap-x-4 gap-y-2"
        _extra={{
          className: "col-span-12",
        }}
      >
        <GridItem
          _extra={{ className: "col-span-10 md:col-span-6 lg:col-span-3" }}
        >
          <Card
            size="lg"
            variant="filled"
            style={styles.card}
          >
            <Image
              source={require("../assets/images/quick-guid.png")}
              alt="Quick Guid"
              size="lg"
            />
            <Text style={styles.quidTitle}>Get Instant AI Help</Text>
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              Get instant help with first aid and CPR questions.
            </Text>
            <Button size="lg" variant="solid" style={{ backgroundColor: "#fe2238", marginTop: 20 }}>
              <ButtonText>Start Guidance</ButtonText>
            </Button>
          </Card>
        </GridItem>
        <GridItem
          _extra={{ className: "col-span-10 md:col-span-6 lg:col-span-3" }}
        >
          <Card
            style={styles.card}
          >
            <Image
              source={require("../assets/images/location.png")}
              alt="Find Near Help"
              size="lg"
            />
            <Text style={styles.quidTitle}>Find Nearby Help</Text>
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              Quickly locate hospitals, clinics, and pharmacies near your location.
            </Text>
            <Link href={"/map"} asChild>
            <Button size="lg" variant="solid" style={{ backgroundColor: "#fe2238", marginTop: 20 }}>
              <ButtonText>Find on Map</ButtonText>
            </Button>
            </Link>
          </Card>
        </GridItem>
        <GridItem
          _extra={{ className: "col-span-10 md:col-span-6 lg:col-span-3" }}
        >
          <Card
            size="lg"
            variant="filled"
            style={styles.card}
          >
            <Image
              source={require("../assets/images/phone-call.png")}
              alt="Find Near Help"
              size="lg"
            />
            <Text style={styles.quidTitle}>Emergency Call</Text>
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              Connect instantly with emergency services in critical moments.
            </Text>
            <Button
              size="lg"
              variant="solid"
              style={{ backgroundColor: "#fe2238", marginTop: 20 }}
              onPress={handleCall}
            >
              <ButtonText>Call Now</ButtonText>
            </Button>
          </Card>
        </GridItem>
      </Grid>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Optional: Add padding to avoid content being cut off
  },
  card: {
    minHeight: 200,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#fe2238',
    borderWidth: 1,
    shadowColor: '#fe2238',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  quidTitle: {
    color: '#fe2238',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 15,
    fontWeight: 'bold',
  },
});
