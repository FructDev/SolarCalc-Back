"use client";

import { useState } from "react";

// --- Paleta de Colores Profesional ---
const COLORS = {
  background: "#f8f9fa",
  textPrimary: "#212529",
  textSecondary: "#6c757d",
  brand: "#0077b6", // Un azul corporativo y confiable
  accent: "#ffb703", // Un amarillo solar para acentos y llamadas a la acción
  success: "#2a9d8f",
  danger: "#e76f51",
  lightGray: "#e9ecef",
  white: "#ffffff",
};

// --- Interfaces y Componentes ---
interface CalculationResults {
  numeroPaneles: number;
  inversionEstimada: number;
  ahorroMensual: number;
  retornoInversionAnos: number;
  costoBloqueCastigo: number;
  ingresoAnualExtra: number;
  aumentoPlusvalia: number;
  ahorroDiario: number;
  potenciaSistemaKwp: number;
  capacidadInversorKw: number;
  bateriasRecomendadasKwh: number;
  desgloseAhorro: string;
}

// Componente reutilizable y flexible para tarjetas de resultados
const ResultCard = ({
  title,
  value,
  unit,
  icon,
  color = COLORS.brand,
  children,
}: {
  title: string;
  value?: string;
  unit?: string;
  icon: string;
  color?: string;
  children?: React.ReactNode;
}) => (
  <div
    style={{
      backgroundColor: COLORS.white,
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
      borderTop: `4px solid ${color}`,
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
      }}
    >
      <div style={{ fontSize: "2.5rem", lineHeight: 1, color }}>{icon}</div>
      <p
        style={{
          fontSize: "1.2rem",
          margin: 0,
          color: COLORS.textPrimary,
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {title}
      </p>
    </div>
    {value && (
      <p
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          margin: "0 0 4px 0",
          color: COLORS.textPrimary,
        }}
      >
        {value}
        {unit && (
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: "500",
              marginLeft: "8px",
              color: COLORS.textSecondary,
            }}
          >
            {unit}
          </span>
        )}
      </p>
    )}
    <div style={{ marginTop: "auto" }}>{children}</div>
  </div>
);

export default function HomePage() {
  const [gastoMensual, setGastoMensual] = useState("");
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTechDetails, setShowTechDetails] = useState(false);
  // const [showSavingsDisclaimer, setShowSavingsDisclaimer] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
    });
  };

  const handleCalculate = async () => {
    if (!gastoMensual || parseFloat(gastoMensual) <= 0) {
      setError("Por favor, introduce un monto válido.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResults(null);
    try {
      // Recuerda configurar esta URL en tus variables de entorno para producción
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:3001/api/calculate";
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
            <section
              style={{ marginTop: "5rem", width: "100%", textAlign: "left" }}
            >
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: "2.5rem",
                }}
              >
                Tu Propuesta Solar Personalizada
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "2rem",
                }}
              >
                <ResultCard
                  title="Paneles Solares Estimados"
                  value={String(results.numeroPaneles)}
                  unit="(de 550W)"
                  icon="☀️"
                  color={COLORS.accent}
                />
                <ResultCard
                  title="Inversión Aproximada"
                  value={formatCurrency(results.inversionEstimada)}
                  icon="💰"
                  color={COLORS.brand}
                />
                <ResultCard
                  title="Recuperación de la Inversión"
                  value={String(results.retornoInversionAnos)}
                  unit="años"
                  icon="⏳"
                  color={COLORS.success}
                />
              </div>

              <h3
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  textAlign: "center",
                  margin: "4rem 0 2.5rem 0",
                }}
              >
                ↓ Descubre lo que tu Ahorro Significa ↓
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "2rem",
                  alignItems: "stretch",
                }}
              >
                <ResultCard
                  title="Tu Nuevo 'Sueldo' Solar"
                  value={formatCurrency(results.ahorroMensual)}
                  unit="/mes"
                  icon="💰"
                  color={COLORS.success}
                >
                  <p
                    style={{
                      fontSize: "1rem",
                      color: COLORS.textSecondary,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Una vez pago, es como recibir un aumento de sueldo por los
                    próximos 25 años.
                  </p>
                </ResultCard>

                <ResultCard
                  title="Ahorro Diario Gracias al Sol"
                  value={formatCurrency(results.ahorroDiario)}
                  unit="/día"
                  icon="☕️"
                  color={COLORS.accent}
                >
                  <p
                    style={{
                      fontSize: "1rem",
                      color: COLORS.textSecondary,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Es como si el sol te invitara al café de la mañana, ¡todos
                    los días!
                  </p>
                </ResultCard>

                <ResultCard
                  title="Financia tus Metas con el Sol"
                  icon="🎯"
                  color={COLORS.brand}
                >
                  <p
                    style={{
                      fontSize: "1rem",
                      color: COLORS.textSecondary,
                      lineHeight: 1.6,
                      margin: "0 0 1rem 0",
                    }}
                  >
                    Con tu ahorro anual de{" "}
                    <strong>{formatCurrency(results.ingresoAnualExtra)}</strong>
                    , podrías:
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      color: COLORS.textPrimary,
                      textAlign: "left",
                    }}
                  >
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      ✈️ Pagar esas vacaciones familiares.
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      🎓 Cubrir gastos de la universidad.
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      🚗 Avanzar el inicial de un vehículo.
                    </li>
                  </ul>
                </ResultCard>
              </div>

              <div style={{ textAlign: "center", marginTop: "4rem" }}>
                <button
                  onClick={() => setShowTechDetails(!showTechDetails)}
                  style={{
                    background: "none",
                    border: "none",
                    color: COLORS.brand,
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    padding: "0.5rem",
                    fontWeight: 500,
                  }}
                >
                  {showTechDetails ? "🔼 Ocultar" : "➡️ Ver"} Detalles Técnicos
                  del Sistema
                </button>
                {showTechDetails && (
                  <div
                    style={{
                      background: COLORS.white,
                      borderRadius: "12px",
                      padding: "1.5rem",
                      marginTop: "1rem",
                      textAlign: "left",
                      border: `1px solid ${COLORS.lightGray}`,
                    }}
                  >
                    <h3
                      style={{
                        marginTop: 0,
                        marginBottom: "1rem",
                        color: COLORS.textPrimary,
                      }}
                    >
                      Especificaciones Estimadas
                    </h3>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        color: COLORS.textSecondary,
                      }}
                    >
                      <li
                        style={{
                          padding: "0.75rem 0",
                          borderBottom: `1px solid ${COLORS.lightGray}`,
                        }}
                      >
                        <strong>Potencia Pico del Sistema:</strong>{" "}
                        {results.potenciaSistemaKwp} kWp
                      </li>
                      <li
                        style={{
                          padding: "0.75rem 0",
                          borderBottom: `1px solid ${COLORS.lightGray}`,
                        }}
                      >
                        <strong>Inversor Recomendado:</strong>{" "}
                        {results.capacidadInversorKw} kW
                      </li>
                      <li
                        style={{
                          padding: "0.75rem 0",
                          borderBottom: `1px solid ${COLORS.lightGray}`,
                        }}
                      >
                        <strong>Baterías (50% autonomía):</strong>{" "}
                        {results.bateriasRecomendadasKwh} kWh
                      </li>
                      <li style={{ padding: "0.75rem 0" }}>
                        <strong>Análisis del Ahorro:</strong>{" "}
                        {results.desgloseAhorro}
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: "5rem",
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
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
