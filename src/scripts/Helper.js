var Helper = {
	random: function(min, max) {
		//random value between [min,max]
		return Math.round(Math.random() * (max-min) + min);
	},
	min: function(a, b) {
		return a < b ? a : b;
	},
	max: function(a, b) {
		return a > b ? a : b;
	}
};