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
                line = vehicle['trip']['route']

                line2 = line.replace('DIVIA:4-', '', 8)

                if line == "DIVIA:4-T1" or line == "DIVIA:4-T2":
                    color = "#ab0070"
                    img = None
                elif line == "DIVIA:4-CO":
                    color = "#00b1e6"
                    img = None
                elif line in ["DIVIA:4-L3", "DIVIA:4-L4", "DIVIA:4-L5", "DIVIA:4-L6", "DIVIA:4-L7", "DIVIA:4-L8", "DIVIA:4-L9"]:
                    color = "#e7619c"
                    img = None
                elif line in ["DIVIA:4-10", "DIVIA:4-12", "DIVIA:4-13", "DIVIA:4-14", "DIVIA:4-15", "DIVIA:4-16", "DIVIA:4-18", "DIVIA:4-19"]:
                    color = "#005da7"
                    img = None
                elif line in ["DIVIA:4-30", "DIVIA:4-31", "DIVIA:4-32", "DIVIA:4-33", "DIVIA:4-34", "DIVIA:4-35", "DIVIA:4-36", "DIVIA:4-37", "DIVIA:4-38", "DIVIA:4-39", "DIVIA:4-40", "DIVIA:4-41", "DIVIA:4-42", "DIVIA:4-43", "DIVIA:4-44", "DIVIA:4-45"]:
                    color = "#ee8250"
                    img = None
                elif line == "DIVIA:4-CITY":
                    color = "#e43516"
                    img = None
                elif line in ["DIVIA:4-61", "DIVIA:4-62", "DIVIA:4-63", "DIVIA:4-64", "DIVIA:4-65", "DIVIA:4-66", "DIVIA:4-67", "DIVIA:4-68", "DIVIA:4-69", "DIVIA:4-70", "DIVIA:4-71", "DIVIA:4-72", "DIVIA:4-73", "DIVIA:4-74", "DIVIA:4-75"]:
                    color = "#3793ac"
                    img = None
                else:
                    color = "fff"
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
    
    # Attendre 15 secondes avant la prochaine requête
    time.sleep(15)
