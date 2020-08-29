var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var streetSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  limit: {
    safe: {
      type: Number,
      default: 0,
    },
    warning: {
      type: Number,
      default: 0,
    },
    danger: {
      type: Number,
      default: 0,
    }
  },
  latestCondition: {
    time: {
      type: Date,
      default: Date.now()
    },
    motorcycle: {
      type: Number,
      default: 0,
    }, 
    car: {
      type: Number,
      default: 0,
    }, 
    truck: {
      type: Number,
      default: 0,
    }, 
    bus: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0
    }
  },
  latestCounting: {
    time: {
      type: Date,
      default: Date.now()
    },
    motorcycle: {
      type: Number,
      default: 0,
    }, 
    car: {
      type: Number,
      default: 0,
    }, 
    truck: {
      type: Number,
      default: 0,
    }, 
    bus: {
      type: Number,
      default: 0,
    }
  },
  conditions: [
    {
      time: {
        type: Date,
        default: Date.now()
      },
      motorcycle: {
        type: Number,
        default: 0,
      }, 
      car: {
        type: Number,
        default: 0,
      }, 
      truck: {
        type: Number,
        default: 0,
      }, 
      bus: {
        type: Number,
        default: 0,
      },
      status: {
        type: Number,
        default: 0
      }
    }
  ],
  counts: [
          {
            time: {
              type: Date,
              default: Date.now()
            },
            motorcycle: {
              type: Number,
              default: 0,
            }, 
            car: {
              type: Number,
              default: 0,
            }, 
            truck: {
              type: Number,
              default: 0,
            }, 
            bus: {
              type: Number,
              default: 0,
            },
          }
        ]
}, { collection: 'streets' });

module.exports = mongoose.model('Street', streetSchema);
