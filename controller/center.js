const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Center = require("../models/Center");

// @desc      Get all vendors
// @route     GET /api/v1/vendors
// @access    Public
exports.getCenters = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single vendor
// @route     GET /api/v1/vendors/:vendorId
// @access    Public
exports.getCenter = asyncHandler(async (req, res, next) => {
  const vendor = await Center.findById(req.params.centerId);

  if (!center) {
    return next(
      new ErrorResponse(
        `center not found with id of ${req.params.centerId}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: center });
});

// @desc      Create new vendor
// @route     POST /api/v1/vendors
// @access    Private
exports.createCenter = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published vendor
  const publishedcenter = await Center.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one vendor
  if (publishedcenter && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already  a center`,
        400
      )
    );
  }

  const center = await Center.create(req.body);

  res.status(201).json({
    success: true,
    data: center,
  });
});

// @desc      Update vendor
// @route     PUT /api/v1/vendor/:vendorId
// @access    Private
exports.updateCenter = asyncHandler(async (req, res, next) => {
  let center= await Center.findById(req.params.centerId);

  if (!center) {
    return next(
      new ErrorResponse(
        `center not found with id of ${req.params.centerId}`,
        404
      )
    );
  }

  // Make sure user is vendor owner
  if (center.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.centerId} is not authorized to update this vendor`,
        401
      )
    );
  }

  center = await Center.findByIdAndUpdate(req.params.centerId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: center });
});

// @desc      Delete vendor
// @route     DELETE /api/v1/vendor/:vendorId
// @access    Private
exports.deleteCenter = asyncHandler(async (req, res, next) => {
  const center = await Vendor.findById(req.params.centerId);

  if (!center) {
    return next(
      new ErrorResponse(
        `center not found with id of ${req.params.centerId}`,
        404
      )
    );
  }

  // Make sure user is vendor owner
  if (center.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.centerId} is not authorized to delete this vendor`,
        401
      )
    );
  }

  center.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Upload photo for vendor
// @route     PUT /api/v1/vendor/:vendorId/photo
// @access    Private
exports.centersPhotoUpload = asyncHandler(async (req, res, next) => {
  const center = await Center.findById(req.params.centerId);

  if (!center) {
    return next(
      new ErrorResponse(
        `Vendor not found with id of ${req.params.centerId}`,
        404
      )
    );
  }

  // Make sure user is vendor owner
  if (center.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.centerId} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${center._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Center.findByIdAndUpdate(req.params.CenterId, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
