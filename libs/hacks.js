export function fixKoaContext(ctx) {
	var previousAssert = ctx.assert;
	ctx.assert = function() {
		previousAssert.apply(this, arguments);
		return this;
	};
	ctx.defaultArgs = function(defaults = new Object()) {
		this._args = Object.assign(new Object(), defaults);	// copy
		Object.assign(this._args, this.params, this.query, this.request.body);
		return this;
	};
	Object.defineProperty(ctx, "args", {
		configurable: true,
		get: function() {
			if (this._args === undefined) {
				this._args = Object.assign(new Object(), this.params,
				                           this.query, this.request.body);
			}
			return this._args;
		}
	});
}
