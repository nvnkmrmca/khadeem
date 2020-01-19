exports.success = (res, data, msg = '') => {
    return res.send({ data: data, message: msg });
};

exports.unAuthorized = (res, msg) => {
    return error(res, 401, msg);
};

exports.error = (res, msg) => {
    error(res, 500, msg);
};

exports.vError = (res, msg) => {
    return error(res, 400, msg);
};

exports.cError = (res, msg) => {
    return error(res, 404, msg);
};

exports.nError = (res, msg) => {
    return error(res, 404, msg);
};

error = (res, code, msg) => {
    return res.status(code).send({ message: msg });
};