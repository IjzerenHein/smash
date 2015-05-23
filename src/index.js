'use strict';

// Famous dependencies
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
//var HeaderFooterView = require('./HeaderFooterView');
var HeaderFooterLayout = require('./layouts/HeaderFooterLayout');
var LayoutController = require('./LayoutController');

// Boilerplate code to make your life easier
FamousEngine.init();

// Initialize with a scene; then, add a 'node' to the scene root
var scene = FamousEngine.createScene();

/*var hf = new HeaderFooterLayout();
scene.addChild(hf);
var headerEl = new DOMElement(hf.header)
    .setProperty('background', 'blue');
var footerEl = new DOMElement(hf.footer)
    .setProperty('background', 'blue');
var logoNode = hf.content.addChild();*/

var nodes = LayoutController.createDataSource({});
new DOMElement(nodes.set('header'))
    .setProperty('background', 'blue');
new DOMElement(nodes.set('footer'))
    .setProperty('background', 'blue');
var logoNode = nodes.set('content').addChild();

var lc = new LayoutController({
    layout: HeaderFooterLayout,
    layoutOptions: {
        headerSize: 50,
        footerSize: 50
    },
    dataSource: nodes
});
scene.addChild(lc);

/*var nodes = {
    header: scene.addChild(),
    content: scene.addChild(),
    footer: scene.addChild()
};
new DOMElement(nodes.header)
    .setProperty('background', 'blue');
new DOMElement(nodes.footer)
    .setProperty('background', 'blue');
var logoNode = nodes.content.addChild();

scene.addComponent({
    onSizeChange: function(size) {
        headerFooterLayout(nodes, size, {
            headerSize: 50,
            footerSize: 50
        });
    }
});*/


// Create an [image] DOM element providing the logo 'node' with the 'src' path
new DOMElement(logoNode, { tagName: 'img' })
    .setAttribute('src', './images/famous_logo.png');

// Chainable API
logoNode
    // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
    .setSizeMode('relative', 'relative', 'absolute')
    .setAbsoluteSize(250, 250)
    // Center the 'node' to the parent (the screen, in this instance)
    .setAlign(0.5, 0.5)
    // Set the translational origin to the center of the 'node'
    .setMountPoint(0.5, 0.5)
    // Set the rotational origin to the center of the 'node'
    .setOrigin(0.5, 0.5);

// Add a spinner component to the logo 'node' that is called, every frame
var spinner = logoNode.addComponent({
    onUpdate: function(time) {
        logoNode.setRotation(0, time / 1000, 0);
        logoNode.requestUpdateOnNextTick(spinner);
    }
});

// Let the magic begin...
logoNode.requestUpdate(spinner);