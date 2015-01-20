"use strict";

/* 
 * This is a small library the will help import from older version
 * of Diagramo
 */

var Importer = {};


/**Contains description of all versions an main changes they brought to Diagramo
 * file format*/
Importer.fileVersions = {
    1: "This version did not have any version number. \n\
        Originally used on Diagramo.com\n\
        File extension named .dia",
    
    2: "This version did not have any version number.\n\
        Originally used on version 2.3beta\n\
        ",
    
    3: "Started to be used beginning with version 2.3 final",

    4: "Started to be used beginning with version 2.4 final"
};

/**Import previous Diagramo file format.
 * @param {JSONObject} o - the old version file JSON object
 * @returns {JSONObject} the new JSON version
 * Warning: It does modify the original {JSONObject}
 * */
Importer.importDiagram = function(o){
    if( !('v' in o) ){
        this.patch3(o);
    }
    
    /*As now we should have the o.v present
    we will allow bigger patches than 3 to be applied*/
    
    //apply all patches until the fileVersion reaches latest version
    for(var i = o.v + 1; i <= DIAGRAMO.fileVersion; i++){
        try{
            this['patch' + i](o);       
        } catch(error){
            Log.error("Importer.importDiagram exception: " + error);
//            alert("Importer.importDiagram exception: " + error);
        }
    }
    
    return o;
};

/**
 * Apply patch no. 3 to file structure
 * @param {JSONObject} o - the old version file JSON object
 * @returns {JSONObject} the new JSON version
 * Warning: It does modify the original {JSONObject}
 * */
Importer.patch3 = function(o){
    //initially we did not have Containers    
    if('s' in o){ // 's' stands for Stack
        var jsonStack = o.s;
        
        //If not containers array present
        if( !('containers' in jsonStack) ){
            jsonStack.containers = []; //add an empty container array
        }                        
        
        if( 'figures' in jsonStack ){   // replace deprecated property value with new one
            var deprecatedPropertyValue = 'textSize';
            var deprecatedReplacer = 'size';
            var figures = jsonStack.figures;
            var figureLength = figures.length;
            for (var i = 0; i < figureLength; i++) {

                // define Figure::url field if not defined
                if (typeof(figures[i].url) === 'undefined') {
                    figures[i].url = '';
                }

                var properties = figures[i].properties;

                // URL property may absent
                var urlProperty = new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL);

                // flag to mark if URL property is defined
                var urlPropertyDefined = false;

                var propertiesLength = properties.length;
                for (var j = 0; j < propertiesLength; j++) {
                    if (properties[j].property && properties[j].property.indexOf(deprecatedPropertyValue) != -1) {
                        properties[j].property = properties[j].property.replace(deprecatedPropertyValue, deprecatedReplacer);
                    }

                    // check if current property is URL property
                    if (urlProperty.equals(properties[j])) {
                        urlPropertyDefined = true;
                    }
                }

                // add property that is not defined
                if (!urlPropertyDefined) {
                    properties.push(urlProperty);
                }
            }
        }
    }
    
    if( !('p' in o) ){ // 'p' stands for ContainerFigureManager
        o.p = new ContainerFigureManager() ; //empty ContainerFigureManager
    }

    if( 'm' in o ){ // 'm' stands for ConnectorManager
        var jsonConnectorManager = o.m;
        if ( 'connectors' in jsonConnectorManager ) {
            // properties that may absent
            var lineStyleProperty = new BuilderProperty('Line Style','style.lineStyle', BuilderProperty.TYPE_LINE_STYLE);
            var textSizeProperty = new BuilderProperty('Text Size', 'middleText.size', BuilderProperty.TYPE_TEXT_FONT_SIZE);
            var fontProperty = new BuilderProperty('Font', 'middleText.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY);
            var textAlignProperty = new BuilderProperty('Alignment', 'middleText.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT);
            var textColorProperty = new BuilderProperty('Text Color', 'middleText.style.fillStyle', BuilderProperty.TYPE_COLOR);

            // flags to mark if properties are defined
            var lineStylePropertyDefined;
            var textSizePropertyDefined;
            var fontPropertyDefined;
            var textAlignPropertyDefined;
            var textColorPropertyDefined;

            var connectors = jsonConnectorManager.connectors;
            var connectorLength = connectors.length;
            for (var i = 0; i < connectorLength; i++) {
                // old version has fillStyle undefined
                if (!connectors[i].middleText.style.fillStyle) {
                    connectors[i].middleText.style.fillStyle = connector_defaultConnectorTextFillStyle;
                }

                lineStylePropertyDefined = false;
                textSizePropertyDefined = false;
                fontPropertyDefined = false;
                textAlignPropertyDefined = false;
                textColorPropertyDefined = false;

                var properties = connectors[i].properties;
                var propertiesLength = properties.length;
                for (var j = 0; j < propertiesLength; j++) {
                    if (lineStyleProperty.equals(properties[j])) {
                        lineStylePropertyDefined = true;
                    }
                    if (textSizeProperty.equals(properties[j])) {
                        textSizePropertyDefined = true;
                    }
                    if (fontProperty.equals(properties[j])) {
                        fontPropertyDefined = true;
                    }
                    if (textAlignProperty.equals(properties[j])) {
                        textAlignPropertyDefined = true;
                    }
                    if (textColorProperty.equals(properties[j])) {
                        textColorPropertyDefined = true;
                    }
                }

                // add properties that are not defined
                if (!lineStylePropertyDefined) {
                    properties.push(lineStyleProperty);
                }
                if (!textSizePropertyDefined) {
                    properties.push(textSizeProperty);
                }
                if (!fontPropertyDefined) {
                    properties.push(fontProperty);
                }
                if (!textAlignPropertyDefined) {
                    properties.push(textAlignProperty);
                }
                if (!textColorPropertyDefined) {
                    properties.push(textColorProperty);
                }
            }
        }
    }
    
    o.v = 3;
    
    return o;
};


/**
 * Apply patch no. 4 to file structure
 * @param {JSONObject} o - the old version file JSON object
 * @returns {JSONObject} the new JSON version
 * Warning: It does modify the original {JSONObject}
 * */
Importer.patch4 = function(o){
    o.v = 4;

    /**
     * Adds support for text underline feature
     * @param {JSONObject} o - the old version file JSON object
     * Warning: It does modify the original {JSONObject}
     * Details:
     *  - Set Text::underlined to false (only Figures, Containers - in primitives and Connectors - in middleText field have it)
     *  - Add text underlined property to all objects with Text primitives (only Figures, Containers - in primitives and Connectors - in middleText field have it)
     * */
    function addTextUnderline(o){
        if('s' in o){ // 's' stands for Stack
            var jsonStack = o.s;

            // go through containers
            for (var i = 0; i < jsonStack.containers.length; i++) {
                var currentContainer = jsonStack.containers[i];

                // go through primitives of container
                var primitives = currentContainer.primitives;
                for (var j = 0; j < primitives.length; j++) {
                    var currentPrimitive = primitives[j];

                    // search for Text instances in primitives
                    if (currentPrimitive.oType === "Text") {
                        currentPrimitive.underlined = false;
                        // if primitive with j index is Text - than it's text underlined property is
                        var textUnderlinedProperty = new BuilderProperty('Text Underlined', 'primitives.' + j + '.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED);
                        currentContainer.properties.push(textUnderlinedProperty);
                    }
                }
            }

            // go through figures
            for (var i = 0; i < jsonStack.figures.length; i++) {
                var currentFigure = jsonStack.figures[i];

                // Text used only in primitives
                var primitives = currentFigure.primitives;
                for (var j = 0; j < primitives.length; j++) {
                    var currentPrimitive = primitives[j];

                    // search for Text instances in primitives
                    if (currentPrimitive.oType === "Text") {
                        currentPrimitive.underlined = false;
                        // if primitive with j index is Text - than it's text underlined property is
                        var textUnderlinedProperty = new BuilderProperty('Text Underlined', 'primitives.' + j + '.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED);
                        currentFigure.properties.push(textUnderlinedProperty);
                    }
                }
            }
        }

        if( 'm' in o ){ // 'm' stands for ConnectorManager
            var jsonConnectorManager = o.m;

            // define typical text underlined property
            var textUnderlinedProperty = new BuilderProperty('Text Underlined', 'middleText.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED);

            // go through connectors
            for (var i = 0; i < jsonConnectorManager.connectors.length; i++) {
                var currentConnector = jsonConnectorManager.connectors[i];

                // Text used as middleText property
                currentConnector.middleText.underlined = false;
                currentConnector.properties.push(textUnderlinedProperty);
            }
        }
    }


    /**
     * Updates style of Style instance
     * @param {Style} style - Style instance to update
     * */
    function updateStyleInstance(style){
        // old version  has Style::lineStyle, Style::gradientBounds and Style::colorStops undefined
        style.lineStyle = null;
        style.gradientBounds = [];
        style.colorStops = [];
    }


    /**
     * Updates style of figure's primitive
     * @param {Primitive} primitive - primitive instance to update style
     * */
    function updateStyleOfFigurePrimitive(primitive){
        // go through points of primitive if it's defined
        var nestedPrimitives = primitive.points /* for: Polyline, Polygon, etc*/
            || primitive.vector /*for: ImageFrame, Text, etc*/
            || primitive.primitives /*for: Path*/
            || primitive.lines /*for: DashedArc*/
            || primitive.curves /*for: Arc*/;
        if (nestedPrimitives) {
            for (var k = 0; k < nestedPrimitives.length; k++) {
                // update style of nested primitive
                updateStyleOfFigurePrimitive(nestedPrimitives[k]);
            }
        }

        // go through fragments of NURBS if it's defined
        nestedPrimitives = primitive.fragments;
        if (nestedPrimitives) {
            for (var k = 0; k < nestedPrimitives.length; k++) {
                // update style of nested primitive
                updateStyleOfFigurePrimitive(nestedPrimitives[k]);
            }
        }


        // Ellipse primitive has topLeftCurve point
        if (primitive.topLeftCurve) {
            // update style of topLeftCurve primitive
            updateStyleOfFigurePrimitive(primitive.topLeftCurve);
        }

        // Ellipse primitive has topRightCurve point
        if (primitive.topRightCurve) {
            // update style of topRightCurve primitive
            updateStyleOfFigurePrimitive(primitive.topRightCurve);
        }

        // Ellipse primitive has bottomRightCurve point
        if (primitive.bottomRightCurve) {
            // update style of bottomRightCurve primitive
            updateStyleOfFigurePrimitive(primitive.bottomRightCurve);
        }

        // Ellipse primitive has bottomLeftCurve point
        if (primitive.bottomLeftCurve) {
            // update style of bottomLeftCurve primitive
            updateStyleOfFigurePrimitive(primitive.bottomLeftCurve);
        }

        // Ellipse primitive has centerPoint point
        if (primitive.centerPoint) {
            // update style of centerPoint primitive
            updateStyleOfFigurePrimitive(primitive.centerPoint);
        }

        // Arc primitive has middle point
        if (primitive.middle) {
            // update style of middlePoint primitive
            updateStyleOfFigurePrimitive(primitive.middle);
        }

        // DashedArc primitive has arc
        if (primitive.arc) {
            // update style of arc primitive
            updateStyleOfFigurePrimitive(primitive.arc);
        }

        // Curve primitive has startPoint point
        if (primitive.startPoint) {
            // update style of startPoint primitive
            updateStyleOfFigurePrimitive(primitive.startPoint);
        }

        // Curve primitive has controlPoint point
        if (primitive.controlPoint) {
            // update style of controlPoint primitive
            updateStyleOfFigurePrimitive(primitive.controlPoint);
        }

        // CubicCurve primitive has controlPoint1 point
        if (primitive.controlPoint1) {
            // update style of controlPoint1 primitive
            updateStyleOfFigurePrimitive(primitive.controlPoint1);
        }

        // CubicCurve primitive has controlPoint2 point
        if (primitive.controlPoint2) {
            // update style of controlPoint2 primitive
            updateStyleOfFigurePrimitive(primitive.controlPoint2);
        }

        // Curve primitive has endPoint point
        if (primitive.endPoint) {
            // update style of endPoint primitive
            updateStyleOfFigurePrimitive(primitive.endPoint);
        }

        // update style of primitive
        updateStyleInstance(primitive.style);
    }


    /**
     * Adds support for gradient as a fill color and line style feature
     * @param {JSONObject} o - the old version file JSON object
     * Warning: It does modify the original {JSONObject}
     * Details:
     *  - Add to all Style instances field Style::lineStyle and initialize them as null
     *  - Add to all Style instances fields Style::gradientBounds and Style::colorStops
     *  - Initialize Style::gradientBounds and Style::colorStops fields as an empty arrays
     * */
    function updateStyle(o){
        if('s' in o){ // 's' stands for Stack
            var jsonStack = o.s;

            // go through containers
            for (var i = 0; i < jsonStack.containers.length; i++) {
                var currentContainer = jsonStack.containers[i];

                // update style of container
                updateStyleInstance(currentContainer.style);

                // go through primitives of container
                var primitives = currentContainer.primitives;
                for (var j = 0; j < primitives.length; j++) {
                    // update style of container's primitive
                    updateStyleOfFigurePrimitive(primitives[j]);
                }

                // update style of topLeft primitive
                updateStyleOfFigurePrimitive(currentContainer.topLeft);

                // update style of bottomRight primitive
                updateStyleOfFigurePrimitive(currentContainer.bottomRight);
            }

            // go through figures
            for (var i = 0; i < jsonStack.figures.length; i++) {
                var currentFigure = jsonStack.figures[i];

                // update style of figure
                updateStyleInstance(currentFigure.style);

                // go through primitives of figure
                var primitives = currentFigure.primitives;
                for (var j = 0; j < primitives.length; j++) {
                    // update style of container's primitive
                    updateStyleOfFigurePrimitive(primitives[j]);
                }


                // go through rotation coordinates of figure
                var rotationCoords = currentFigure.rotationCoords /*for: Figure, Group, etc*/;
                for (var j = 0; j < rotationCoords.length; j++) {
                    // update style of figure's rotationCoord
                    updateStyleInstance(rotationCoords[j].style);
                }
            }
        }

        if( 'm' in o ){ // 'm' stands for ConnectorManager
            var jsonConnectorManager = o.m;

            // go through connectors
            for (var i = 0; i < jsonConnectorManager.connectors.length; i++) {
                var currentConnector = jsonConnectorManager.connectors[i];

                // update style of connector
                updateStyleInstance(currentConnector.style);

                // go through turning points of connector
                var turningPoints = currentConnector.turningPoints;
                for (var j = 0; j < turningPoints.length; j++) {
                    // update style of turningPoint
                    updateStyleInstance(turningPoints[j].style);
                }

                // check if Connector has middleText
                if (currentConnector.middleText) {
                    // update style of middleText primitive
                    updateStyleOfFigurePrimitive(currentConnector.middleText);
                }
            }

            // go through connection points
            for (var i = 0; i < jsonConnectorManager.connectionPoints.length; i++) {
                // update style of connectionPoint
                updateStyleInstance(jsonConnectorManager.connectionPoints[i].point.style);
            }
        }
    }

    /** call functions to add support for a new features of release version 4:
     * - Text underline
     * - Update Style:
     *      - Gradient as a fill color
     *      - Line Style
    */
    addTextUnderline(o);
    updateStyle(o);

    return o;
};
