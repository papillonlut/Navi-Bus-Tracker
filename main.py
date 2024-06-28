import requests
import json
import time
from google.transit import gtfs_realtime_pb2

url = "https://proxy.transport.data.gouv.fr/resource/divia-dijon-gtfs-rt-vehicle-position"
history_file = "history.json"

while True:
    response = requests.get(url)
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(response.content)
    
    vehicles = []
    
    for entity in feed.entity:
        if entity.HasField('vehicle'):
            vehicle = entity.vehicle
            
            vehicle_id = vehicle.vehicle.id
            latitude = vehicle.position.latitude
            longitude = vehicle.position.longitude
            # headsign = vehicle.trip.headsign
            timestamp = vehicle.timestamp
            
            # Extracting line and modifying as needed
            line = vehicle.trip.route_id
            line2 = line.replace('4-', '', 8)
            
            # Assigning color and image based on line
            if line == "4-T1" or line == "4-T2":
                headsign = ""
                color = "#ab0070"
                img = ""
            elif line == "4-CO":
                headsign = ""
                color = "#00b1e6"
                img = ""
            elif line in ["4-L3", "4-L4", "4-L5", "4-L6", "4-L7", "4-L8", "4-L9"]:
                headsign = ""
                color = "#e7619c"
                img = ""
            elif line in ["4-10", "4-12", "4-13", "4-14", "4-15", "4-16", "4-18", "4-19"]:
                headsign = ""
                color = "#005da7"
                img = ""
            elif line in ["4-30", "4-31", "4-32", "4-33", "4-34", "4-35", "4-36", "4-37", "4-38", "4-39", "4-40", "4-41", "4-42", "4-43", "4-44", "4-45"]:
                headsign = ""
                color = "#ee8250"
                img = ""
            elif line == "4-CITY":
                headsign = ""
                color = "#e43516"
                img = ""
            elif line in ["4-61", "4-62", "4-63", "4-64", "4-65", "4-66", "4-67", "4-68", "4-69", "4-70", "4-71", "4-72", "4-73", "4-74", "4-75"]:
                headsign = ""
                color = "#3793ac"
                img = ""
            else:
                color = "#808080"  # Default color if no match
                img = '<svg width="20px" height="20px" viewBox="0 0 1.6 1.6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet"><path d="M0.148 1.55c-0.083 0 -0.12 -0.06 -0.083 -0.133L0.733 0.105c0.038 -0.072 0.098 -0.072 0.135 0l0.667 1.313c0.038 0.072 0 0.133 -0.083 0.133z" fill="#ffce31"/><g fill="#231f20"><path d="m0.695 0.59 0.07 0.463c0.007 0.045 0.065 0.045 0.072 0l0.068 -0.463c0.013 -0.18 -0.223 -0.18 -0.21 0"/><path cx="32" cy="49.6" r="4.2" d="M0.905 1.24A0.105 0.105 0 0 1 0.8 1.345A0.105 0.105 0 0 1 0.695 1.24A0.105 0.105 0 0 1 0.905 1.24z"/></g></svg>'
            
            # Créer un dictionnaire pour stocker les informations du véhicule
            vehicle_info = {
                "id": vehicle_id,
                "latitude": latitude,
                "longitude": longitude,
                "headsign": headsign,
                "timestamp": timestamp,
                "line": line2,
                "color": color,
                "img": img
            }
            
            vehicles.append(vehicle_info)
    
    with open(history_file, "w") as f:
        json.dump(vehicles, f, indent=2)
        print(f"Bus positions saved to {history_file}")
    
    time.sleep(15)