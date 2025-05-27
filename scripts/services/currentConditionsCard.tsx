import { InfoSvg } from "@/components/InfoSvg";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Tooltip from "rn-tooltip";
import {
  cloudCoverTip,
  precipitationTip,
  tempTip,
  windTip,
} from "../data/toolTips";
import { WeatherService } from "../services/weatherService";

interface Props {
  latitude: number;
  longitude: number;
}

const CurrentConditionsCard: React.FC<Props> = ({ latitude, longitude }) => {
  const [conditions, setConditions] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const weatherService = new WeatherService();

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const data = await weatherService.getCurrentConditions(
          latitude,
          longitude
        );
        setConditions(data);
      } catch (error) {
        console.error("Error fetching current conditions:", error);
        setConditions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConditions();
  }, [latitude, longitude]);

  if (loading) {
    return <ActivityIndicator style={{ marginVertical: 10 }} />;
  }

  if (!conditions) {
    return <Text style={{ color: "red" }}>No current data</Text>;
  }

  return (
    <View style={styles.card}>
      <View style={styles.stat}>
        <Text style={styles.text}>
          🌡️ Temp: {conditions.temperature?.degrees ?? "-"}°C
        </Text>
        <Tooltip
          width={250}
          actionType="press"
          popover={<Text>{tempTip(conditions.temperature?.degrees)}</Text>}
        >
          <InfoSvg size={24} />
        </Tooltip>
      </View>
      <View style={styles.stat}>
        <Text style={styles.text}>
          💨 Wind: {conditions.wind?.speed?.value ?? "-"} km/h
        </Text>
        <Tooltip
          width={250}
          actionType="press"
          popover={<Text>{windTip(conditions.wind?.speed?.value)}</Text>}
        >
          <InfoSvg size={24} />
        </Tooltip>
      </View>
      <View style={styles.stat}>
        <Text style={styles.text}>
          🌧️ Precipitation:{" "}
          {conditions.precipitation?.probability?.percent ?? "-"}%
        </Text>
        <Tooltip
          width={250}
          actionType="press"
          popover={
            <Text>
              {precipitationTip(conditions.precipitation?.probability?.percent)}
            </Text>
          }
        >
          <InfoSvg size={24} />
        </Tooltip>
      </View>
      <View style={styles.stat}>
        <Text style={styles.text}>
          ☁️ Cloud Cover: {conditions.cloudCover ?? "-"}%
        </Text>
        <Tooltip
          width={250}
          actionType="press"
          popover={<Text>{cloudCoverTip(conditions.cloudCover)}</Text>}
        >
          <InfoSvg size={24} />
        </Tooltip>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingLeft: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    fontFamily: "JetBrainsMono-Regular",
    color: "#333",
  },
  stat: {
    marginBottom: 4,
    flex: 1,
    flexDirection: "row",
    gap: 2,
  },
});

export default CurrentConditionsCard;
