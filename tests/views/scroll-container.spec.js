describe('Scroll Container', function () {
    beforeEach(function () {
        var collection = new Backbone.Collection();

        _(20).times(function (n) {
            collection.add({
                text: 'item ' + n
            });
        });

        this.view = new ScrollContainer({
            collection: collection,
            rowsToDisplay: 10,
            childView: TestView
        });
    });

    describe('#initialize', function () {
        it('should throw if not initialized with a collection', function () {
            this.view.collection = null;

            expect(_.bind(function () {
                this.view.initialize();
            }, this)).toThrowError('must be initialized with a collection');
        });
    });

    describe('#render', function () {
        it('should return itself for chaining', function () {
            expect(this.view.render()).toBe(this.view);
        });

        it('should display the first \'rowsToDisplay\' elements', function () {
            this.view.render();

            expect(this.view.$el).not.toHaveText(/item 19/);
            expect(this.view.$el).toHaveText(/item 0/);
            expect(this.view.$el).toHaveText(/item 9/);
            expect(this.view.$el).not.toHaveText(/item 10/);
        });
    });

    describe('#scroll', function () {
        it('should prepend if within \'loadThresholdPx\' of top', function () {
            spyOn(this.view, 'getScrollParams').and.returnValue({
                innerHeight: 200,
                scrollHeight: 0,
                totalHeight: 1000
            });

            this.view.render();
            this.view.scroll();

            expect(this.view.$el).not.toHaveText(/item 14/);
            expect(this.view.$el).toHaveText(/item 15/);
            expect(this.view.$el).toHaveText(/item 0/);
            expect(this.view.$el).toHaveText(/item 4/);
            expect(this.view.$el).not.toHaveText(/item 9/);
        });

        it('should append if within \'loadThresholdPx\' of top', function () {
            spyOn(this.view, 'getScrollParams').and.returnValue({
                innerHeight: 200,
                scrollHeight: 800,
                totalHeight: 1000
            });

            this.view.render();
            this.view.scroll();

            expect(this.view.$el).not.toHaveText(/item 4/);
            expect(this.view.$el).toHaveText(/item 5/);
            expect(this.view.$el).toHaveText(/item 9/);
            expect(this.view.$el).toHaveText(/item 14/);
            expect(this.view.$el).not.toHaveText(/item 0/);
        });
    });

    describe('#getViewsToDisplay', function () {
        it('should return \'length\' views starting with index', function () {
            var result = this.view.getViewsToDisplay(
                0,
                5,
                this.view.collection,
                this.view.CHILD_VIEW
            );

            expect(result.length).toBe(5);
            expect(result[0].render().$el).toHaveText(/item 0/);
            expect(result[1].render().$el).toHaveText(/item 1/);
            expect(result[2].render().$el).toHaveText(/item 2/);
            expect(result[3].render().$el).toHaveText(/item 3/);
            expect(result[4].render().$el).toHaveText(/item 4/);
        });

        it('should add views from 0 when past end', function () {
            var result = this.view.getViewsToDisplay(
                18,
                5,
                this.view.collection,
                this.view.CHILD_VIEW
            );

            expect(result.length).toBe(5);
            expect(result[0].render().$el).toHaveText(/item 18/);
            expect(result[1].render().$el).toHaveText(/item 19/);
            expect(result[2].render().$el).toHaveText(/item 0/);
            expect(result[3].render().$el).toHaveText(/item 1/);
            expect(result[4].render().$el).toHaveText(/item 2/);
        });
    });

    describe('#adjustIndex', function () {
        it('should adjust the index by the specified amount', function () {
            expect(this.view.adjustIndex(0, 5, 100)).toBe(5);
        });

        it('should not allow index to go beyond max', function () {
            expect(this.view.adjustIndex(99, 5, 100)).toBe(4);
        });

        it('should not allow index to be negative', function () {
            expect(this.view.adjustIndex(0, -5, 100)).toBe(95);
        });
    });
});
