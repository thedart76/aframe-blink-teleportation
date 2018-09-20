AFRAME.registerComponent('blink-teleportation', {
	schema: {
		pos: {type: 'vec3'},
		dur: {type: 'number', default: 300},
		hide: {type: 'boolean', default: false}
	},
	
	init: function () {
		var el = this.el;
		var data = this.data;
		var camera = document.querySelector('#camera');
		var cameraRig = document.querySelector('#cameraRig');
		var blinkTeleportationEls = document.querySelectorAll('[blink-teleportation]');
		var cursor = document.querySelector('a-cursor');
		
		// CREATE A TRANSPARENT BLACK IMAGE
		var blink = document.createElement('a-image');
		blink.setAttribute('material', {
			color: '#000000',
			opacity: 0
		});
		// SET THE BLACK IMAGE POSITION AND APPEND IT AS CAMERA'S CHILD ENTITY
		blink.object3D.position.z = -0.1;
		camera.appendChild(blink);
		
		// ON CLICK, ANIMATE THE BLACK IMAGE (FADE-IN)
		el.addEventListener('click', function () {
			blink.setAttribute('animation', {
				property: 'material.opacity',
				from: 0,
				to: 1,
				dur: data.dur,
				easing: 'easeOutCubic'
			});
			
			// WHEN FADE-IN ANIMATION COMPLETES, MOVE THE CAMERA RIG TO DESTINATION
			setTimeout(function () {
				cameraRig.setAttribute('position', data.pos);
				
				for (var i = 0; i < blinkTeleportationEls.length; i++) {
					// RESET THE CLICKABLE VALUE FOR ALL THE BLINK-TELEPORTATION ELEMENTS
					blinkTeleportationEls[i].setAttribute('class', 'clickable');
					// THEN MAKE ONLY THE SELECTED BLINK-TELEPORTATION ELEMENT NOT-CLICKABLE
					el.setAttribute('class', 'not-clickable');
					cursor.components.raycaster.refreshObjects();
					
					// MAKE ALL THE BLINK-TELEPORTATION ELEMENTS VISIBLE
					blinkTeleportationEls[i].setAttribute('visible', 'true');
				}
				
				// IF HIDE PROPERTY IS SET TO TRUE, HIDE THE BLINK-TELEPORTATION ELEMENT
				if (data.hide === true) {
					el.setAttribute('visible', 'false');
				}
				
				// EMIT CUSTOM EVENT TO TRIGGER THE FADE-OUT ANIMATION
				el.emit('position-changed');
			}, data.dur);
		});
		
		// ON CUSTOM EVENT, ANIMATE THE BLACK IMAGE (FADE-OUT)
		el.addEventListener('position-changed', function () {
			blink.setAttribute('animation', {
				to: 0
			});
		});
	}
});
