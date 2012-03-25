$(function() {
  var VehicleModel = Backbone.Model.extend({});

  var VehicleCollection = Backbone.Collection.extend({
    model: VehicleModel,
    url: "http://miniconfigurator.richmondday.com/v1/en/vehicles/?appid=NjY2NjY2NjY2Ng==",
    getByCACode: function(caCode) {
      for (var i = 0; i < this.models.length; i += 1) {
        var item = this.models[i]
        if(item.attributes.CACode == caCode)
          return item;
      };
    }
  });

  var Vehicles = new VehicleCollection;

  var VehicleView = Backbone.View.extend({
    template: _.template($('#item-template').html()),
    el: "<li>",

    initialize: function() {
      this.model.bind('all', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var VehicleDetailsView = Backbone.View.extend({
    template: _.template($('#details-template').html()),
    el: "<div>",
    events: {
      "click a#close": "close"
    },
    initialize: function() {
      this.render();
    },
    render: function() {
      $('#details-view').html(this.$el.html(this.template(this.model.toJSON())));
    },
    close: function() {
      this.remove();
    }
  });

  var AppView = Backbone.View.extend({
    el: "#app-container",
    statsTemplate: _.template($('#stats-template').html()),
    events: {
      "click #vehicle-list li a": "selectVehicle"
    },

    initialize: function() {
      Vehicles.bind('reset', this.addAll, this);
      Vehicles.bind('all', this.render, this);

      Vehicles.fetch({
        success:function(){
          $('#loading').hide();
        }
      });
    },

    render: function() {
      this.updateStats();
    },

    addAll: function() {
      Vehicles.each(this.addOne);
    },

    addOne: function(vehicle) {
      var view = new VehicleView({model:vehicle});
      this.$('#vehicle-list').append(view.render().el);
    },

    selectVehicle: function(e) {
      e.preventDefault();

      var vehicle = Vehicles.getByCACode(e.srcElement.id);
      var detailsView = new VehicleDetailsView({model:vehicle});
      this.updateStats();
    },

    updateStats: function() {
      $('#stats-output').html(this.statsTemplate({TotalVehicles:Vehicles.length}));
    }
  });

  var AppView = new AppView
});
