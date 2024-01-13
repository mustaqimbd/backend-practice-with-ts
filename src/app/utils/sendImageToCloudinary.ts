import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config';
import multer from 'multer'
import fs from "fs"

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret
});


const sendImageToCloudinary = (path: string, imgName: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            { public_id: imgName },
            (error, result) => {
                if (error) {
                    reject(error)
                }
                resolve(result)

                //delete the file from uploads folder
                fs.unlink(path, (err) => {
                    if (err) {
                        reject(err)
                    }
                })
            }
        );
    })

};

export default sendImageToCloudinary;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + "-" + file.originalname.split(" ").join("-")
        cb(null, fileName)
    }
})

export const upload = multer({ storage: storage })
