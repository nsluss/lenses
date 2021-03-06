var Lenses = require('../src/lenses').expose(global)
  , assert = require("assert")
  , compose = require('pointfree-fantasy').compose
  , curry = require('lodash').curry
  , Identity = require('fantasy-identities')
  ;

var add = curry(function(x, y) { return x + y; });

describe('Lenses', function() {
	describe("Object Lens", function() {
		var state = {user: {birthday: {day: 22, year: 1982}}, settings: {level: 20}}
			, L = makeLenses(['user', 'birthday', 'day', 'year', 'settings', 'level'])
			, userBirthdayYear = compose(L.user, L.birthday, L.year)
			;

	  it('returns the value from the object', function() {
			assert.equal(view(userBirthdayYear, state), 1982)
    });

    it('sets the value for the object', function() {
			assert.deepEqual(set(userBirthdayYear, 1999, state), {user: {birthday: {day: 22, year: 1999}}, settings: {level: 20}})
	  });

	  it('modifies the value of the object', function() {
			assert.deepEqual(over(userBirthdayYear, add(2), state), {user: {birthday: {day: 22, year: 1984}}, settings: {level: 20}})
	  });
	});

	describe("Array Lens", function() {
		var L = makeLenses([])

		it('alters the second element', function() {
			assert.deepEqual(over(L.num(1), add(1), [1,2,3]), [1,3,3])
		});

		it('views the third element', function() {
			assert.deepEqual(view(L.num(2), [13,12,9]), 9)
		});

		it('sets the first element', function() {
			assert.deepEqual(set(L.num(0), 10, [13,12,9]), [10,12,9]);
		});
	});

	describe("Numbered Lens", function() {
		it('allows access to numbered elements', function () {
			var state = {characters: [{level: 20}, {level: 15}, {level: 2}]}
				, L = makeLenses(['characters', 'level'])
				;
			assert.equal(view(compose(L.characters, L.num(2), L.level), state), 2);
		})
	});

	it('mapped composes and works as a map lens', function() {
		var f = over(compose(mapped, mapped, mapped), add(1))
		assert.deepEqual(f([[[2]]]), [[[3]]])
	});
	
	it('traverses like traverse', function() {
    var trav_fn = function(x) { return Identity(add(1, x)) }
    var of = Identity.of;
		var f = over(compose(traversed(of), traversed(of), traversed(of)), trav_fn)
		assert.deepEqual(f([[[2]]]), Identity([[[3]]]))
	});
});
