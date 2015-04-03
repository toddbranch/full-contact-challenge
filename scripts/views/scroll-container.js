var ScrollContainer = Backbone.View.extend({
    NUM_ROWS_TO_LOAD: 5,
    index: 0,

    className: 'scroll-container',

    events: {
        'scroll': 'scroll'
    },

    initialize: function (options) {
        if (!(this.collection instanceof Backbone.Collection)) {
            throw new Error('must be initialized with a collection');
        }

        options = options || {};

        this.CHILD_VIEW = options.childView || Backbone.View;
        this.ROWS_TO_DISPLAY = options.rowsToDisplay || 200;
        this.LOAD_THRESHOLD_PX = options.loadThresholdPx || 100;
    },

    getScrollParams: function () {
        return {
            innerHeight: this.$el.innerHeight(),
            scrollHeight: this.$el.scrollTop(),
            totalHeight: this.el.scrollHeight
        };
    },

    shouldAppend: function (totalHeight, innerHeight, scrollHeight, threshold) {
        return (totalHeight - innerHeight - scrollHeight) <= threshold;
    },

    shouldPrepend: function (scrollHeight, threshold) {
        return scrollHeight <= threshold;
    },

    adjustIndex: function (index, amount, max) {
        index += amount;

        if (index >= max) {
            index -= max;
        } else if (index < 0) {
            index += max;
        }

        return index;
    },

    scroll: function () {
        var params = this.getScrollParams();
        var height;
        var adjustment;

        if (
            this.shouldAppend(
                params.totalHeight,
                params.innerHeight,
                params.scrollHeight,
                this.LOAD_THRESHOLD_PX
            )
        ) {
            adjustment = this.NUM_ROWS_TO_LOAD;
        } else if (
            this.shouldPrepend(
                params.scrollHeight,
                this.LOAD_THRESHOLD_PX
            )
        ) {
            adjustment = -this.NUM_ROWS_TO_LOAD;
        }

        if (adjustment) {
            this.index = this.adjustIndex(
                this.index,
                adjustment,
                this.collection.length
            );
            this.render();

            height = this.childViews[0].$el.height();

            this.$el.scrollTop(params.scrollHeight - adjustment * height);
        }
    },

    getIndicesToDisplay: function (index, listLength, itemsToDisplay) {
        var result = [];

        _(itemsToDisplay).times(function (n) {
            var desiredIndex = index + n;

            if (desiredIndex < 0) {
                desiredIndex = listLength + desiredIndex;
            } else if (desiredIndex >= listLength) {
                desiredIndex = desiredIndex - listLength;
            }

            result.push(desiredIndex);
        }, this);

        return result;
    },

    render: function () {
        _.each(
            this.childViews,
            function (view) {
                view.remove();
            }
        );

        this.childViews = _.map(
            this.getIndicesToDisplay(
                this.index,
                this.collection.length,
                this.ROWS_TO_DISPLAY
            ),
            function (index) {
                return new this.CHILD_VIEW({
                    model: this.collection.at(index)
                });
            },
            this
        );

        _.each(
            this.childViews,
            function (view) {
                this.$el.append(view.render().$el);
            },
            this
        );

        return this;
    }
});
