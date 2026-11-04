

import os
from datetime import datetime, timezone

import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from sqlalchemy import URL, create_engine
from sqlalchemy.exc import SQLAlchemyError

load_dotenv()


def obtener_motor_mysql():
    url = URL.create(
        drivername="mysql+mysqlconnector",
        username=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "3306")),
        database=os.getenv("DB_NAME", "eventrix"),
    )
    return create_engine(url)


def leer_datos(conexion, consulta):
    return pd.read_sql(consulta, conexion)


def analizar_eventos(conexion):
    df = leer_datos(
        conexion,
        """
        SELECT nombre, tipo, fecha, presupuesto, estado, num_invitados
        FROM evento
        ORDER BY fecha
        """
    )

    presupuesto = pd.to_numeric(df["presupuesto"], errors="coerce").fillna(0)
    invitados = pd.to_numeric(df["num_invitados"], errors="coerce").fillna(0)

    return {
        "totalEventos": int(len(df)),
        "presupuestoTotal": float(presupuesto.sum()),
        "presupuestoPromedio": float(presupuesto.mean()) if not df.empty else 0,
        "totalInvitados": int(invitados.sum()),
        "eventosPorEstado": {
            str(k): int(v)
            for k, v in df["estado"].fillna("Sin estado").value_counts().items()
        },
    }


def analizar_reservas(conexion):
    df = leer_datos(
        conexion,
        """
        SELECT estado, costo_total, fecha_inicio, fecha_fin
        FROM reserva
        """
    )

    costos = pd.to_numeric(df["costo_total"], errors="coerce").fillna(0)

    return {
        "totalReservas": int(len(df)),
        "costoTotalReservas": float(costos.sum()),
        "costoPromedioReserva": float(costos.mean()) if not df.empty else 0,
        "reservasPorEstado": {
            str(k): int(v)
            for k, v in df["estado"].fillna("Sin estado").value_counts().items()
        },
    }


def analizar_proveedores(conexion):
    df = leer_datos(
        conexion,
        """
        SELECT p.id_proveedor, p.nombre, p.calificacion, p.activo,
               t.nombre_tipo AS categoria
        FROM proveedor p
        LEFT JOIN tiposervicio t ON p.id_tipo = t.id_tipo
        """
    )

    calificaciones = pd.to_numeric(
        df["calificacion"], errors="coerce"
    ).dropna()

    return {
        "totalProveedores": int(len(df)),
        "proveedoresActivos": int((df["activo"] == 1).sum()),
        "proveedoresInactivos": int((df["activo"] == 0).sum()),
        "calificacionPromedio": (
            float(calificaciones.mean()) if not calificaciones.empty else 0
        ),
        "proveedoresPorCategoria": {
            str(k): int(v)
            for k, v in df["categoria"].fillna("Sin categoría").value_counts().items()
        },
    }


def analizar_invitados(conexion):
    invitados = leer_datos(
        conexion,
        "SELECT id_invitado, estado_rsvp FROM invitado"
    )

    asociaciones = leer_datos(
        conexion,
        """
        SELECT id_evento, id_invitado, estado_rsvp
        FROM eventoinvitado
        """
    )

    return {
        "totalInvitadosRegistrados": int(len(invitados)),
        "invitadosPorEstado": {
            str(k): int(v)
            for k, v in invitados["estado_rsvp"].fillna("Sin estado").value_counts().items()
        },
        "totalInvitadosAsociados": int(len(asociaciones)),
        "invitadosAsociadosPorEstado": {
            str(k): int(v)
            for k, v in asociaciones["estado_rsvp"].fillna("Sin estado").value_counts().items()
        },
        "eventosConInvitados": int(asociaciones["id_evento"].nunique()),
    }


def analizar_eventrix():
    motor = None
    cliente_mongo = None

    try:
        motor = obtener_motor_mysql()

        with motor.connect() as conexion:
            eventos = analizar_eventos(conexion)
            reservas = analizar_reservas(conexion)
            proveedores = analizar_proveedores(conexion)
            invitados = analizar_invitados(conexion)

        resumen = {
            **eventos,
            "reservas": reservas,
            "proveedores": proveedores,
            "invitados": invitados,
            "fechaGeneracion": datetime.now(timezone.utc),
        }

        print("\n=== RESUMEN DE EVENTRIX ===")
        print(f"Total de eventos: {eventos['totalEventos']}")
        print(f"Presupuesto total: ${eventos['presupuestoTotal']:,.2f} COP")
        print(f"Presupuesto promedio: ${eventos['presupuestoPromedio']:,.2f} COP")
        print(f"Total de invitados estimados en eventos: {eventos['totalInvitados']}")

        print("\n=== RESERVAS ===")
        print(f"Total de reservas: {reservas['totalReservas']}")
        print(f"Costo total: ${reservas['costoTotalReservas']:,.2f} COP")
        print(f"Reservas por estado: {reservas['reservasPorEstado'] or 'Sin datos'}")

        print("\n=== PROVEEDORES ===")
        print(f"Total: {proveedores['totalProveedores']}")
        print(f"Activos: {proveedores['proveedoresActivos']}")
        print(f"Inactivos: {proveedores['proveedoresInactivos']}")
        print(f"Categorías: {proveedores['proveedoresPorCategoria'] or 'Sin datos'}")

        print("\n=== INVITADOS ===")
        print(f"Registrados: {invitados['totalInvitadosRegistrados']}")
        print(f"Asociados a eventos: {invitados['totalInvitadosAsociados']}")
        print(f"Estados RSVP: {invitados['invitadosAsociadosPorEstado'] or 'Sin datos'}")

        uri = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/")
        nombre_db = os.getenv("MONGO_DB", "eventrix_analytics")

        cliente_mongo = MongoClient(uri, serverSelectionTimeoutMS=3000)
        cliente_mongo.admin.command("ping")

        coleccion = cliente_mongo[nombre_db]["resumen_reportes"]
        coleccion.replace_one(
            {"_id": "resumen_general"},
            resumen,
            upsert=True,
        )

        print(
            f"\nResumen completo guardado en "
            f"{nombre_db}.resumen_reportes"
        )

    except (SQLAlchemyError, PyMongoError) as error:
        print("No fue posible completar el análisis o guardar el resumen.")
        print("Detalle:", error)

    finally:
        if cliente_mongo is not None:
            cliente_mongo.close()
        if motor is not None:
            motor.dispose()


if __name__ == "__main__":
    analizar_eventrix()
