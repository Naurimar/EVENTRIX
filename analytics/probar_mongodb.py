
import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError

load_dotenv()

uri = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/")

try:
    with MongoClient(uri, serverSelectionTimeoutMS=3000) as cliente:
        cliente.admin.command("ping")
        print("¡Conexión con MongoDB exitosa!")
        print("Servidor: 127.0.0.1:27017")

except PyMongoError as error:
    print("No fue posible conectar con MongoDB.")
    print("Detalle:", error)
