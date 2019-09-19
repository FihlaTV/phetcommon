// Copyright 2013-2019, University of Colorado Boulder

/*
 * A bucket that can be used to store spherical objects.  Manages the addition and removal of the spheres, stacks them
 * as they are added, and manages the stack as spheres are removed.
 *
 * This expects the spheres to have certain properties, please inspect the code to understand the 'contract' between the
 * bucket and the spheres.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const Bucket = require( 'PHETCOMMON/model/Bucket' );
  const cleanArray = require( 'PHET_CORE/cleanArray' );
  const inherit = require( 'PHET_CORE/inherit' );
  const phetcommon = require( 'PHETCOMMON/phetcommon' );
  const SphereBucketIO = require( 'PHETCOMMON/model/SphereBucketIO' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );
  const Util = require( 'DOT/Util' );

  /**
   * @param {Object} options
   * @constructor
   */
  function SphereBucket( options ) {
    options = _.extend( {
      sphereRadius: 10,  // expected radius of the spheres that will be placed in this bucket
      usableWidthProportion: 1.0,  // proportion of the bucket width that the spheres can occupy
      tandem: Tandem.optional,
      phetioType: SphereBucketIO
    }, options );

    Bucket.call( this, options );

    // @private
    this.sphereBucketTandem = options.tandem;

    this._sphereRadius = options.sphereRadius;
    this._usableWidthProportion = options.usableWidthProportion;

    // Empirically determined, for positioning particles inside the bucket.
    this._verticalParticleOffset = options.verticalParticleOffset || -this._sphereRadius * 0.4;

    // particles managed by this bucket
    this._particles = [];
  }

  phetcommon.register( 'SphereBucket', SphereBucket );

  // Inherit from base type.
  inherit( Bucket, SphereBucket, {

    // @public
    addParticleFirstOpen: function( particle, animate ) {
      particle.destinationProperty.set( this.getFirstOpenLocation() );
      this.addParticle( particle, animate );
    },

    // @public
    addParticleNearestOpen: function( particle, animate ) {
      particle.destinationProperty.set( this.getNearestOpenLocation( particle.destinationProperty.get() ) );
      this.addParticle( particle, animate );
    },

    // @private
    addParticle: function( particle, animate ) {
      if ( !animate ) {
        particle.positionProperty.set( particle.destinationProperty.get() );
      }
      this._particles.push( particle );
      const self = this;

      // add a listener that will remove this particle from the bucket if the user grabs it
      const particleRemovedListener = function() {
        self.removeParticle( particle );

        // the process of removing the particle from the bucket should also disconnect removal listener
        assert && assert( !particle.bucketRemovalListener, 'listener still present after being removed from bucket' );
      };
      particle.userControlledProperty.lazyLink( particleRemovedListener );
      particle.bucketRemovalListener = particleRemovedListener; // Attach to the particle to aid unlinking in some cases.
    },

    // @public
    removeParticle: function( particle, skipLayout ) {
      assert && assert( this.containsParticle( particle ), 'attempt made to remove particle that is not in bucket' );

      // remove the particle from the array
      this._particles = _.without( this._particles, particle );

      // remove the removal listener if it is still present
      if ( particle.bucketRemovalListener ) {
        particle.userControlledProperty.unlink( particle.bucketRemovalListener );
        delete particle.bucketRemovalListener;
      }

      // redo the layout of the particles if enabled
      if ( !skipLayout ) {
        this.relayoutBucketParticles();
      }
    },

    // @public
    containsParticle: function( particle ) {
      return this._particles.indexOf( particle ) !== -1;
    },

    // @public
    extractClosestParticle: function( location ) {
      let closestParticle = null;
      this._particles.forEach( function( particle ) {
        if ( closestParticle === null ||
             closestParticle.positionProperty.get().distance( location ) > particle.positionProperty.get().distance( location ) ) {
          closestParticle = particle;
        }
      } );
      if ( closestParticle !== null ) {
        // The particle is removed by setting 'userControlled' to true.  This
        // relies on the listener that was added when the particle was placed
        // into the bucket.
        closestParticle.userControlledProperty.set( true );
      }
      return closestParticle;
    },

    // @public
    getParticleList: function() { return this._particles; },

    // @public
    reset: function() {
      this._particles.forEach( function( particle ) {
        // Remove listeners that are watching for removal from bucket.
        if ( typeof ( particle.bucketRemovalListener ) === 'function' ) {
          particle.userControlledProperty.unlink( particle.bucketRemovalListener );
          delete particle.bucketRemovalListener;
        }
      } );
      cleanArray( this._particles );
    },

    // @private
    isPositionOpen: function( position ) {
      let positionOpen = true;
      for ( let i = 0; i < this._particles.length; i++ ) {
        const particle = this._particles[ i ];
        if ( particle.destinationProperty.get().equals( position ) ) {
          positionOpen = false;
          break;
        }
      }
      return positionOpen;
    },

    // @private
    getFirstOpenLocation: function() {
      let openLocation = Vector2.ZERO;
      const usableWidth = this.size.width * this._usableWidthProportion - 2 * this._sphereRadius;
      let offsetFromBucketEdge = ( this.size.width - usableWidth ) / 2 + this._sphereRadius;
      let numParticlesInLayer = Math.floor( usableWidth / ( this._sphereRadius * 2 ) );
      let row = 0;
      let positionInLayer = 0;
      let found = false;
      while ( !found ) {
        const testLocation = new Vector2( this.position.x - this.size.width / 2 + offsetFromBucketEdge + positionInLayer * 2 * this._sphereRadius,
          this.getYPositionForLayer( row ) );
        if ( this.isPositionOpen( testLocation ) ) {
          // We found a location that is open.
          openLocation = testLocation;
          found = true;
        }
        else {
          positionInLayer++;
          if ( positionInLayer >= numParticlesInLayer ) {
            // Move to the next layer.
            row++;
            positionInLayer = 0;
            numParticlesInLayer--;
            offsetFromBucketEdge += this._sphereRadius;
            if ( numParticlesInLayer === 0 ) {
              // This algorithm doesn't handle the situation where
              // more particles are added than can be stacked into
              // a pyramid of the needed size, but so far it hasn't
              // needed to.  If this requirement changes, the
              // algorithm will need to change too.
              numParticlesInLayer = 1;
              offsetFromBucketEdge -= this._sphereRadius;
            }
          }
        }
      }
      return openLocation;
    },

    // @private
    getLayerForYPosition: function( yPosition ) {
      return Math.abs( Util.roundSymmetric( ( yPosition - ( this.position.y + this._verticalParticleOffset ) ) / ( this._sphereRadius * 2 * 0.866 ) ) );
    },

    /*
     * Get the nearest open location to the provided current location.  This is used for particle stacking.
     *
     * @param {Vector2} position
     * @returns {Vector2}
     * @private
     */
    getNearestOpenLocation: function( position ) {
      // Determine the highest occupied layer.  The bottom layer is 0.
      let highestOccupiedLayer = 0;
      const self = this;
      _.each( this._particles, function( particle ) {
        const layer = self.getLayerForYPosition( particle.destinationProperty.get().y );
        if ( layer > highestOccupiedLayer ) {
          highestOccupiedLayer = layer;
        }
      } );

      // Make a list of all open locations in the occupied layers.
      const openLocations = [];
      const usableWidth = this.size.width * this._usableWidthProportion - 2 * this._sphereRadius;
      let offsetFromBucketEdge = ( this.size.width - usableWidth ) / 2 + this._sphereRadius;
      let numParticlesInLayer = Math.floor( usableWidth / ( this._sphereRadius * 2 ) );

      // Loop, searching for open positions in the particle stack.
      for ( let layer = 0; layer <= highestOccupiedLayer + 1; layer++ ) {

        // Add all open locations in the current layer.
        for ( let positionInLayer = 0; positionInLayer < numParticlesInLayer; positionInLayer++ ) {
          const testPosition = new Vector2( this.position.x - this.size.width / 2 + offsetFromBucketEdge + positionInLayer * 2 * this._sphereRadius,
            this.getYPositionForLayer( layer ) );
          if ( this.isPositionOpen( testPosition ) ) {

            // We found a location that is unoccupied.
            if ( layer === 0 || this.countSupportingParticles( testPosition ) === 2 ) {
              // This is a valid open location.
              openLocations.push( testPosition );
            }
          }
        }

        // Adjust variables for the next layer.
        numParticlesInLayer--;
        offsetFromBucketEdge += this._sphereRadius;
        if ( numParticlesInLayer === 0 ) {
          // If the stacking pyramid is full, meaning that there are
          // no locations that are open within it, this algorithm
          // classifies the locations directly above the top of the
          // pyramid as being open.  This would result in a stack
          // of particles with a pyramid base.  So far, this hasn't
          // been a problem, but this limitation may limit
          // reusability of this algorithm.
          numParticlesInLayer = 1;
          offsetFromBucketEdge -= this._sphereRadius;
        }
      }

      // Find the closest open location to the provided current location.
      // Only the X-component is used for this determination, because if
      // the Y-component is used the particles often appear to fall sideways
      // when released above the bucket, which just looks weird.
      let closestOpenLocation = openLocations[ 0 ] || Vector2.ZERO;

      _.each( openLocations, function( location ) {
        if ( location.distance( position ) < closestOpenLocation.distance( position ) ) {
          // This location is closer.
          closestOpenLocation = location;
        }
      } );
      return closestOpenLocation;
    },

    // @private
    getYPositionForLayer: function( layer ) {
      return this.position.y + this._verticalParticleOffset + layer * this._sphereRadius * 2 * 0.866;
    },

    /*
     * Determine whether a particle is 'dangling', i.e. hanging above an open
     * space in the stack of particles.  Dangling particles should fall.
     * @private
     */
    isDangling: function( particle ) {
      const onBottomRow = particle.destinationProperty.get().y === this.position.y + this._verticalParticleOffset;
      return !onBottomRow && this.countSupportingParticles( particle.destinationProperty.get() ) < 2;
    },

    // @private
    countSupportingParticles: function( position ) {
      let count = 0;
      for ( let i = 0; i < this._particles.length; i++ ) {
        const p = this._particles[ i ];
        if ( p.destinationProperty.get().y < position.y && // Must be in a lower layer
             p.destinationProperty.get().distance( position ) < this._sphereRadius * 3 ) {
          // Must be a supporting particle.
          count++;
        }
      }
      return count;
    },

    // @private
    relayoutBucketParticles: function() {
      let particleMoved;
      do {
        for ( let i = 0; i < this._particles.length; i++ ) {
          particleMoved = false;
          const particle = this._particles[ i ];
          if ( this.isDangling( particle ) ) {
            particle.destinationProperty.set( this.getNearestOpenLocation( particle.destinationProperty.get() ) );
            particleMoved = true;
            break;
          }
        }
      } while ( particleMoved );
    }

  } );


  return SphereBucket;
} );
