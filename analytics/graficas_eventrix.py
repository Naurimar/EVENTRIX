
import os
from pathlib import Path

import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from sqlalchemy import URL, create_engine
from sqlalchemy.exc import SQLAlchemyError


# ==========================================
# CONFIGURACIÓN
# ==========================================

RUTA_ANALYTICS = Path(__file__).resolve().parent
RUTA_PROYECTO = RUTA_ANALYTICS.parent

load_dotenv(RUTA_ANALYTICS / ".env")

CARPETA_GRAFICAS = RUTA_ANALYTICS / "graficas"
CARPETA_GRAFICAS.mkdir(exist_ok=True)


# ==========================================
# CONEXIÓN A MYSQL
# ==========================================

def obtener_motor_mysql():
    conexion = URL.create(
        drivername="mysql+mysqlconnector",
        username=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "3306")),
        database=os.getenv("DB_NAME", "eventrix")
    )

    return create_engine(conexion)


# ==========================================
# CONSULTAR DATOS
# ==========================================

def consultar_datos(motor, consulta):
    return pd.read_sql(consulta, motor)


# ==========================================
# FUNCIÓN PARA GUARDAR GRÁFICAS
# ==========================================

def guardar_grafica(nombre):
    ruta = CARPETA_GRAFICAS / nombre
    plt.tight_layout()
    plt.savefig(ruta, dpi=300, bbox_inches="tight")
    plt.close()
    print(f"Gráfica generada: {ruta}")


# ==========================================
# 1. GRÁFICAS DE EVENTOS
# ==========================================

def graficar_eventos(motor):

    eventos = consultar_datos(
        motor,
        """
        SELECT tipo, estado, fecha
        FROM evento
        """
    )

    if eventos.empty:
        print("Sin datos de eventos para graficar.")
        return

    # Eventos por tipo
    conteo_tipo = eventos["tipo"].fillna("Sin tipo").value_counts()

    conteo_tipo.plot(kind="bar", figsize=(9, 5))
    plt.title("Eventos por tipo")
    plt.xlabel("Tipo de evento")
    plt.ylabel("Cantidad")
    plt.xticks(rotation=45, ha="right")
    guardar_grafica("eventos_por_tipo.png")

    # Eventos por estado
    conteo_estado = eventos["estado"].fillna("Sin estado").value_counts()

    conteo_estado.plot(kind="bar", figsize=(9, 5))
    plt.title("Eventos por estado")
    plt.xlabel("Estado")
    plt.ylabel("Cantidad")
    plt.xticks(rotation=45, ha="right")
    guardar_grafica("eventos_por_estado.png")

    # Eventos por mes
    eventos["fecha"] = pd.to_datetime(eventos["fecha"], errors="coerce")
    eventos_validos = eventos.dropna(subset=["fecha"])

    if not eventos_validos.empty:
        por_mes = (
            eventos_validos
            .groupby(eventos_validos["fecha"].dt.to_period("M"))
            .size()
        )

        por_mes.index = por_mes.index.astype(str)
        por_mes.plot(kind="line", marker="o", figsize=(10, 5))
        plt.title("Eventos por mes")
        plt.xlabel("Mes")
        plt.ylabel("Cantidad")
        plt.xticks(rotation=45)
        guardar_grafica("eventos_por_mes.png")


# ==========================================
# 2. GRÁFICAS DE RESERVAS
# ==========================================

def graficar_reservas(motor):

    reservas = consultar_datos(
        motor,
        """
        SELECT estado, costo_total
        FROM reserva
        """
    )

    if reservas.empty:
        print("Sin datos de reservas para graficar.")
        return

    # Reservas por estado
    estados = reservas["estado"].fillna("Sin estado").value_counts()

    estados.plot(kind="pie", autopct="%1.1f%%", figsize=(7, 7))
    plt.title("Reservas por estado")
    plt.ylabel("")
    guardar_grafica("reservas_por_estado.png")

    # Costos de reservas
    costos = pd.to_numeric(reservas["costo_total"], errors="coerce").dropna()

    if not costos.empty:
        plt.figure(figsize=(9, 5))
        costos.plot(kind="hist", bins=10, edgecolor="black")
        plt.title("Distribución de costos de reservas")
        plt.xlabel("Costo (COP)")
        plt.ylabel("Cantidad de reservas")
        guardar_grafica("costos_reservas.png")


# ==========================================
# 3. GRÁFICAS DE PROVEEDORES
# ==========================================

def graficar_proveedores(motor):

    proveedores = consultar_datos(
        motor,
        """
        SELECT p.activo, p.calificacion, ts.nombre_tipo
        FROM proveedor p
        LEFT JOIN tipo_servicio ts
            ON p.id_tipo = ts.id_tipo
        """
    )

    if proveedores.empty:
        print("Sin datos de proveedores para graficar.")
        return

    # Activos e inactivos
    proveedores["estado"] = proveedores["activo"].map({
        1: "Activos",
        0: "Inactivos"
    }).fillna("Sin estado")

    estados = proveedores["estado"].value_counts()

    estados.plot(kind="bar", figsize=(7, 5))
    plt.title("Proveedores activos e inactivos")
    plt.xlabel("Estado")
    plt.ylabel("Cantidad")
    guardar_grafica("proveedores_por_estado.png")

    # Proveedores por categoría
    categorias = (
        proveedores["nombre_tipo"]
        .fillna("Sin categoría")
        .value_counts()
    )

    categorias.plot(kind="bar", figsize=(9, 5))
    plt.title("Proveedores por categoría")
    plt.xlabel("Categoría")
    plt.ylabel("Cantidad")
    plt.xticks(rotation=45, ha="right")
    guardar_grafica("proveedores_por_categoria.png")


# ==========================================
# 4. GRÁFICAS DE INVITADOS
# ==========================================

def graficar_invitados(motor):

    invitados = consultar_datos(
        motor,
        """
        SELECT estado_rsvp
        FROM invitado
        """
    )

    if invitados.empty:
        print("Sin datos de invitados para graficar.")
        return

    estados = (
        invitados["estado_rsvp"]
        .fillna("Sin estado")
        .value_counts()
    )

    estados.plot(kind="bar", figsize=(8, 5))
    plt.title("Invitados por estado RSVP")
    plt.xlabel("Estado RSVP")
    plt.ylabel("Cantidad")
    plt.xticks(rotation=45, ha="right")
    guardar_grafica("invitados_por_estado.png")


# ==========================================
# EJECUCIÓN PRINCIPAL
# ==========================================

def generar_graficas():

    motor = None

    try:
        motor = obtener_motor_mysql()

        with motor.connect() as conexion:
            print("Conexión a MySQL exitosa.")

        graficar_eventos(motor)
        graficar_reservas(motor)
        graficar_proveedores(motor)
        graficar_invitados(motor)

        print("\nProceso de generación de gráficas finalizado.")
        print(f"Carpeta de resultados: {CARPETA_GRAFICAS}")

    except SQLAlchemyError as error:
        print(f"Error al consultar MySQL: {error}")

    except Exception as error:
        print(f"Error al generar las gráficas: {error}")

    finally:
        if motor is not None:
            motor.dispose()


if __name__ == "__main__":
    generar_graficas()
