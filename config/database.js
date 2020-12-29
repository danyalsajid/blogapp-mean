// should remove the actual username and password. set in env variables 
// dbURI: `mongodb+srv://danyal_2:test1234@nodetuts.hxm3z.mongodb.net/blog-app?retryWrites=true&w=majority`,
module.exports = {
    dbURI: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@nodetuts.hxm3z.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
    secret: 'yoursecret'
}