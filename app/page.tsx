"use client";

import { useState } from "react";
import {
  BsFillSunFill,
  BsLightningChargeFill,
  BsGearWideConnected,
  BsBatteryFull,
  BsCashCoin,
  BsCalendarCheck,
  BsGraphUpArrow,
  BsHouseHeart,
  BsTools,
} from "react-icons/bs";

// --- Paleta de Colores Profesional ---
const COLORS = {
  background: "#f8f9fa",
  textPrimary: "#212529",
  textSecondary: "#6c757d",
  brand: "#0077b6",
  accent: "#ffb703",
  success: "#2a9d8f",
  danger: "#e76f51",
  lightGray: "#e9ecef",
  white: "#ffffff",
};

// --- Interfaces ---
interface CalculationResults {
  numeroPaneles: number;
  inversionEstimada: number;
  ahorroMensual: number;
  retornoInversionAnos: number;
  costoBloqueCastigo: number;
  ingresoAnualExtra: number;
  aumentoPlusvalia: number;
  potenciaSistemaKwp: number;
  capacidadInversorKw: number;
  bateriasRecomendadasKwh: number;
  desgloseAhorro: string;
}

// --- Componentes Reutilizables ---
const SpecItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
}) => (
  <li
    style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem 0",
      borderBottom: `1px solid ${COLORS.lightGray}`,
    }}
  >
    <div style={{ color: COLORS.brand, fontSize: "1.5rem", flexShrink: 0 }}>
      {icon}
    </div>
    <p style={{ margin: 0, fontSize: "1.1rem", color: COLORS.textSecondary }}>
      {text}
    </p>
  </li>
);

const BenefitCard = ({
  icon,
  title,
  value,
  valueColor = COLORS.textPrimary,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  valueColor?: string;
}) => (
  <div
    style={{
      background: COLORS.white,
      padding: "1.5rem",
      borderRadius: "16px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "0.5rem",
      }}
    >
      <div style={{ color: COLORS.brand, fontSize: "1.25rem" }}>{icon}</div>
      <h4
        style={{
          margin: 0,
          fontSize: "1rem",
          fontWeight: 600,
          color: COLORS.textSecondary,
        }}
      >
        {title}
      </h4>
    </div>
    <p
      style={{
        margin: 0,
        fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
        fontWeight: 700,
        color: valueColor,
      }}
    >
      {value}
    </p>
  </div>
);

// --- Componente Principal de la Página ---
export default function HomePage() {
  const [gastoMensual, setGastoMensual] = useState("");
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTechDetails, setShowTechDetails] = useState(false);

  // --- Funciones Auxiliares ---
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
    });
  };

  const formatYearsAndMonths = (decimalYears: number) => {
    const years = Math.floor(decimalYears);
    const months = Math.round((decimalYears - years) * 12);
    if (months === 12) {
      return `${years + 1} años`;
    }
    if (months === 0) {
      return `${years} años`;
    }
    if (years === 0) {
      return `${months} meses`;
    }
    return `${years} años y ${months} meses`;
  };

  // --- Manejador del Cálculo ---
  const handleCalculate = async () => {
    if (!gastoMensual || parseFloat(gastoMensual) <= 0) {
      setError("Por favor, introduce un monto válido.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResults(null);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_URL}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gastoMensual: parseFloat(gastoMensual) }),
      });
      if (!response.ok) {
        throw new Error("No se pudo realizar el cálculo. Inténtalo de nuevo.");
      }
      const data: CalculationResults = await response.json();
      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: COLORS.background,
        color: COLORS.textPrimary,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "3rem 1.5rem",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "960px", width: "100%", textAlign: "center" }}>
          <header>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 800,
                color: COLORS.textPrimary,
                marginBottom: "1rem",
                lineHeight: 1.1,
              }}
            >
              El Futuro de tu Energía está en el Sol
            </h1>
            <p
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)",
                color: COLORS.textSecondary,
                marginBottom: "2.5rem",
                maxWidth: "700px",
                margin: "0 auto 2.5rem auto",
                lineHeight: 1.6,
              }}
            >
              Introduce tu gasto eléctrico mensual y nuestra calculadora te
              mostrará la **inversión, ahorro y beneficios** de instalar paneles
              solares en República Dominicana.
            </p>
          </header>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
              background: COLORS.white,
              padding: "1rem",
              borderRadius: "16px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
            }}
          >
            <input
              type="number"
              value={gastoMensual}
              onChange={(e) => setGastoMensual(e.target.value)}
              placeholder="Ej: RD$ 5,000"
              style={{
                fontSize: "1.2rem",
                padding: "1rem",
                width: "280px",
                maxWidth: "100%",
                border: `2px solid ${COLORS.lightGray}`,
                borderRadius: "12px",
                textAlign: "center",
                outlineColor: COLORS.brand,
              }}
            />
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              style={{
                fontSize: "1.2rem",
                padding: "1rem 2.5rem",
                backgroundColor: isLoading
                  ? COLORS.textSecondary
                  : COLORS.brand,
                color: COLORS.white,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s ease",
              }}
            >
              {isLoading ? "Calculando..." : "¡Calcular Ahorro!"}
            </button>
          </div>
          {error && (
            <p
              style={{
                color: COLORS.danger,
                marginTop: "1rem",
                fontWeight: 500,
              }}
            >
              {error}
            </p>
          )}

          {results && (
            <div style={{ marginTop: "4rem", textAlign: "left" }}>
              {/* === SECCIÓN 1: TU DOLOR ACTUAL === */}
              <section
                style={{
                  marginBottom: "4rem",
                  padding: "2rem",
                  background: COLORS.white,
                  borderRadius: "16px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                }}
              >
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    margin: "0 0 1rem 0",
                    textAlign: "center",
                  }}
                >
                  Tu Realidad Energética Actual
                </h2>
                <p
                  style={{
                    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                    fontWeight: 700,
                    textAlign: "center",
                    color: COLORS.danger,
                    margin: "0 0 1rem 0",
                  }}
                >
                  Pagas {formatCurrency(results.ahorroMensual)} cada mes.
                </p>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: COLORS.textSecondary,
                    textAlign: "center",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  De eso, estás &apos;quemando&apos;
                  <strong>{formatCurrency(results.costoBloqueCastigo)}</strong>
                  en la energía más cara. ¡Ese es el dinero que puedes rescatar
                  ya!
                </p>
              </section>

              {/* === SECCIÓN 2: TU SOLUCIÓN PERSONALIZADA === */}
              <section
                style={{
                  marginBottom: "4rem",
                  padding: "2rem",
                  background: COLORS.white,
                  borderRadius: "16px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                }}
              >
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    margin: "0 0 1rem 0",
                    textAlign: "center",
                  }}
                >
                  Nuestra Propuesta de Solución para Ti
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <SpecItem
                    icon={<BsFillSunFill />}
                    text={
                      <>
                        Se recomienda una instalación de{" "}
                        <strong>{results.numeroPaneles} paneles</strong> solares
                        de alta eficiencia (550W).
                      </>
                    }
                  />
                  <SpecItem
                    icon={<BsLightningChargeFill />}
                    text={
                      <>
                        Esto generará una potencia total de{" "}
                        <strong>{results.potenciaSistemaKwp} kWp</strong>.
                      </>
                    }
                  />
                  <SpecItem
                    icon={<BsGearWideConnected />}
                    text={
                      <>
                        Un inversor de{" "}
                        <strong>{results.capacidadInversorKw} kW</strong> será
                        el cerebro de tu sistema.
                      </>
                    }
                  />
                  <SpecItem
                    icon={<BsBatteryFull />}
                    text={
                      <>
                        Para tu autonomía, se recomienda un sistema de
                        almacenamiento de{" "}
                        <strong>{results.bateriasRecomendadasKwh} kWh</strong>.
                      </>
                    }
                  />
                </ul>
              </section>

              {/* === SECCIÓN 3: TU FUTURO FINANCIERO === */}
              <section style={{ marginBottom: "4rem" }}>
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    margin: "0 0 2rem 0",
                    textAlign: "center",
                  }}
                >
                  Tu Nuevo Futuro Financiero
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  <BenefitCard
                    icon={<BsCashCoin />}
                    title="Inversión Estimada"
                    value={formatCurrency(results.inversionEstimada)}
                  />
                  <BenefitCard
                    icon={<BsCalendarCheck />}
                    title="Recuperación de Inversión"
                    value={formatYearsAndMonths(results.retornoInversionAnos)}
                  />
                  <BenefitCard
                    icon={<BsGraphUpArrow />}
                    title="Tu Nuevo 'Sueldo Solar'"
                    value={formatCurrency(results.ahorroMensual)}
                    valueColor={COLORS.success}
                  />
                  <BenefitCard
                    icon={<BsHouseHeart />}
                    title="Aumento Valor de tu Casa"
                    value={formatCurrency(results.aumentoPlusvalia)}
                  />
                </div>
              </section>

              {/* === SECCIÓN DE DETALLES TÉCNICOS ADICIONALES === */}
              <div style={{ textAlign: "center", margin: "2rem 0 4rem 0" }}>
                <button
                  onClick={() => setShowTechDetails(!showTechDetails)}
                  style={{
                    background: "none",
                    border: `2px solid ${COLORS.brand}`,
                    color: COLORS.brand,
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    padding: "0.8rem 1.5rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                  }}
                >
                  {showTechDetails ? "🔼 Ocultar" : "📄 Ver"} Componentes
                  Recomendados del Sistema
                </button>
                {showTechDetails && (
                  <div
                    style={{
                      background: COLORS.white,
                      borderRadius: "12px",
                      marginTop: "1.5rem",
                      textAlign: "left",
                      border: `1px solid ${COLORS.lightGray}`,
                      overflowX: "auto",
                    }}
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead
                        style={{
                          backgroundColor: COLORS.lightGray,
                          color: COLORS.textPrimary,
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "left",
                            }}
                          >
                            Componente
                          </th>
                          <th
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "left",
                            }}
                          >
                            Especificación Recomendada
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          style={{
                            borderBottom: `1px solid ${COLORS.lightGray}`,
                          }}
                        >
                          <td
                            style={{
                              padding: "1rem",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <BsFillSunFill color={COLORS.accent} /> Paneles
                            Solares
                          </td>
                          <td style={{ padding: "1rem" }}>
                            {results.numeroPaneles} unidades de 550W (o similar)
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderBottom: `1px solid ${COLORS.lightGray}`,
                          }}
                        >
                          <td
                            style={{
                              padding: "1rem",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <BsGearWideConnected color={COLORS.brand} />{" "}
                            Inversor Híbrido
                          </td>
                          <td style={{ padding: "1rem" }}>
                            {results.capacidadInversorKw} kW (con conexión a red
                            y respaldo)
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderBottom: `1px solid ${COLORS.lightGray}`,
                          }}
                        >
                          <td
                            style={{
                              padding: "1rem",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <BsBatteryFull color={COLORS.success} /> Baterías de
                            Litio
                          </td>
                          <td style={{ padding: "1rem" }}>
                            {results.bateriasRecomendadasKwh} kWh de
                            almacenamiento (LiFePO4)
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderBottom: `1px solid ${COLORS.lightGray}`,
                          }}
                        >
                          <td
                            style={{
                              padding: "1rem",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <BsTools color={COLORS.danger} /> Instalación y
                            Materiales
                          </td>
                          <td style={{ padding: "1rem" }}>
                            Estructuras de montaje, cableado, protecciones
                            eléctricas y mano de obra certificada.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* === SECCIÓN FINAL DE LLAMADA A LA ACCIÓN (CTA) === */}
              <div
                style={{
                  padding: "3rem",
                  background: `linear-gradient(45deg, ${COLORS.brand} 0%, #00a8e8 100%)`,
                  color: COLORS.white,
                  borderRadius: "24px",
                  textAlign: "center",
                  boxShadow: `0 16px 40px rgba(0, 119, 182, 0.4)`,
                }}
              >
                <h2
                  style={{
                    fontSize: "clamp(2rem, 5vw, 2.8rem)",
                    fontWeight: 800,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  ¿Listo para dar el siguiente paso?
                </h2>
                <p
                  style={{
                    fontSize: "1.2rem",
                    opacity: 0.9,
                    maxWidth: "600px",
                    margin: "1rem auto 2rem auto",
                  }}
                >
                  Recibe una cotización exacta de un instalador certificado. Sin
                  costo ni compromiso.
                </p>
                <form
                  action="https://formspree.io/f/TU_URL_UNICA_AQUI"
                  method="POST"
                  style={{ maxWidth: "500px", margin: "0 auto" }}
                >
                  <input
                    type="text"
                    name="Nombre"
                    placeholder="Tu Nombre"
                    required
                    style={{
                      width: "100%",
                      padding: "1rem",
                      marginBottom: "1rem",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "1rem",
                    }}
                  />
                  <input
                    type="tel"
                    name="Telefono"
                    placeholder="Teléfono / WhatsApp"
                    required
                    style={{
                      width: "100%",
                      padding: "1rem",
                      marginBottom: "1rem",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "1rem",
                    }}
                  />
                  <input
                    type="email"
                    name="Email"
                    placeholder="Tu Email"
                    required
                    style={{
                      width: "100%",
                      padding: "1rem",
                      marginBottom: "1.5rem",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "1rem",
                    }}
                  />
                  {/* Campos ocultos que se envían con los datos del formulario */}
                  <input
                    type="hidden"
                    name="Gasto Mensual (RD$)"
                    value={results.ahorroMensual}
                  />
                  <input
                    type="hidden"
                    name="Tamaño del Sistema (kW)"
                    value={results.potenciaSistemaKwp}
                  />
                  <input
                    type="hidden"
                    name="Paneles Estimados"
                    value={results.numeroPaneles}
                  />
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "1.2rem",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: COLORS.brand,
                      backgroundColor: COLORS.accent,
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    QUIERO MI COTIZACIÓN GRATIS
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
