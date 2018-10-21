/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Illustrates how to load and display a Collada 3D model onto the globe.
 */
var wwd;
var currentHeatMapLayer;
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind, LayerManager) {
    "use strict";
        // Tell WorldWind to log only warnings and errors.
    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

    // Create the WorldWindow.
    wwd= new WorldWind.WorldWindow("canvasOne");
    // Create and add layers to the WorldWindow.
    var layers = [
        // Imagery layers.
        {layer: new WorldWind.BMNGLayer(), enabled: true},
        {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
        {layer: new WorldWind.BingAerialLayer(null), enabled: false},
        {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
        {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
        // Add atmosphere layer on top of all base layers.
        //{ layer: new WorldWind.AtmosphereLayer(), enabled: true },
       // { layer: new WorldWind.StarFieldLayer(), enabled: true},
        // WorldWindow UI layers.
        {layer: new WorldWind.CompassLayer(), enabled: true},
        {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
        { layer: new WorldWind.ViewControlsLayer(wwd), enabled: true }
        
    ];

    for (var l = 0; l < layers.length; l++) {
        layers[l].layer.enabled = layers[l].enabled;
        wwd.addLayer(layers[l].layer);
    }

        // Create renderable layer to hold the Collada model.
    var modelLayer = new WorldWind.RenderableLayer("Moon");
            wwd.addLayer(modelLayer);
        var renderableLayer = new WorldWind.RenderableLayer();
        wwd.addLayer(renderableLayer);

            var position = new WorldWind.Position(0, 0, 600000);
            var colladaLoader = new WorldWind.ColladaLoader(position);
        var modelAddress = "https://zglueck.github.io/workshop-demo/resources/data/satellite.dae";
        colladaLoader.load(modelAddress, function (model) {
                model.scale = 500;
                renderableLayer.addRenderable(model);
                wwd.goTo(new WorldWind.Position(0, 5, 900000));

                var lat = 0;
                var lon = 0;
                var alt = 600000;

                window.setInterval(function () {

                        lon += .01;
                        model.xRotation += .05;
                        model.position = new WorldWind.Position(lat, lon, alt);
                        wwd.redraw();
                        
                }, 10);
        });

        document.getElementById("addSatellite").onclick = function () {


            colladaLoader.load(modelAddress, function (model) {
                model.scale = 500;
                renderableLayer.addRenderable(model);
                wwd.goTo(new WorldWind.Position(0, 5, 900000));

                var lat = 0;
                var lon = 0;
                var alt = 600000;

                window.setInterval(function () {

                    lon += .01;
                    model.xRotation += .05;
                    model.position = new WorldWind.Position(lat, lon, alt);
                    wwd.redraw();

                }, 10);
            });
        };

        // Define a position for locating the model.
    position = new WorldWind.Position(0, -100, 2000e3);
        // Create a Collada loader and direct it to the desired directory and .dae file.
    var vcolladaLoader = new WorldWind.ColladaLoader(position);
    colladaLoader.init({dirPath: './collada_models/moon/'});
            colladaLoader.load('luna-1.dae', function (scene) {

            scene.scale = 50000;
            scene.xRotation = 180;
            modelLayer.addRenderable(scene); // Add the Collada model to the renderable layer within a callback.

            // timer to move object
            var lat = 0;
            var lon = -100;
            var alt = 2000e3;
            window.setInterval(function () {
                    //if (lon > 170) {
                    //        lat = 45;
                    //        lon = -100;
                    //        alt = 1000e3;
                    //}
                    lon -= .01;
                    scene.yRotation += .05;
                    scene.position = new WorldWind.Position(lat, lon, alt);

                    wwd.redraw();
            }, 10);
                    //var layerManager = new LayerManager(wwd);
            });

        document.getElementById("importHeatmapJson").onclick = function () {

            if (currentHeatMapLayer)
                wwd.removeLayer(currentHeatMapLayer);

            var data = JSON.parse(document.getElementById("setJSONTxtArea").value);

            var attributes = new WorldWind.ShapeAttributes(null);
            attributes.outlineColor = WorldWind.Color.BLUE;
            attributes.outlineWidth = 2;
            attributes.interiorColor = new WorldWind.Color(1, 1, 1, 1.0);

            var locations = [];

            for (var i = 0; i < data.length; i++) {

                var lat = parseFloat(data[i].reclat);
                var long = parseFloat(data[i].reclong);
                var mass = parseInt(data[i].mass, 10);
                var x;
                if (lat && long && mass && lat >= -180 && lat <= 180 && long >= -180 && long <= 180) {
                    if (mass > 10000) {
                       x = new WorldWind.MeasuredLocation(lat, long, 10000);
                    }
                    else {
                       x = new WorldWind.MeasuredLocation(lat, long, mass);
                    }
                    locations.push(x);
                }




            }

            currentHeatMapLayer = new WorldWind.HeatMapLayer("HeatMap", locations);

            wwd.addLayer(currentHeatMapLayer);
                           // var layerManager = new LayerManager(wwd);

        };
           // var wwd = new WorldWind.WorldWindow('canvasOne');

            // Create imagery layers.
            var BMNGOneImageLayer = new WorldWind.BMNGOneImageLayer();
            var BMNGLayer = new WorldWind.BMNGLayer();
            wwd.addLayer(BMNGOneImageLayer);
            wwd.addLayer(BMNGLayer);

            // Use the StarField layer to show stars and the Sun around the globe, and the Atmosphere layer to display
            // the atmosphere effect and the night side of the Earth.
            // Note that the StarField layer requires a dark canvas background color.
            // The StarField layer should be added before the Atmosphere layer.
            var starFieldLayer = new WorldWind.StarFieldLayer();
            var atmosphereLayer = new WorldWind.AtmosphereLayer();
            wwd.addLayer(starFieldLayer);
            wwd.addLayer(atmosphereLayer);

            // Set a date property for the StarField and Atmosphere layers to the current date and time.
            // This enables the Atmosphere layer to show a night side (and dusk/dawn effects in Earth's terminator).
            // The StarField layer positions its stars according to this date.
            var now = new Date();
            starFieldLayer.time = now;
            atmosphereLayer.time = now;

            // In this example, each full day/night cycle lasts 8 seconds in real time.
            var simulatedMillisPerDay = 8000;

            // Begin the simulation at the current time as provided by the browser.
            var startTimeMillis = Date.now();

            function runSimulation() {
                    // Compute the number of simulated days (or fractions of a day) since the simulation began.
                    var elapsedTimeMillis = Date.now() - startTimeMillis;
                    var simulatedDays = elapsedTimeMillis / simulatedMillisPerDay;

                    // Compute a real date in the future given the simulated number of days.
                    var millisPerDay = 24 * 3600 * 1000; // 24 hours/day * 3600 seconds/hour * 1000 milliseconds/second
                    var simulatedMillis = simulatedDays * millisPerDay;
                    var simulatedDate = new Date(startTimeMillis + simulatedMillis);

                    // Update the date in both the Starfield and the Atmosphere layers.
                    starFieldLayer.time = simulatedDate;
                    atmosphereLayer.time = simulatedDate;
                    wwd.redraw(); // Update the WorldWindow scene.

                    requestAnimationFrame(runSimulation);
            }

            // Animate the starry sky as well as the globe's day/night cycle.
            requestAnimationFrame(runSimulation);

            // Create a layer manager for controlling layer visibility.
            var layerManager = new LayerManager(wwd);
    // Create a layer manager for controlling layer visibility.
    //var layerManager = new LayerManager(wwd);
});
