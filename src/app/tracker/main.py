import requests
import json
import time

url = "https://dijon.bus-tracker.fr/api/vehicles"

while True:
    # Effectuer la requête GET
    response = requests.get(url)

    # Vérifier si la requête a réussi (code 200)
    if response.status_code == 200:
        # Récupérer les données au format JSON
        data = response.json()
        
        # Liste pour stocker les informations à écrire dans le fichier JSON
        vehicles_data = []
        
        # Parcourir chaque véhicule dans la liste de données
        for vehicle in data:
            try:
                # Accès aux informations spécifiques de chaque véhicule
                vehicle_id = vehicle['vehicle']['id']
                latitude = vehicle['vehicle']['position']['latitude']
                longitude = vehicle['vehicle']['position']['longitude']
                headsign = vehicle['trip']['headsign']
                timestamp = vehicle['timestamp']
                
                # Créer un dictionnaire pour stocker les informations du véhicule
                vehicle_info = {
                    "id": vehicle_id,
                    "latitude": latitude,
                    "longitude": longitude,
                    "headsign": headsign,
                    "timestamp": timestamp
                }
                
                # Ajouter le dictionnaire à la liste des données des véhicules
                vehicles_data.append(vehicle_info)
            
            except KeyError as e:
                print(f"Clé manquante dans la structure JSON : {e}")
            except Exception as e:
                print(f"Une erreur s'est produite : {e}")
        
        # Écrire les données dans le fichier JSON
        with open("history.json", "w", encoding="utf-8") as json_file:
            json.dump(vehicles_data, json_file, indent=4)
        
        print("Données écrites avec succès dans history.json")
    
    else:
        print(f"Erreur {response.status_code} lors de la requête")
    
    # Attendre 10 secondes avant la prochaine requête
    time.sleep(10)
