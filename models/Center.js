const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const CenterSchema = new mongoose.Schema(
  {
   centername: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },

    // phone: {
    //   type: String,
    //   maxlength: [20, "Phone number can not be longer than 20 characters"],
    // },
   
    // address: {
    //   type: String,
    //   required: [true, "Please add an address"],
    // },
    // password: {
    //   type: String,
    //   required: [true, "Please add a password"],
    //   minlength: 6,
    //   select: false
    // },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
  
    // averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create bootcamp slug from the name
CenterSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode & create location field
CenterSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address in DB
  this.address = undefined;
  next();
});

// Cascade deleted
CenterSchema.pre("remove", async function (next) {
  console.log(`Job being removed from Center ${this._id}`);
  await this.model("Job").deleteMany({ center: this._id });
  next();
});

// Reverse populate with virtuals
CenterSchema.virtual("job", {
  ref: "Job",
  localField: "_id",
  foreignField: "center",
  justOne: false,
});

module.exports = mongoose.model("Center", CenterSchema);
