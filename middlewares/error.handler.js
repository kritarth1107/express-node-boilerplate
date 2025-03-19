const errorHandler = (err, req, res, next) => {
    
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
        message: err.message || "An unexpected error occurred",
        details: err.details || null,
        color:err.color || "red",
        timestamp: new Date().toISOString(),
    });

    
};

export default errorHandler;
