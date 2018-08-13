AFRAME.registerComponent('blink-teleportation', {
	schema: {
		pos: {type: 'vec3'},
		dur: {type: 'number', default: 300},
		hide: {type: 'boolean', default: false}
	},
	
	init: function () {
		var el = this.el;
		var data = this.data;
		var camera = document.querySelector('a-camera');
		var cursor = document.querySelector('a-cursor');
		var cameraRig = document.querySelector('#cameraRig');
		var blinkTeleportationEl = document.querySelectorAll('[blink-teleportation]');
		
		// CREATE A TRANSPARENT BLACK IMAGE
		var blink = document.createElement('a-image');
		blink.setAttribute('material', {
			color: '#000000',
			opacity: 0
		});
		
		// SET THE BLACK IMAGE POSITION AND APPEND IT AS CAMERA'S CHILD ENTITY
		blink.object3D.position.z = -0.1;
		camera.appendChild(blink);
		
		// ON CLICK, ANIMATE THE BLACK IMAGE (FADE IN)
		el.addEventListener('click', function () {
			blink.setAttribute('animation', {
				property: 'material.opacity',
				from: 0,
				to: 1,
				dur: data.dur,
				easing: 'easeOutCubic'
			});
			
			// WHEN FADE IN ANIMATION COMPLETES, MOVE THE CAMERA RIG TO THE SELECTED LOCATION
			setTimeout(function () {
				cameraRig.setAttribute('position', data.pos);
				
				// RESET VISIBLE AND CLASS VALUES FOR ALL THE BLINK-TELEPORTATION ELEMENTS
				for (var i = 0; i < blinkTeleportationEl.length; i++) {
					blinkTeleportationEl[i].setAttribute('visible', 'true');
					blinkTeleportationEl[i].setAttribute('class', 'clickable');
					// THEN MAKE ONLY THE SELECTED BLINK-TELEPORTATION ELEMENT NOT-CLICKABLE
					el.setAttribute('class', 'not-clickable');
					cursor.components.raycaster.refreshObjects();
				}
				
				// IF HIDE PROPERTY IS SET TO TRUE, HIDE ONLY THE SELECTED BILNK-TELEPORTATION ELEMENT
				if (data.hide === true) {
					el.setAttribute('visible', 'false');
				}
				
				// EMIT CUSTOM EVENT TO TRIGGER THE FADE OUT ANIMATION
				el.emit('position-changed');	
			}, data.dur);
		});
		
		// ON CUSTOM EVENT, ANIMATE THE BLACK IMAGE (FADE OUT)
		el.addEventListener('position-changed', function () {
			blink.setAttribute('animation', {
				to: 0
			});
		});
	}
});