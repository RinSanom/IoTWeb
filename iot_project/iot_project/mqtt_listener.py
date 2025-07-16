import json
import paho.mqtt.client as mqtt
import psycopg2
from datetime import datetime

# PostgreSQL connection setup
conn = psycopg2.connect(
    dbname="air",
    user="postgres",
    password="1605",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker with code", rc)
    client.subscribe("air/quality")

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())

        query = """
            INSERT INTO air_quality_readings 
            (aqi_category, pm10, pm2_5, no2, o3, co, so2, nh3, pb, timestamp) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get("aqi_category", ""),
            data.get("pm10", 0),
            data.get("pm2_5", 0),
            data.get("no2", 0),
            data.get("o3", 0),
            data.get("co", 0),
            data.get("so2", 0),
            data.get("nh3", 0),
            data.get("pb", 0),
            datetime.now()
        )
        cursor.execute(query, values)
        conn.commit()
        print("Saved to DB:", data)

    except Exception as e:
        print("Error saving data:", e)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)
client.loop_forever()
