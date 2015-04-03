var PugView = Backbone.View.extend({
    className: 'item',

    render: function () {
        this.$el.html('<img src="' + this.model.get('src') + '">');

        return this;
    }
});
