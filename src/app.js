import express from "express";
import cors from "cors";
import client from "./gRPC/gRPC_Client/gRPC_Client.js";

//Init
const app = express();

// Settings
app.set("port", 3000);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Routes
app.get("/", function (req, res) {
  res.send(`http://localhost:${app.get("port")}`);
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
