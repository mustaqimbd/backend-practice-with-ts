import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), '.env') })

// When you use dotenv.config() without any parameters, it automatically looks for a .env file in the root directory of your project. If your .env file is in the root directory and has the correct name, you don't need to specify the path explicitly.

// The { path: path.join(process.cwd(), '.env') } option allows you to specify a custom path to the .env file. This is useful when your .env file is located in a different directory or has a different name.

export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database_uri: process.env.DATABASE_URL,
    saltRounds: process.env.BCRYPT_SALT_ROUND,
    default_password: process.env.DEFAULT_PASSWORD,
    jwt_secret: process.env.JWT_SECRET,
    JWT_refresh_secret: process.env.REFRESH_SECRET,
    JWT_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN,
    JWT_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
    reset_password_ui_link: process.env.RESET_PASSWORD_LINK,
    cloudinary_cloud_name: process.env.CLOUDINARY_ClOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
}