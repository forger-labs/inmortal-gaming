import { ShieldCheckIcon, WhatsAppIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import type { PaymentMethod } from "@shared/types";
import {
  isValidVenezuelanPhone,
  normalizeVenezuelanPhone,
} from "@shared/utils";
import { Field, Form, Formik } from "formik";
import { useMemo, useState } from "react";
import * as Yup from "yup";

import { BUSINESS_WHATSAPP } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface CheckoutFormValues {
  paymentMethod: PaymentMethod;
  phoneNumber: string;
}

export function CartForm() {
  const { isAuthenticated, user, email } = useAuth();
  const { items, createOrder } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const discount = totalPrice * discountRate;

  const validationSchema = useMemo(() => {
    if (!isAuthenticated) {
      return Yup.object().shape({
        paymentMethod: Yup.string()
          .oneOf(
            ["Pagomovil", "Binance"],
            "Selecciona un metodo de pago valido",
          )
          .required("El metodo de pago es obligatorio"),
        phoneNumber: Yup.string()
          .required(
            "El numero de telefono es obligatorio para continuar como invitado",
          )
          .test(
            "venezuelan-phone",
            "Numero invalido. Debe tener 11 digitos (ej: 04121234567)",
            (val) => Boolean(val && isValidVenezuelanPhone(val)),
          ),
      });
    }

    return Yup.object().shape({
      paymentMethod: Yup.string()
        .oneOf(["Pagomovil", "Binance"], "Selecciona un metodo de pago valido")
        .required("El metodo de pago es obligatorio"),
      phoneNumber: Yup.string().test(
        "venezuelan-phone-optional",
        "Numero invalido. Debe tener 11 digitos (ej: 04121234567)",
        (val) => {
          if (!val || val.trim() === "") return true;
          return isValidVenezuelanPhone(val);
        },
      ),
    });
  }, [isAuthenticated]);

  const initialValues: CheckoutFormValues = {
    paymentMethod: "Pagomovil",
    phoneNumber: "",
  };

  const handleCheckout = async (values: CheckoutFormValues) => {
    if (items.length === 0) {
      cyberError("Tu carrito esta vacio.", "[CARRITO]");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Integrar metodo para crear orden segun estado de autenticacion
      const cleanPhone = values.phoneNumber
        ? normalizeVenezuelanPhone(values.phoneNumber)
        : undefined;

      const snapshotItems = [...items];

      const createdOrder = await createOrder({
        paymentMethod: values.paymentMethod,
        phoneNumber: cleanPhone,
      });

      // 2. Formatear mensaje para WhatsApp con: username, order_id, items to buy
      const customerUsername = isAuthenticated
        ? user?.username || user?.name || email || "Usuario Registrado"
        : cleanPhone
          ? `Invitado (${cleanPhone})`
          : "Invitado";

      const itemsList = snapshotItems
        .map((it) => {
          const srv = it.server_name ? ` [${it.server_name}]` : "";
          const sub = (it.price * it.quantity).toFixed(2);
          return `• ${it.quantity}x ${it.product_name}${srv} ($${it.price.toFixed(2)} c/u) = $${sub} USD`;
        })
        .join("\n");

      const messageText = [
        "🎮 *INMORTAL GAMING — NUEVO PEDIDO*",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        `🆔 *Orden ID:* #${createdOrder.id}`,
        `👤 *Usuario:* ${customerUsername}`,
        `💳 *Metodo de Pago:* ${values.paymentMethod}`,
        cleanPhone ? `📱 *Telefono:* ${cleanPhone}` : null,
        "",
        "📦 *Productos a comprar:*",
        itemsList,
        "",
        `💰 *Total a pagar:* $${createdOrder.total_amount.toFixed(2)} USD`,
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "Hola, acabo de generar mi orden de compra. Deseo recibir los datos para realizar la transferencia.",
      ]
        .filter(Boolean)
        .join("\n");

      const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(messageText)}`;

      cyberSuccess(
        `Orden #${createdOrder.id} generada exitosamente. Redirigiendo a WhatsApp...`,
        "[ORDEN CREADA]",
      );

      // Redirigir a WhatsApp
      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Ocurrio un error al procesar la orden";
      cyberError(msg, "[ERROR]");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleCheckout}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="mt-6 space-y-4">
          {/* Payment Method Selector */}
          <div>
            <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
              Metodo de Pago
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFieldValue("paymentMethod", "Pagomovil")}
                className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all cursor-pointer ${
                  values.paymentMethod === "Pagomovil"
                    ? "border-neon-primary bg-neon-primary/15 shadow-[0_0_12px_rgba(0,240,255,0.25)] text-neon-primary font-bold"
                    : "border-white/10 bg-bg-surface text-text-secondary hover:border-white/20 hover:text-text-primary"
                }`}
              >
                <span className="font-display text-sm font-semibold">
                  PagoMovil
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  VES (Bancos VE)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFieldValue("paymentMethod", "Binance")}
                className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all cursor-pointer ${
                  values.paymentMethod === "Binance"
                    ? "border-neon-amber bg-neon-amber/15 shadow-[0_0_12px_rgba(255,187,0,0.25)] text-neon-amber font-bold"
                    : "border-white/10 bg-bg-surface text-text-secondary hover:border-white/20 hover:text-text-primary"
                }`}
              >
                <span className="font-display text-sm font-semibold">
                  Binance
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  USDT Cripto
                </span>
              </button>
            </div>
          </div>

          {/* Phone number field: MANDATORY if user not logged in, optional if logged in */}
          <div>
            <label
              htmlFor="checkout-phone-number"
              className="mb-1.5 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-text-primary"
            >
              <span>
                Numero de Telefono (Venezuela){" "}
                {!isAuthenticated ? (
                  <span className="text-neon-pink">* (Requerido)</span>
                ) : (
                  <span className="text-text-muted font-normal">
                    (Opcional)
                  </span>
                )}
              </span>
            </label>

            <Field
              id="checkout-phone-number"
              name="phoneNumber"
              type="tel"
              placeholder="04121234567 o +584121234567"
              className={`w-full rounded-md border bg-bg-primary px-3.5 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                touched.phoneNumber && errors.phoneNumber
                  ? "border-neon-pink focus:border-neon-pink"
                  : "border-white/10 focus:border-neon-primary"
              }`}
            />

            {touched.phoneNumber && errors.phoneNumber && (
              <p className="mt-1 font-mono text-[11px] text-neon-pink">
                {errors.phoneNumber}
              </p>
            )}

            <p className="mt-1 font-mono text-[10px] text-text-muted">
              Prefijos validos: 0412, 0414, 0424, 0416, 0426, 0422
            </p>
          </div>

          {/* User status info banner */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 rounded-lg border border-neon-green/30 bg-neon-green/10 p-2.5 font-mono text-xs text-neon-green">
              <ShieldCheckIcon className="h-4 w-4 shrink-0 text-neon-green" />
              <span className="truncate">
                Sesion activa: {user?.username || email}
              </span>
            </div>
          ) : (
            <div className="rounded-lg border border-neon-amber/30 bg-neon-amber/10 p-2.5 font-mono text-[11px] text-neon-amber">
              Comprando como Invitado. Al confirmar tu pedido se enviara la
              orden a WhatsApp.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-lg bg-neon-green py-3.5 font-display text-base font-bold text-black shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <WhatsAppIcon className="h-5 w-5" title="WhatsApp" />
            <span>
              {isSubmitting ? "PROCESANDO ORDEN..." : "CONFIRMAR POR WHATSAPP"}
            </span>
          </button>

          <p className="text-center font-body text-xs text-text-muted">
            Atencion directa y entrega rapida en minutos
          </p>
        </Form>
      )}
    </Formik>
  );
}
