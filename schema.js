const Joi = require("joi");
// const ExpressError = require("your_express_error_module_path"); // Import ExpressError module if not already imported

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
module.exports = {
    reviewSchema
};