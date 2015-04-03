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

        it('should display the first \'maxRow\' elements', function () {
            this.view.render();

            expect(this.view.$el).not.toHaveText(/item 19/);
            expect(this.view.$el).toHaveText(/item 0/);
            expect(this.view.$el).toHaveText(/item 9/);
            expect(this.view.$el).not.toHaveText(/item 10/);
        });
    });

    describe('#scroll', function () {
        it('should prepend items if within \'loadThreshold\' of top', function () {
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

        it('should append items if within \'loadThreshold\' of top', function () {
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

    describe('#getIndicesToDisplay', function () {
        it('should return \'itemsToDisplay\' indices starting with index', function () {
            var result = this.view.getIndicesToDisplay(0, 100, 5);
            expect(result).toEqual([0, 1, 2, 3, 4]);
        });

        it('should add indices from 0 when past end', function () {
            var result = this.view.getIndicesToDisplay(98, 100, 5);
            expect(result).toEqual([98, 99, 0, 1, 2]);
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
