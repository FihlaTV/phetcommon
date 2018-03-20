// Copyright 2018, University of Colorado Boulder

/**
 * Fraction tests
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Fraction = require( 'PHETCOMMON/model/Fraction' );

  QUnit.module( 'Fraction' );

  QUnit.test( 'equals', function( assert ) {
    assert.equal( new Fraction( 1, 2 ).equals( new Fraction( 1, 2 ) ), true, 'equals true' );
    assert.equal( new Fraction( 1, 2 ).equals( new Fraction( 2, 1 ) ), false, 'equals false' );
  } );

  QUnit.test( 'copy', function( assert ) {
    assert.equal( new Fraction( 1, 2 ).copy().equals( new Fraction( 1, 2 ) ), true, 'copy test' );
    assert.equal( new Fraction( 1, 2 ).copy().equals( new Fraction( 2, 1 ) ), false, 'copy test' );
  } );

  QUnit.test( 'isInteger', function( assert ) {
    assert.equal( new Fraction( 3, 1 ).isInteger(), true, 'isInteger true' );
    assert.equal( Fraction.fromInteger( 3 ).isInteger(), true, 'isInteger true' );
    assert.equal( new Fraction( 1, 2 ).isInteger(), false, 'isInteger false' );
    assert.equal( new Fraction( 3, 2 ).isInteger(), false, 'isInteger false' );
  } );

  QUnit.test( 'reduce, reduced, isReduced', function( assert ) {
    assert.equal( new Fraction( 1, 2 ).isReduced(), true, 'isReduced true' );
    assert.equal( new Fraction( -1, 2 ).isReduced(), true, 'isReduced true' );
    assert.equal( new Fraction( 1, -2 ).isReduced(), true, 'isReduced true' );
    assert.equal( new Fraction( -1, -2 ).isReduced(), true, 'isReduced true' );
    assert.equal( new Fraction( 4, 8 ).isReduced(), false, 'isReduced false' );
    assert.equal( new Fraction( 4, 8 ).reduce().isReduced(), true, 'reduce' );
    assert.equal( new Fraction( 4, 8 ).reduce().equals( new Fraction( 1, 2 ) ), true, 'reduce' );
    assert.equal( new Fraction( 4, 8 ).reduced().equals( new Fraction( 1, 2 ) ), true, 'reduced' );
  } );

  QUnit.test( 'sign', function( assert ) {
    assert.equal( new Fraction( 1, 2 ).sign === 1, true, 'sign 1' );
    assert.equal( new Fraction( 0, 2 ).sign === 0, true, 'sign 0' );
    assert.equal( new Fraction( -1, 2 ).sign === -1, true, 'sign -1' );
  } );

  QUnit.test( 'abs', function( assert ) {
    var fraction = new Fraction( 1, 2 );
    assert.equal( fraction.abs().equals( fraction ), true, 'abs test' );
    assert.equal( new Fraction( -1, 2 ).abs().equals( fraction ), true, 'abs test' );
    assert.equal( new Fraction( 1, -2 ).abs().equals( fraction ), true, 'abs test' );
    assert.equal( new Fraction( -1, -2 ).abs().equals( fraction ), true, 'abs test' );
    assert.equal( new Fraction( 2, 4 ).abs().equals( fraction ), false, 'abs test' );
  } );

  QUnit.test( 'plus', function( assert ) {
    assert.equal( new Fraction( 1, 6 ).plus( new Fraction( 2, 4 ) ).equals( new Fraction( 8, 12 ) ), true, 'plus' );
    assert.equal( new Fraction( 2, 3 ).plus( new Fraction( 1, 2 ) ).equals( new Fraction( 7, 6 ) ), true, 'plus' );
    assert.equal( new Fraction( -1, 5 ).plus( new Fraction( 3, 2 ) ).equals( new Fraction( 13, 10 ) ), true, 'plus' );
    assert.equal( new Fraction( 1, -5 ).plus( new Fraction( 3, 2 ) ).equals( new Fraction( 13, 10 ) ), true, 'plus' );
    assert.equal( new Fraction( 4, 9 ).plus( new Fraction( 2, 3 ) ).equals( new Fraction( 10, 9 ) ), true, 'plus' );
    assert.equal( new Fraction( 2, 2 ).plus( new Fraction( 4, 4 ) ).equals( new Fraction( 8, 4 ) ), true, 'plus' );
    assert.equal( new Fraction( 2, 2 ).plus( new Fraction( 4, 2 ) ).equals( new Fraction( 6, 2 ) ), true, 'plus' );
  } );

  QUnit.test( 'minus', function( assert ) {
    assert.equal( new Fraction( 1, 6 ).minus( new Fraction( 2, 4 ) ).equals( new Fraction( -4, 12 ) ), true, 'minus' );
    assert.equal( new Fraction( 2, 3 ).minus( new Fraction( 1, 2 ) ).equals( new Fraction( 1, 6 ) ), true, 'minus' );
    assert.equal( new Fraction( -1, 5 ).minus( new Fraction( 3, 2 ) ).equals( new Fraction( -17, 10 ) ), true, 'minus' );
    assert.equal( new Fraction( 1, -5 ).minus( new Fraction( 3, 2 ) ).equals( new Fraction( -17, 10 ) ), true, 'minus' );
    assert.equal( new Fraction( 4, 9 ).minus( new Fraction( 2, 3 ) ).equals( new Fraction( -2, 9 ) ), true, 'minus' );
    assert.equal( new Fraction( 2, 2 ).minus( new Fraction( 4, 4 ) ).equals( new Fraction( 0, 4 ) ), true, 'minus' );
    assert.equal( new Fraction( 2, 2 ).minus( new Fraction( 4, 2 ) ).equals( new Fraction( -2, 2 ) ), true, 'minus' );
  } );

  QUnit.test( 'times', function( assert ) {
    assert.equal( new Fraction( 1, 6 ).times( new Fraction( 2, 4 ) ).equals( new Fraction( 2, 24 ) ), true, 'times' );
    assert.equal( new Fraction( 2, 3 ).times( new Fraction( 1, 2 ) ).equals( new Fraction( 2, 6 ) ), true, 'times' );
    assert.equal( new Fraction( -1, 5 ).times( new Fraction( 3, 2 ) ).equals( new Fraction( -3, 10 ) ), true, 'times' );
    assert.equal( new Fraction( 1, -5 ).times( new Fraction( 3, 2 ) ).equals( new Fraction( 3, -10 ) ), true, 'times' );
    assert.equal( new Fraction( 4, 9 ).times( new Fraction( 2, 3 ) ).equals( new Fraction( 8, 27 ) ), true, 'times' );
    assert.equal( new Fraction( 2, 2 ).times( new Fraction( 4, 4 ) ).equals( new Fraction( 8, 8 ) ), true, 'times' );
    assert.equal( new Fraction( 2, 2 ).times( new Fraction( 4, 2 ) ).equals( new Fraction( 8, 4 ) ), true, 'times' );
  } );

  QUnit.test( 'divided', function( assert ) {
    assert.equal( new Fraction( 1, 6 ).divided( new Fraction( 2, 4 ) ).equals( new Fraction( 4, 12 ) ), true, 'divided' );
    assert.equal( new Fraction( 2, 3 ).divided( new Fraction( 1, 2 ) ).equals( new Fraction( 4, 3 ) ), true, 'divided' );
    assert.equal( new Fraction( -1, 5 ).divided( new Fraction( 3, 2 ) ).equals( new Fraction( -2, 15 ) ), true, 'divided' );
    assert.equal( new Fraction( 1, -5 ).divided( new Fraction( 3, 2 ) ).equals( new Fraction( 2, -15 ) ), true, 'divided' );
    assert.equal( new Fraction( 4, 9 ).divided( new Fraction( 2, 3 ) ).equals( new Fraction( 12, 18 ) ), true, 'divided' );
    assert.equal( new Fraction( 2, 2 ).divided( new Fraction( 4, 4 ) ).equals( new Fraction( 8, 8 ) ), true, 'divided' );
    assert.equal( new Fraction( 2, 2 ).divided( new Fraction( 4, 2 ) ).equals( new Fraction( 4, 8 ) ), true, 'divided' );
  } );

  QUnit.test( 'plusInteger', function( assert ) {
    assert.equal( new Fraction( 1, 6 ).plusInteger( 2 ).equals( new Fraction( 13, 6 ) ), true, 'plusInteger' );
    assert.equal( new Fraction( 1, 6 ).plusInteger( -2 ).equals( new Fraction( -11, 6 ) ), true, 'plusInteger' );
    assert.equal( new Fraction( -1, 6 ).plusInteger( 2 ).equals( new Fraction( 11, 6 ) ), true, 'plusInteger' );
    assert.equal( new Fraction( -1, 6 ).plusInteger( -2 ).equals( new Fraction( -13, 6 ) ), true, 'plusInteger' );
    assert.equal( new Fraction( 1, -6 ).plusInteger( 2 ).equals( new Fraction( -11, -6 ) ), true, 'plusInteger' );
    assert.equal( new Fraction( 1, -6 ).plusInteger( -2 ).equals( new Fraction( 13, -6 ) ), true, 'plusInteger' );
    assert.equal( new Fraction( -1, -6 ).plusInteger( 2 ).equals( new Fraction( -13, -6 ) ), true, 'plusInteger' );
    assert.equal( new Fraction( -1, -6 ).plusInteger( -2 ).equals( new Fraction( 11, -6 ) ), true, 'plusInteger' );
  } );

  QUnit.test( 'minusInteger', function( assert ) {
    assert.equal( new Fraction( 1, 6 ).minusInteger( 2 ).equals( new Fraction( -11, 6 ) ), true, 'minusInteger' );
    assert.equal( new Fraction( 1, 6 ).minusInteger( -2 ).equals( new Fraction( 13, 6 ) ), true, 'minusInteger' );
    assert.equal( new Fraction( -1, 6 ).minusInteger( 2 ).equals( new Fraction( -13, 6 ) ), true, 'minusInteger' );
    assert.equal( new Fraction( -1, 6 ).minusInteger( -2 ).equals( new Fraction( 11, 6 ) ), true, 'minusInteger' );
    assert.equal( new Fraction( 1, -6 ).minusInteger( 2 ).equals( new Fraction( 13, -6 ) ), true, 'minusInteger' );
    assert.equal( new Fraction( 1, -6 ).minusInteger( -2 ).equals( new Fraction( -11, -6 ) ), true, 'minusInteger' );
    assert.equal( new Fraction( -1, -6 ).minusInteger( 2 ).equals( new Fraction( 11, -6 ) ), true, 'minusInteger' );
    assert.equal( new Fraction( -1, -6 ).minusInteger( -2 ).equals( new Fraction( -13, -6 ) ), true, 'minusInteger' );
  } );

  QUnit.test( 'timesInteger', function( assert ) {
    assert.equal( new Fraction( 1, 6 ).timesInteger( 2 ).equals( new Fraction( 2, 6 ) ), true, 'timesInteger' );
    assert.equal( new Fraction( 1, 6 ).timesInteger( -2 ).equals( new Fraction( -2, 6 ) ), true, 'timesInteger' );
    assert.equal( new Fraction( -1, 6 ).timesInteger( 2 ).equals( new Fraction( -2, 6 ) ), true, 'timesInteger' );
    assert.equal( new Fraction( -1, 6 ).timesInteger( -2 ).equals( new Fraction( 2, 6 ) ), true, 'timesInteger' );
    assert.equal( new Fraction( 1, -6 ).timesInteger( 2 ).equals( new Fraction( 2, -6 ) ), true, 'timesInteger' );
    assert.equal( new Fraction( 1, -6 ).timesInteger( -2 ).equals( new Fraction( -2, -6 ) ), true, 'timesInteger' );
    assert.equal( new Fraction( -1, -6 ).timesInteger( 2 ).equals( new Fraction( -2, -6 ) ), true, 'timesInteger' );
    assert.equal( new Fraction( -1, -6 ).timesInteger( -2 ).equals( new Fraction( 2, -6 ) ), true, 'timesInteger' );
  } );

  QUnit.test( 'dividedInteger', function( assert ) {
    assert.equal( new Fraction( 1, 6 ).dividedInteger( 2 ).equals( new Fraction( 1, 12 ) ), true, 'dividedInteger' );
    assert.equal( new Fraction( 1, 6 ).dividedInteger( -2 ).equals( new Fraction( 1, -12 ) ), true, 'dividedInteger' );
    assert.equal( new Fraction( -1, 6 ).dividedInteger( 2 ).equals( new Fraction( -1, 12 ) ), true, 'dividedInteger' );
    assert.equal( new Fraction( -1, 6 ).dividedInteger( -2 ).equals( new Fraction( -1, -12 ) ), true, 'dividedInteger' );
    assert.equal( new Fraction( 1, -6 ).dividedInteger( 2 ).equals( new Fraction( 1, -12 ) ), true, 'dividedInteger' );
    assert.equal( new Fraction( 1, -6 ).dividedInteger( -2 ).equals( new Fraction( 1, 12 ) ), true, 'dividedInteger' );
    assert.equal( new Fraction( -1, -6 ).dividedInteger( 2 ).equals( new Fraction( -1, -12 ) ), true, 'dividedInteger' );
    assert.equal( new Fraction( -1, -6 ).dividedInteger( -2 ).equals( new Fraction( -1, 12 ) ), true, 'dividedInteger' );
  } );

} );