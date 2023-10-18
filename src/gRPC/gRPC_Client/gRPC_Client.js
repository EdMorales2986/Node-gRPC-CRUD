import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROTO_PATH = __dirname + "/prods.proto";
import grpc from "@grpc/grpc-js";
import loader from "@grpc/proto-loader";
const PORT = 30043;

const packageDefinition = loader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
  defaults: true,
  oneofs: true,
});

const Productos = grpc.loadPackageDefinition(packageDefinition).Productos;
const client = new Productos(
  "localhost:30043",
  grpc.credentials.createInsecure()
);

export default client;
