var collection = new Backbone.Collection(
    images
);

var container = new ScrollContainer({
    collection: collection,
    childView: PugView
});

$('body').append(container.render().el);

container.$el.scroll();
