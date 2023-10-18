import express from "express";
import cors from "cors";
import client from "./gRPC/gRPC_Client/gRPC_Client.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

//Init
const app = express();

// Settings
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("port", 3000);
app.set("views", path.join(__dirname, "./public/views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "./public/static")));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Routes
app.get("/", function (req, res) {
  // res.send(`http://localhost:${app.get("port")}`);
  res.render("crud", {});
});

app.get("/productos", function (req, res) {
  const rows = [];
  const call = client.GetAll();
  call.on("data", function (response) {
    rows.push(response);
  });
  call.on("end", function () {
    return res.json(rows);
  });
  call.on("error", function (error) {
    console.log(error);
  });
});

app.get("/productos/:id", function (req, res) {
  client.Get({ id: req.params.id }, function (err, response) {
    if (err) {
      res.json(err);
    } else {
      res.json(response);
    }
  });
});

app.post("/productos", function (req, res) {
  let producto = {
    descripcion: req.body.descripcion,
  };
  client.Add(producto, function (err, response) {
    if (err) {
      res.json(err);
    } else {
      res.json(response);
    }
  });
});

app.put("/productos/:id", function (req, res) {
  let producto = {
    id: req.params.id,
    descripcion: req.body.descripcion,
  };
  client.Update(producto, function (err, response) {
    if (err) {
      res.json(err);
    } else {
      res.json(response);
    }
  });
});

app.delete("/productos/:id", function (req, res) {
  client.Delete({ id: req.params.id }, function (err, response) {
    if (err) {
      res.json(err);
    } else {
      res.json(response);
    }
  });
});

// Start
app.listen(app.get("port"));
console.log(`http://localhost:${app.get("port")}`);
