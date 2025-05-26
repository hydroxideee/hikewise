import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { WeatherService } from "../services/weatherService";

// const chartWidth = Dimensions.get('window').width * 1.5;

const emojiMap = {
  temperature: "🌡️",
  rain: "🌧️",
  windSpeed: "💨",
  windDirection: "🧭",
  uvIndex: "☀️",
  humidity: "💧",
  cloudCover: "☁️",
  visibility: "🌫️",
};

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  latitude: number;
  longitude: number;
  viewMode: "hourly" | "daily";
}

const WeatherMultiChart: React.FC<Props> = ({
  latitude,
  longitude,
  viewMode,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const service = new WeatherService();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const forecast =
          viewMode === "hourly"
            ? await service.getHourlyForecast(latitude, longitude)
            : await service.getDailyForecast(latitude, longitude);
        if (
          viewMode === "hourly" &&
          Array.isArray((forecast as any).forecastHours)
        ) {
          setData((forecast as any).forecastHours);
        } else if (
          viewMode === "daily" &&
          Array.isArray((forecast as any).forecastDays)
        ) {
          setData((forecast as any).forecastDays);
        } else {
          console.warn("Unexpected forecast format:", forecast);
          setData([]);
        }
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude, viewMode]);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Text style={{ margin: 20, color: "red" }}>
        No forecast data available
      </Text>
    );
  }

  const labels = data.map((entry) => {
    let dt;
    if (viewMode === "daily") {
      dt = entry.displayDate;
    } else {
      dt = entry.displayDateTime;
    }

    if (!dt) return "";

    if (viewMode === "daily") {
      const jsDate = new Date(dt.year, dt.month - 1, dt.day);
      return weekdayNames[jsDate.getDay()];
    } else {
      const hours = dt.hours ?? 0;
      const period = hours >= 12 ? "pm" : "am";
      const hour12 = hours % 12 === 0 ? 12 : hours % 12;
      return `${hour12}${period}`;
    }
  });

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#1E90FF",
    },
  };

  const chartWidth = Math.max(Dimensions.get("window").width, data.length * 50);

  const renderChart = (label: string, values: number[], color: string) => (
    <View style={styles.chartBox}>
      <Text style={styles.chartTitle}>{label}</Text>
      <ScrollView horizontal>
        <LineChart
          data={{ labels, datasets: [{ data: values }] }}
          width={chartWidth}
          height={220}
          chartConfig={{ ...chartConfig, color: () => color }}
          bezier
        />
      </ScrollView>
    </View>
  );

  const temperature = data.map((entry) =>
    viewMode === "daily"
      ? entry?.maxTemperature?.degrees ?? 0
      : entry?.temperature?.degrees ?? 0
  );

  const rainChance = data.map((entry) =>
    viewMode === "daily"
      ? entry?.daytimeForecast?.precipitation?.probability?.percent ?? 0
      : entry?.precipitation?.probability?.percent ?? 0
  );

  const windSpeed = data.map((entry) =>
    viewMode === "daily"
      ? entry?.daytimeForecast?.wind?.speed?.value ?? 0
      : entry?.wind?.speed?.value ?? 0
  );

  const windDirection = data.map((entry) =>
    viewMode === "daily"
      ? entry?.daytimeForecast?.wind?.direction?.degrees ?? 0
      : entry?.wind?.direction?.degrees ?? 0
  );

  const windDirectionEmojis = windDirection.map((deg) => {
    if (deg < 45 || deg >= 315) return "↑";
    if (deg < 135) return "→";
    if (deg < 225) return "↓";
    return "←";
  });

  const uvIndex = data.map((entry) =>
    viewMode === "daily"
      ? entry?.daytimeForecast?.uvIndex ?? 0
      : entry?.uvIndex ?? 0
  );

  const humidity = data.map((entry) =>
    viewMode === "daily"
      ? entry?.daytimeForecast?.relativeHumidity ?? 0
      : entry?.relativeHumidity ?? 0
  );

  const cloudCover = data.map((entry) =>
    viewMode === "daily"
      ? entry?.daytimeForecast?.cloudCover ?? 0
      : entry?.cloudCover ?? 0
  );

  const visibility = data.map((entry) =>
    viewMode === "daily"
      ? entry?.daytimeForecast?.visibility?.distance ?? 0
      : entry?.visibility?.distance ?? 0
  );

  return (
    <View style={styles.container}>
      {renderChart("🌡️ Temperature (°C)", temperature, "tomato")}
      {renderChart("🌧️ Chance of Rain (%)", rainChance, "dodgerblue")}
      {renderChart("💨 Wind Speed (km/h)", windSpeed, "green")}

      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>
          {emojiMap.windDirection} Wind Direction
        </Text>
        <ScrollView horizontal>
          <View style={styles.windDirectionContainer}>
            {windDirectionEmojis.map((arrow, index) => (
              <View key={index} style={styles.windDirectionItem}>
                <Text style={styles.windEmoji}>{arrow}</Text>
                <Text style={styles.windLabel}>{labels[index]}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {renderChart("☀️ UV Index", uvIndex, "gold")}
      {renderChart("💧 Humidity (%)", humidity, "deepskyblue")}
      {renderChart("☁️ Cloud Cover (%)", cloudCover, "slategray")}
      {viewMode === "hourly" &&
        renderChart("🌫️ Visibility (km)", visibility, "mediumpurple")}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  chartBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "JetBrainsMono-Bold",
  },
  windDirectionContainer: {
    flexDirection: "row",
    paddingBottom: 20,
  },
  windDirectionItem: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  windEmoji: {
    fontSize: 24,
  },
  windLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#333",
  },
});

export default WeatherMultiChart;
