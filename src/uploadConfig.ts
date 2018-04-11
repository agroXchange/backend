import * as multer from 'koa-multer'

export const FILE_UPLOAD_OPTIONS = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-'  + new Date().toISOString().split('.')[0] + '.' + file.originalname.split('.')[1])
    }
  })
}