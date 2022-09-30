window.onload = init;

function init() {
    const map = new ol.Map({
        view: new ol.View({
            center: [-4919944.978354636, -2269173.797406364],
            zoom: 2,
            maxZoom: 20,
            minZoom: 6,
            
        }),
        target: 'js-map'
    })

    const openStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: 'OSMStandard'
    })

    const openStreetMapHumanitarian = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: false,
        title: 'OSMHumanitarian'
    })

    const stamenTerrain = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
            attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        }),
        visible: false,
        title: 'StamenTerrain'
    })

    // Layer Group
    const baseLayerGroup = new ol.layer.Group({
        layers: [
            openStreetMapStandard, openStreetMapHumanitarian, stamenTerrain
        ]
    })

    map.addLayer(baseLayerGroup);


    // Layer Switch Lógica

    const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]')  //seleciona todos inputs da classe 
    for(let baseLayerElement of baseLayerElements){  //percorre todos os inputs da classe .sidebar
        baseLayerElement.addEventListener('change', function(){  // atribui a cada mudança de valor uma função
            let baseLayerElementValue = this.value;  // pega o valor do input que teve o valor mudado
            baseLayerGroup.getLayers().forEach(function(element, index, array){ // percorre o array de camadas
                let baseLayerTitle = element.get('title'); // atribui a nova variavel o titulo daquela camada
                element.setVisible(baseLayerTitle === baseLayerElementValue) // muda a visibilidade para 'true' se os elementos comparados forem do mesmo valor e do mesmo tipo 
            })
        })
    }

    // Vector Layers

    // Preenchimento
    var fillStyle = new ol.style.Fill({
        color: [0, 0, 0, 0]
    })

    // Linhas
    var strokeStyle = new ol.style.Stroke({
            color: [46, 45, 45, 1],
            width: 1.5
        })
    

    // Estilo dos circulos que serão os pontos
    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 7,
        stroke: strokeStyle
    })

    const EstadoGeoJSON = new ol.layer.VectorImage({
        name: 'Municipio',
        idFieldName: 'IDPK',
        descriptionFieldName: 'NOME',
        source: new ol.source.Vector({
             url: './data/municipio/minas.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'EstadoGeoJSON',
        style: new ol.style.Style({
            fill: fillStyle,
            stroke: strokeStyle,
            image: circleStyle,           
        }),
    })


    map.addLayer(EstadoGeoJSON);

    //Vector PopUp

    const overlayContainerElement = document.querySelector('.overlay-container'); //Seleciona o popup do html
    const overlayLayer = new ol.Overlay({ 
        element: overlayContainerElement
    })
    map.addOverlay(overlayLayer)
    const overlayFeatureName = document.getElementById('feature-name')

    map.on('click', function(e){   // sempe que houver um clique esse evento é chamado
        overlayLayer.setPosition(undefined),
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){ //detecta o pixel clicado e chama uma callback, se for clicado fora do recurso não haverá resposta
            let clickedCoordinate = e.coordinate;    // salva as coordenadas do clique para usar a sua posição
            let clickedFeatureName = feature.get('name');  //atribui a uma variável o campo 'name' daquele recurso
            overlayLayer.setPosition(clickedCoordinate);
            overlayFeatureName.innerHTML = clickedFeatureName //mudando o conteudo dentro dos spans
        })
    })


}