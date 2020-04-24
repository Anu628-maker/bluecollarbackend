const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const JobSchema = new mongoose.Schema(
  {
    Centername: {
      type: String,
      required: [true, "Please add a name"],
      maxlength: [50, "Name can not be more than 50 characters"]
    },
    CenterManagername: {
      type: String,
      required: [true, "Please add a name"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    candidatename: {
      type: String,
      required: [true, "Please add  name"],
    },
    candidateaadhar: {
      type: String,
      maxlength: [12, "aadhar number can not be longer than 12 characters"]
    },
    age: {
      type: String,
      required: [true, "Please add a number"],
    },
     category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Please add a category"],
    },
    slug: String,
    gender: {
        type: String,
        required: [true, "Please add a gender"],
        
      },
      experience: {
        type: String,
        required: [true, "Please add your experience"],
      },
      salaryday: {
        type: String,
        required: [true, "Please add your salary"],
      },
     
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
  // fundriserSchema.pre("save", function (next) {
  //   this.slug = slugify(this.name, { lower: true });
  //   next();
  //});
  
  // Geocode & create location field
  // FundriserSchema.pre("save", async function (next) {
  //   const loc = await geocoder.geocode(this.address);
  //   this.location = {
  //     type: "Point",
  //     coordinates: [loc[0].longitude, loc[0].latitude],
  //     formattedAddress: loc[0].formattedAddress,
  //     street: loc[0].streetName,
  //     city: loc[0].city,
  //     state: loc[0].stateCode,
  //     zipcode: loc[0].zipcode,
  //     country: loc[0].countryCode,
  //   };
  
    // Do not save address in DB
  //   this.address = undefined;
  //   next();
  // });
  
  // Cascade deleted
  // FundriserSchema.pre("remove", async function (next) {
  //   console.log(`Product being removed from Vendor ${this._id}`);
  //   await this.model("Products").deleteMany({ vendor: this._id });
  //   next();
  // });
  
  // Reverse populate with virtuals
  
  

          module.exports = mongoose.model("Job", JobSchema);