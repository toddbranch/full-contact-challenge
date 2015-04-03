var TestView = Backbone.View.extend({
    className: 'item',

    render: function () {
        this.$el.html(this.model.get('text'));

        return this;
    }
});
