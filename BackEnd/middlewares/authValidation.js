import joi from "joi";

const signupValidation = (req, res, next) => {
    const schema = joi.object({
        userName: joi.string().min(3).max(30).required().messages({
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username cannot exceed 30 characters",
            "any.required": "Username is required"
        }),
        email: joi.string().email().required().messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required"
        }),
        password: joi.string().min(4).max(30).required().messages({
            "string.min": "Password must be at least 4 characters",
            "string.max": "Password cannot exceed 30 characters",
            "any.required": "Password is required"
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0]?.message || "Invalid credentials",
            success: false
        });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required"
        }),
        password: joi.string().min(4).max(30).required().messages({
            "string.min": "Password must be at least 4 characters",
            "any.required": "Password is required"
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0]?.message || "Invalid credentials",
            success: false
        });
    }
    next();
};

export default { signupValidation, loginValidation };