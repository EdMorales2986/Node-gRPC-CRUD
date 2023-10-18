import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROTO_PATH = __dirname + "/prods.proto";
const PORT = 30043;

import pg from "pg";
const { Pool } = pg;
import grpc from "@grpc/grpc-js";
import loader from "@grpc/proto-loader";
// import "dotenv/config";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "prods",
  port: "5432",
});

const packageDefinition = loader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
  defaults: true,
  oneofs: true,
});

const protodescripcor = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

server.addService(protodescripcor.Productos.service, {
  GetAll: GetAll,
  Get: Get,
  Add: Add,
  Update: Update,
  Delete: Delete,
});

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log(`Server running at http://localhost:${PORT}`);
  }
);

async function GetAll(call, callback) {
  const query = `SELECT * FROM productos`;
  try {
    const { rows } = await pool.query(query);
    rows.forEach((row) => {
      call.write(row);
    });
    call.end();
  } catch (error) {
    console.log(error);
  }
}

async function Get(call, callback) {
  const { id } = call.request;
  const query = `SELECT * FROM productos WHERE id = ${id}`;
  try {
    const { rows } = await pool.query(query);
    callback(null, rows[0]);
  } catch (error) {
    callback({ code: grpc.status.NOT_FOUND, details: error.message });
  }
}

async function Add(call, callback) {
  const { descripcion } = call.request;
  const query = `INSERT INTO productos (descripcion) VALUES ('${descripcion}')`;
  try {
    await pool.query(query);
    callback(null, {});
  } catch (error) {
    callback({ code: grpc.status.INTERNAL, details: error.message });
  }
}

async function Update(call, callback) {
  const { id, descripcion } = call.request;
  const query = `UPDATE productos SET descripcion = '${descripcion}' WHERE id = ${id}`;
  try {
    await pool.query(query);
    callback(null, {});
  } catch (error) {
    callback({ code: grpc.status.INTERNAL, details: error.message });
  }
}

async function Delete(call, callback) {
  const { id } = call.request;
  const query = `DELETE FROM productos WHERE id = ${id}`;
  try {
    await pool.query(query);
    callback(null, {});
  } catch (error) {
    callback({ code: grpc.status.INTERNAL, details: error.message });
  }
}
