const mongoose = require("mongoose");						

const hostname = process.env.DEV_HOSTNAME || "mongo";
const connString = `mongodb://${hostname}/books`;
console.log(connString);
mongoose
  .connect(connString, {						
    useNewUrlParser: true,						
    useUnifiedTopology: true,						
  })						
  .then((db) => console.log("Connected to mongodb",  db.connection.host, db.connection.port))
  .catch((err) => console.log(err.message));

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  hashedPassword: String
});
const User = mongoose.model("User", userSchema);

// Wishlist schema
const wishlistSchema = new mongoose.Schema({
  user: String,
  name: String,
  books: []  
});
const Wishlist = mongoose.model("Wishlist", wishlistSchema);

// ** Get User
async function getUser(username){
  try {
    console.log(`Get User "${username}"`);
    const user = await User.findOne({ username: username });
    return user;
  } catch (error) {
    console.log(error);
  }
}

// ** Create User
async function createUser(username, password){
  try {
    console.log(`Create User "${username}"`);
    const newUser = {
      username: username,
      hashedPassword: password
    };
    const user = await new User(newUser).save();
    return user;
  } catch (error) {
    console.log(error);
  }    
}

// ** Create wishlist
async function createWishlist(username, name){
  try {
    console.log(`Create Wishlist "${name}"`);
    const newWishlist = {
      user: username,
      name: name,
      books: []
    };
    const wishlist = await new Wishlist(newWishlist).save();
    return wishlist;
  } catch (error) {
    console.log(error);
  }    
}

// ** Delete wishlist
async function deleteWishlist(username, name){
  try {
    console.log(`Delete Wishlist "${name}"`);
    const wishlist = await Wishlist.findOneAndDelete({ user: username, name: name });
    return wishlist;
  } catch (error) {
    console.log(error);
  }    
}

// ** Get wishlist
async function getWishlist(user, name){
  try {
    console.log(`Get Wishlist "${name}"`);
    const wishlist = await Wishlist.findOne({ user: user, name: name });
    return wishlist;
  } catch (error) {
    console.log(error);
  }    
}

// ** Get All wishlist
async function getAllWishlist(usename){
  try {
    console.log(`Get all Wishlist from user "${usename}"`);
    const wishlists = await Wishlist.find({ user: usename }, { books: 0 });
    return wishlists;
  } catch (error) {
    console.log(error);
  }    
}

// ** Add Book to wishlist
async function addBookWishlist(username, name, bookId, bookName, bookAuthors, bookPublisher, language){
  try {
    console.log(`Add book "${bookName}" to wishlist "${name}"`);
    const newBook = {
      bookId: bookId,
      title: bookName,
      authors: bookAuthors,
      publisher: bookPublisher,
      language: language
    }; 
    const wishlist = await getWishlist(username, name);
    wishlist.books.push(newBook);
    const result = await wishlist.save();
    return result;
  } catch (error) {
    console.log(error);
  }    
}

// ** Remove Book to wishlist
async function removeBookWishlist(username, name, bookId){
  try {
    console.log(`Remove book Id "${bookId}" from wishlist "${name}"-${username}`);
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: username, name: name }, // searching
      {
        $pull: {
          books: { bookId: bookId  } // remove
        }
      },
      { new: true } // return new object
    );
    console.log(wishlist);
    return wishlist;
  } catch (error) {
    console.log(error);
  }    
}

module.exports.getUser = getUser;
module.exports.createUser = createUser;
module.exports.createWishlist = createWishlist;
module.exports.deleteWishlist = deleteWishlist;
module.exports.getWishlist = getWishlist;
module.exports.getAllWishlist = getAllWishlist;
module.exports.addBookWishlist = addBookWishlist;
module.exports.removeBookWishlist = removeBookWishlist;
