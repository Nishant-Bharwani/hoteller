const jimp = require('jimp');
const logger = require('./winston.logger');
exports.processAvatarImage = async (req, res, next) => {
    try {
        if (req.file) {
            const fileBuffer = req.file.buffer;
    
            const jimpResp = await jimp.read(fileBuffer);
            jimpResp.resize(150, jimp.AUTO);
            next(file);
        }
    } catch (err) {
        logger.error("Image processing error: ", err);
        next(err);
    }
};