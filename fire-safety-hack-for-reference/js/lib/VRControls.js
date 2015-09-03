/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 *
 * Tweaked by Peter O'Shaughnessy.
 */

THREE.VRControls = function ( object, callback ) {

	var vrInput;

	var onVRDevices = function ( devices ) {

        console.log('VR devices', devices);

		for ( var i = 0; i < devices.length; i ++ ) {

			var device = devices[ i ];

            // XXX Peter added check for mock VR device
			if ( device instanceof PositionSensorVRDevice &&
                 device.deviceName !== 'Mockulus Rift' &&
                 device.deviceName !== 'somedevid') {

				vrInput = devices[ i ];

                console.log('Found position sensor VR device', vrInput);

                if ( callback !== undefined ) {
                    callback( true );
                }

				return; // We keep the first we encounter

			}

		}

		if ( callback !== undefined ) {

			callback( false, 'HMD not available' );

		}

	};

	if ( navigator.getVRDevices !== undefined ) {

		navigator.getVRDevices().then( onVRDevices );

	} else if ( callback !== undefined ) {

		callback( false, 'Your browser is not VR Ready' );

	}

    var once = true;

	this.update = function () {

		if ( vrInput === undefined ) {
            return;
        }

		var state = vrInput.getState();

        if( once ) {
            console.log('vr input state', state);
            once = false;
        }

		if ( state.orientation !== null ) {

			object.quaternion.copy( state.orientation );

		}

		if ( state.position !== null ) {

            var prev = object.position;

            // Peter added multiply to make position take more of an effect in our (big) scene
			//object.position.copy( state.position );
            object.position.set( state.position.x * 2, state.position.y * 2, state.position.z * 10 );

		}

	};

	this.zeroSensor = function () {

		if ( vrInput === undefined ) return;

        console.log('Zero sensor');

		vrInput.zeroSensor();

	};

};
