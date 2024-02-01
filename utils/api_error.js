// utils.js

const sendErrorResponse = (res, errorMessage, error,code) => {
    return res.status(code).send({
        success: false,
        message: errorMessage,
        error: error.message || error
    });
};

export default sendErrorResponse;
