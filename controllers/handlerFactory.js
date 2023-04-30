const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError("Can't find document with that Id", 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //const docs = await features.query.explain();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(new AppError("Can't find document with that Id", 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOpts) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOpts) query = query.populate(popOpts);

    const doc = await query;

    if (!doc)
      return next(new AppError("Can't find document with that Id", 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOneIfOwner = (Model, idField) =>
  catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete({
      _id: id,
      [idField]: { _id: userId },
    });

    if (!doc)
      return next(
        new AppError(`Invalid ${Model.collection.collectionName} Id.`, 403)
      );

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
