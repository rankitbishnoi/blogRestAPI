const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var multer  = require('multer')
var upload = multer({ dest: './uploads/' })


app.use(bodyParser.json({ limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect("mongodb://localhost/myapp",{
  useMongoClient: true,
});

const blog = require("./schema/blogModel.js");
const comment = require("./schema/comment.js");
const user = require("./schema/user.js");

app.listen(3000, () => {
    console.log("listening on port 3000");
});

const agerestrictionMiddleware = require('./middlewares/agerestrictionMiddleware.js');
const tag = require('./middlewares/tagchangerMiddleware.js');

app.use((req, res, next) => {
  console.log('Time of request:', Date.now());
  console.log("request url is ",req.originalUrl);
  console.log("request IP address is", req.ip);

  next();
})

//--------------------------CRUD for blog API------------------------------
app.get("/blogs", agerestrictionMiddleware.agerestriction, (req, res) => {
  if (req.restriction) {
    blog.where('agerestriction').equals('false').then((blogs) => {
        res.json(blogs);
    });
  }else {
    blog.find((err, blogs) => {
        if (err)
            console.log(err);
        res.json(blogs);
    });
  }
});

app.get("/blogs/:id", agerestrictionMiddleware.agerestriction, (req, res) => {
  if (req.restriction) {
    res.json(" the content you are looking for is not available for people under age of 18.");
  }else {
    blog.findById(req.params.id, (err, blogs) => {
        res.json(blogs);
    });
  }
});

app.post("/blogs/create", tag.tagchanger, upload.single('ava'+Date.now()), (req, res) => {
    blog.create({
      title: req.body.title,
      content: req.body.content,
      created: Date.now(),
      author: req.body.author,
      agerestriction: req.body.agerestriction,
      tags: req.body.tags,
      imageSrc: (req.file != undefined) ? req.file.path : null
    }, (err, blogs) => {
        if (err)
            console.log(err);
        blog.find((err, blogs) => {
            if (err)
                console.log(err);
            res.json(blogs);
        });
    });
});

app.post("/blogs/:id/liked/:userid", (req, res) => {
  blog.findById(req.params.id, (err, blogs) => {
    let ob = {
      userid : req.params.userid,
      time: Date.now()
    }
    blogs.likes = blogs.likes.concat(ob);
    blogs.save();
    res.json(blogs);
  });
});

app.post("/blogs/:id/disliked/:userid", (req, res) => {
  blog.findById(req.params.id, (err, blogs) => {
    let ob = {
      userid : req.params.userid,
      time: Date.now()
    }
    blogs.dislikes = blogs.dislikes.concat(ob);
    blogs.save();
    res.json(blogs);
  });
});

app.put('/blogs/:id', (req, res) => {
    blog.findById(req.params.id, (err, blog) => {
        blog.update(req.body, (err, blogs) => {
            if (err)
                console.log();
            res.json(blogs);
        });
    });
});

app.delete('/blogs/:id', (req, res) => {
    blog.remove({
        _id: req.params.id
    }, (err, blogs) => {
        if (err)
            console.log();
        blog.find((err, blogs) => {
            if (err)
                console.log();
            res.json(blogs);
        });
    });
});


//--------------------------CRUD for USER API -----------------------------
app.get("/users", (req, res) => {
  user.find((err, users) =>{
    if (err) {
      console.log(err);
    }
    res.json(users);
  });
});

app.get("/users/:id", (req, res) => {
  user.findById(req.params.id, (err, users) =>{
    if (err) {
      console.log(err);
    }
    res.json(users);
  });
});

app.post("/users/create", (req, res) => {
  user.create({
    name: req.body.name,
    dob: req.body.dob
  }, (err, users) => {
    if (err)
      console.log(err);
    user.find((err, users) => {
      if (err)
        console.log(err);
      res.json(users);
    });
  });
});

app.put('/users/:id', (req, res) => {
    user.findById(req.params.id, (err, user) => {
        user.update(req.body, (err, users) => {
            if (err)
                console.log();
            res.json(users);
        });
    });
});

app.delete('/users/:id', (req, res) => {
    user.remove({
        _id: req.params.id
    }, (err, users) => {
        if (err)
            console.log();
        user.find((err, users) => {
            if (err)
                console.log();
            res.json(users);
        });
    });
});


//-----------------------CRUD for COMMENT API---------------------------------
app.get("/blogs/:id/comments", (req, res) => {
    comment.find((err, comments) => {
        if (err) {
          console.log(err);
        }
        res.json(comments);
    });
});

app.post("/blogs/:id/comments", (req, res) => {
    comment.create({
      blogId: req.params.id,
      comment: req.body.comment,
      postedBy: req.body.userid
    }, (err, comments) => {
      if (err)
        console.log(err);
      comment.find((err, comments) => {
        if (err) {
          console.log(err);
        }
        res.json(comments);
      });
    });
});

app.put('/blogs/:id/comments', (req, res) => {
    comment.findById(req.body.id, (err, comment) => {
        comment.update(req.body, (err, comments) => {
            if (err)
                console.log();
            res.json(comments);
        });
    });
});

app.delete('/blogs/:id/comments', (req, res) => {
    comment.remove({
        _id: req.body.id
    }, (err, comments) => {
        if (err)
            console.log();
        comment.find((err, comments) => {
            if (err)
                console.log();
            res.json(comments);
        });
    });
});
