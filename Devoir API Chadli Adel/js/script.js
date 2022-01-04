
var MAP_API = {

	AVIATION_API_URL: "http://localhost:8888/API/api/airports.php",
	

	map : null,
	airports: [],
	icon: null,

	//cette fonction lance toutes les autres fonction nécessaire au projet
	initMap : function () {

		this.buildMap();
		this.fetchData();
		this.icon = {
            url: "./img/plane.svg",
            anchor: new google.maps.Point(10,20),
            scaledSize: new google.maps.Size(20,20)
        };
	},

	//cette fonction crée et centre la carte sur Paris
	buildMap : async function () {

		const paris = { lat: 48.8534, lng: 2.3488 }
		this.map = new google.maps.Map(document.getElementById("map"), {
			center: paris,
			zoom: 4,
		});

		//

		let infoWindow = new google.maps.InfoWindow();
	
		this.map.addListener("click", (mapsMouseEvent) => {

			this.createFrom({ lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng() }, 'add')

		});
	},

	//récupère toutes les données via l'API
	fetchData : function () {
		
		fetch(this.AVIATION_API_URL)
		.then(response => response.json())
		.then(response => { 
			const destination = response.airport;
			this.appendMarkerToMap(destination)
			this.appendElementToList(destination)
		}
		)
	},

	//met un marqueur pour chaque aeroport clicable (qui envoie une alerte du nom)
	appendMarkerToMap : function (destination) { 

		destination.forEach(element => {
			this.airports.push(element)
			let latitude = element.latitude
			let longitude = element.longitude
			let marker = new google.maps.Marker({
				position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
				icon: this.icon,
				map: this.map,
			})

			const infowindow = new google.maps.InfoWindow({
				content: element.name,
			});

			marker.addListener("click", () => {
				infowindow.open({
				  anchor: marker,
				  shouldFocus: false,
				});
				setTimeout(() => {
					infowindow.close()
				}, 2000)
			})
		});
	},
	
	//met les aeroports dans la liste a droite clicable (qui nous met sur l'aeroport)
	appendElementToList : function ( airport ) { 

		const list = document.getElementById('airports-list')
		airport.forEach(element => {
			const aeroport = document.createElement('li')
			aeroport.classList.add('aeroport')
			aeroport.innerText = element.name
			list.appendChild(aeroport)
			aeroport.addEventListener('click',()=> {
				const coordonne = { lat: parseFloat(element.latitude), lng: parseFloat(element.longitude) }
				this.map.setCenter(coordonne)
				this.map.setZoom(10)
			});

			this.addIcons(aeroport, element)
		});
	},

	//cette fonction crée les icons modifier et supprimer
	//airport est un aeroport présent dans la liste
	addIcons: function (airoport, element) {
		const suppr = document.createElement('img')
		suppr.setAttribute("src", "../img/delete.png")
		suppr.setAttribute("width", "20px")
		const edit = document.createElement('img')
		edit.setAttribute("src", "../img/edit.png")
		edit.setAttribute("width", "20px")
		airoport.appendChild(suppr)
		airoport.appendChild(edit)

		edit.addEventListener('click', ()=> {
			this.createFrom(element, 'edit')
		})

		suppr.addEventListener('click', ()=> {
			if (window.confirm("Supprimer l'aeroport")) {
				this.deleteAiroport(element)
			}
		})
	},

	//cette fonction permet de supprimer un aeroport selection dans la liste
	//element est un objet
	deleteAiroport: function (element){
		var initObject = { 
			method: 'DELETE',
			mode: 'cors',
			headers: new Headers(),
			body:JSON.stringify({id:element.id}),
		};
		fetch(this.AVIATION_API_URL,initObject)
		.then(() => {
			location.reload();
		})
	},

	//cette fonction crée les forms pour les edit et les delete
	//si c'est un edit la variable airport sera un objet aeroport classique avec tout les attribut
	//si c'est une nouveau aeroport l'objet airport contiendra seulement des coordonne GPS
	//mode est un string qui nous dit si c'est un edit ou un new
	createFrom: function(airport, mode) {
		console.log(airport);

		let infoWindow = new google.maps.InfoWindow();
		let requestMethod = 'POST'

		infoWindow.close();

		infoWindow = new google.maps.InfoWindow({
			position: { lat: parseFloat(airport.lat), lng: parseFloat(airport.lng) },
		});

		let formAirport = document.createElement('form')
		let requestBody = {}

		if (mode == 'add')  {
			formAirport.innerHTML = "<center> Nom de l'aéroport<input type='text'><br/> Latitude<input value='" + airport.lat + "' type='text' disabled> <br/> Longitude<input value='" + airport.lng + "' type='text' disabled> <br/><input class='valider' type ='submit' value='Valider'> </center>"
		} 
		else if (mode == 'edit') {
			formAirport.innerHTML = "<center> Nom de l'aéroport<input value='" + airport.name + "' type='text'><br/> Latitude<input value='" + airport.latitude + "' type='text'> <br/> Longitude<input value='" + airport.longitude + "' type='text'> <input value='" + airport.id + "' hidden><br/><input class='valider' type ='submit' value='Valider'> </center>"
			requestBody.id = formAirport[3].value
		}
		
		infoWindow.setContent(
			formAirport,
		);
		
		if ( mode == 'edit' ) requestMethod = 'PUT'

		formAirport.addEventListener('submit',(e) => {
			
			requestBody.name = formAirport[0].value
			requestBody.latitude = formAirport[1].value
			requestBody.longitude = formAirport[2].value
			console.log(requestBody);
			e.preventDefault()
			var initObject = { 
				method: requestMethod,
				mode: 'cors',
				body:JSON.stringify(requestBody),
			}
			fetch(this.AVIATION_API_URL,initObject)
			.then(() => {
				location.reload();
			})	
		})
		infoWindow.open(this.map);
	}
}
