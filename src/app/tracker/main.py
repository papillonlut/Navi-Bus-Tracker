from google.transit import gtfs_realtime_pb2
import requests
import time
import json

url = 'https://proxy.transport.data.gouv.fr/resource/divia-dijon-gtfs-rt-vehicle-position'

nbr = 0

feed = gtfs_realtime_pb2.FeedMessage()

response = requests.get(url)

feed.ParseFromString(response.content)

with open(f"history.json", "w") as f:
    vehicles = []
    for entity in feed.entity:
        if entity.HasField('vehicle'):
            vehicle_info = {
                'trip': {
                    'trip_id': entity.vehicle.trip.trip_id,
                    'latitude': entity.vehicle.position.latitude,
                    'longitude': entity.vehicle.position.longitude,
                    'speed': entity.vehicle.position.speed,
                    'id': entity.vehicle.vehicle.id,
                }
            }
            vehicles.append(vehicle_info)

        nbr += 1
    
    json.dump(vehicles, f, indent=2)