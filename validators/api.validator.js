const { check, body, validationResult } = require('express-validator');

exports.validationStatisticsAll = [
    check('externalNumber')
    .exists()
    .withMessage('Некорректный ключ')
    .isNumeric()
    .withMessage('Должны быть только цифры')
    .isLength({ min: 11, max: 11 })
    .withMessage('Длинна не должна быть больше или меньше 11 цифр'),

    check('startDate')
    .exists()
    .withMessage('Некорректный ключ')
    .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .withMessage('Некорректный формат даты'),

    check('endDate')
    .exists()
    .withMessage('Некорректный ключ')
    .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .withMessage('Некорректный формат даты')
];

exports.validationStatisticsById = [
    check('id')
    .exists()
    .withMessage('Некорректный ключ')
    .isNumeric()
    .withMessage('Должны быть только цифры')
];

exports.validationOriginateCall = [
    check('extension')
    .exists()
    .withMessage('Некорректный ключ')
    .isLength({ min: 3, max: 3 })
    .withMessage('Длинна не должна быть больше или меньше 3 цифр')
    .isNumeric()
    .withMessage('Должны быть только цифры'),


    check('externalNumber')
    .exists()
    .withMessage('Некорректный ключ')
    .isNumeric()
    .withMessage('Должны быть только цифры')
    .isLength({ min: 11, max: 11 })
    .withMessage('Длинна не должна быть больше или меньше 11 цифр')
];

exports.checkRules = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};