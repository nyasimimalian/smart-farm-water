
# Smart Irrigation System Dashboard

## Overview
A responsive web dashboard for small-scale farmers to monitor soil conditions, control irrigation, and receive alerts — with mock sensor data, real API endpoints, and weather integration.

## Pages & Features

### 1. Dashboard (Home)
- **Real-time sensor cards** showing soil moisture (with green/yellow/red indicators), temperature, humidity, and pump status (ON/OFF badge)
- **Pump control** — manual ON/OFF toggle with confirmation dialog
- **Auto/Manual mode switch** — toggle between automatic threshold-based irrigation and manual control
- **Recent alerts** panel showing latest notifications
- **Current weather** widget with forecast data from OpenWeatherMap free API

### 2. Analytics Page
- **Moisture trend chart** (line chart over time using Recharts)
- **Temperature & humidity charts**
- **Irrigation activity log** (pump on/off history with duration)
- **Water usage summary** (estimated from pump run time)
- Date range filter for all charts

### 3. Alerts Page
- List of all alerts (low moisture, pump activated, sensor failures)
- Color-coded severity (red = critical, yellow = warning, green = info)
- Mark as read / dismiss functionality

### 4. Settings Page
- Configure moisture thresholds (low/high) for auto-irrigation
- Set notification preferences
- Weather location configuration

## Backend (Lovable Cloud + Supabase)

### Database Tables
- **sensor_data** — moisture_level, temperature, humidity, timestamp
- **pump_log** — pump_status, activation_time, deactivation_time
- **alerts** — message, severity, timestamp, is_read
- **settings** — moisture_threshold_low, moisture_threshold_high, weather_location

### Edge Functions (API Endpoints)
- **POST /sensor-data** — receives data from ESP32 (or mock simulator), stores it, triggers automation logic and alerts
- **GET /farm-data** — returns latest sensor readings and pump status
- **POST /pump-control** — manual pump ON/OFF command
- **GET /history** — historical sensor data with date filtering

### Mock Data Simulator
- Built-in data generator that posts realistic sensor readings every few seconds for demo purposes
- Can be toggled on/off from the dashboard

## Design
- Clean, simple UI designed for farmers with limited tech experience
- Large, clear indicators: **Green** = optimal, **Yellow** = attention, **Red** = action needed
- Mobile-friendly responsive layout
- Dark/light mode support

## Weather Integration
- OpenWeatherMap free API for current conditions and forecast
- Display on dashboard with recommendation (e.g., "Rain expected — irrigation paused")
