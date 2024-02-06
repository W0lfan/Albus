# Menu
Le menu suivant vous aidera à vous repérer dans le fonctionnement des données et d'Albus.

* [Fonctionnement général d'Albus](Documentation#Fonctionnement)
* [Données](Documentation#Données)
	* [agency.json](Documentation#Données#Agency.json)
	* [calendar_dates.json](Documentation#Données#Calendar_dates.json)
	* [calendar.json](Documentation#Données#Calendar.json)
	* [routes.json](Documentation#Données#Routes.json)
	* [trips.json](Documentation#Données#Trips.json)
	* [shapes.json](Documentation#Données#Shapes.json)
	* [stop_times.json](Documentation#Données#Stop_times.json)
	* [stops.json](Documentation#Données#stops.json)
* [Conclusion des données](Documentation#Conclusion)

# Publication
Le code source de Albus est disponible [sur Github](https://github.com/W0lfan/Albus), en accès libre. Toute aide ou fix de bug est le bienvenue.

# Pour aller plus loin
### Fonctionnement
Albus se base sur un [jeu de donnée](https://fr.wikipedia.org/wiki/Jeu_de_donn%C3%A9es) complexe promulgué par la ville d'Albi, et contenant huit (8) fichiers:

| Noms | Description | 
|-------|-------------| 
| agency.json | Contient les entreprises en charge du réseau urbain du Grand Albigeois | 
| calendar_date.json | Contient les dates correspondant au type de service mis en place à tel moment de l'année |
| calendar.json | Indique les services appelés entre `x` et `y` jours de l'année, ainsi que les jours qui correspondent à l'appel du service |
| routes.json | Indique les attributs des lignes générales de bus (nom court, long, les couleurs associées, etc) ainsi que leurs informations importantes (entreprise liées, ID de ligne)  |
| shapes.json | Indique les trajets précis de chaque ligne, via des latitudes et des longitudes |
| stop_times.json | Indique les horaires d'arrêts des lignes |
| stops.json | Indique tous les arrêts des lignes, dans un sens et dans l'autre |
| trips.json | Indique les trajets de chaque ligne selon beaucoup d'arguments. `trips.json` permet d'effectuer le lien avec beaucoup de fichiers |

Chacun de ces fichiers est intrinsèquement lié, et leur construction des détaillées ci-contre.
L'application web Albus fait la lecture et la liaison de tous ces fichiers en temps réels pour obtenir les informations adéquates demandées par l'utilisateur. 
Il est cependant important de comprendre le fonctionnement des huit (8) fichiers qui composent la base de données Albus.

### Données

N.B.: 
* `s.e.` signifie `self explanatory` (signification évidente)
* `*` signifie que le sens du paramètre n'a pas encore été trouvé
#### Agency.json
`agency.json` contient toutes les agences (entreprises) en charge des lignes du réseau de bus urbains du Grand Albigeois.

```json
[{
    "agency_id": "1", // s.e.
    "agency_name": "libéA Mobilités", // s.e.
    "agency_url": "https://www.libea-mobilites.fr", // s.e.
    "agency_timezone": "Europe/Paris", // s.e.
    "agency_lang": "FR", // s.e.
    "agency_phone\r": "+33563760505\r" // s.e.
}]
```


#### Calendar_dates.json
`calendar_date.json` semble représenter les dates du calendrier de 2023 à 2024 et attribuer à chacune de ces dates une `service_id` correspondant au service associé. Il sera utile pour connaître quel service appeler à telle date.

```json
  [{
    "service_id": "2", // De 1 à 7
    "date": "20231023", // Supposément 2023-10-23, soit 23 octobre 2023
    "exception_type\r": "1\r" // *
  }]
```


#### Calendar.json
Pour tout `service_id`, allant de 1 à 7, les 7 éléments de `calendar.json` permettent de relier les lignes selon leur `service_id` pour savoir quels jours sont des jours où la ligne passe.

```json
  [{
    "service_id": "1", // c.f. calendar_date.json
    "monday": "0", // Lundi ; pas de bus
    "tuesday": "0", // Mardi ; pas de bus
    "wednesday": "0", // Mercredi ; pas de bus
    "thursday": "0", // Jeudi ; pas de bus
    "friday": "0", // Vendredi ; pas de bus
    "saturday": "1", // Samedi ; bus
    "sunday": "0", // Dimanche ; pas de bus
    "start_date": "20230909", // Début : 9 septembre 2023
    "end_date\r": "20240629\r" // Fin : 29 juin 2024
}]
```


#### Routes.json
L'ensemble des lignes de bus sont répertoriées ici et sont cruciales pour connaître l'ensemble des horaires et des trajets, notamment avec `route_id`.

```json
[{
    "route_id": "113", // s.e.
    "agency_id": "1", // s.e.
    "route_short_name": "A", // Chaque bus de ligne a cette valeur affichée
    "route_long_name": "Pélissier", // s.e.
    "route_desc": "", // Laissé vide partout
    "route_type": "3", // *
    "route_color": "00A1C7", // Couleur associée à la ligne
    "route_text_color\r": "FFFFFF\r" // Couleur de texte dépendant de route_color
}]
```



#### Trips.json
L'ensemble des trajets des lignes selon leur id (`route_id`), leur `servide_id`, 
`trips.json` dépend de `routes.json`. 

```json
[{
    "route_id": "113", // c.f. routes.json
    "service_id": "1", // c.f. calendar_dates.json
    "trip_id": "51929", // s.e.
    "trip_headsign": "Andrieu", // Arrêt initial / final
    "direction_id": "0", // 0 ou 1. Dépend de la destination du bus (point A => B ou point B => A)
    "block_id": "A-214-1", // *
    "shape_id": "15617" // Voir shapes.json
}]
```



#### Shapes.json
« Shapes » ne signifie pas « formes » mais bien itinéraire. Selon une ID, ici `15617`, en rapport à la ligne `113` (soit, `A`), on obtient une large séquence d'éléments qui donnent le trajet exact (probablement en aller-retour) de la ligne.
`shapes.json` est lié à `trips.json`;

```json
[{
    "shape_id": "15617", // c.f. trips.json
    "shape_pt_lat": "+43.943896", // s.e.
    "shape_pt_lon": "+02.144843", // s.e.
    "shape_pt_sequence\r": "1\r" // shape_pt_sequence'ème étape du trajet exact
  },
  {
    "shape_id": "15617",
    "shape_pt_lat": "+43.943620",
    "shape_pt_lon": "+02.145900",
    "shape_pt_sequence\r": "2\r"
}]
```



#### Stop_times.json
Les temps d'arrêts de chaque ligne, dépendant du trajet fait.  Les temps sont approximatifs, et le pistage en temps réel indisponible. `stop_times` sera très utile pour `stops.json`.
`stop_times.json` dépend de `trips.json`.

```json
[{
    "trip_id": "51929", // c.f. trips.json
    "arrival_time": "07:26:00", // s.e.
    "departure_time": "07:26:00", // s.e.
    "stop_id": "21170", // Utile pour stops.json
    "stop_sequence": "1", // Ordre d'arrêt. stop_sequence'ème arrêt. 
    "pickup_type": "0", // *
    "drop_off_type": "0", // *
    "shape_dist_traveled\r": "0\r" // Distance en mètres (?)
}]
```



#### Stops.json
Les arrêts de chaque ligne qui sont à trouver en dépendance de `stop_times.json`, il semblerait. Utile pour les positions des arrêts. 
`stops.json` dépend de `stop_times.json`.

```json
[{
    "stop_id": "10678", // Dépend de stop_times.json. Il semblerait que la liaison ne soit pas toujours présente
    "stop_code": "NGR", // s.e.
    "stop_name": "Nougarède", // s.e.
    "stop_desc": "", // s.e.
    "stop_lat": "+43.943963", // s.e.
    "stop_lon": "+02.144830", // s.e.
    "location_type": "1", // c.f. trips.json => destination_id
    "parent_station\r": "\r" // *
}]
```



### Conclusion
Pour conclure, on voit bien un héritage entre les différentes données. 
Libéa étant la seule entreprise s'occupant des lignes de bus du Grand Albigeois, `agency.json` se retrouve assez isolée. Elle n'est utile que pour des informations *complémentaires*.

`calendar_dates.json` a une place importante puisqu'elle *semble être* la base de toute la recherche algorithmique. En effet, la connaissance de `service_id` permet d'affiner la connaissance des jours associés au service dans `calendar.json`. 

`routes.json` possède aussi une place importante puisqu'elle initie la présence physique des lignes. `route_id` est crucial pour l'algorithme, puisqu'il permet de connaître avec précision l'ensemble des éléments de `trips.json`, qui dépendent à la fois de `routes.json` et `service_id`. 
`direction_id` reste négligeable, mais important. Il sera utile pour la précision algorithmique. 

`trips.json` précise la dépendance de `shapes.json` d'une manière rapide: `shape_id`, dans l'objectif de connaître avec précision le trajet complet du bus.
De même, `trips.json` précise la dépendance de `stop_times.json` grâce à l'usage de `trip_id`. 
`stop_sequence` se lie avec `direction_id`. 

`stop_times.json` précise la dépendance de `stops.json` grâce à l'usage de `stop_id`. 



![Frame 17](https://github.com/W0lfan/Albus/assets/69418024/69e8e2b2-1c72-4092-8bfb-55ea8d7dbe30)
