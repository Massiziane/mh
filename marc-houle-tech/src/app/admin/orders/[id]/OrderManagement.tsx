
"use client";

import { useState, useTransition } from "react";

import type { OrderStatus } from "@/generated/prisma/client";

import {
  saveAppointment,
  sendAppointmentConfirmation,
  updateOrderStatus,
  type ActionResult,
} from "./actions";

type Props = {
  order: {
    id: string;
    email: string | null;
    status: OrderStatus;
    address: string;
    scheduledDate: string;
    scheduledTime: string;
    appointmentAddress: string;
    appointmentNotes: string;
    confirmationSentAt: string | null;
  };
};

const statuses = [
  { value: "NEW", label: "Nouvelle" },
  { value: "OPEN", label: "Ouverte" },
  { value: "PLANNED", label: "Planifiée" },
  { value: "COMPLETED", label: "Terminée" },
  { value: "CANCELLED", label: "Annulée" },
] as const;

export default function OrderManagement({
  order,
}: Props) {
  const [status, setStatus] = useState<OrderStatus>(
    order.status
  );

  const [date, setDate] = useState(order.scheduledDate);
  const [time, setTime] = useState(order.scheduledTime);
  const [address, setAddress] = useState(
    order.appointmentAddress || order.address
  );
  const [notes, setNotes] = useState(
    order.appointmentNotes
  );

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [pending, startTransition] = useTransition();

  const [saved, setSaved] = useState(
    Boolean(order.scheduledDate)
  );
  const [confirmed, setConfirmed] = useState(
    Boolean(order.confirmationSentAt)
  );

  function showResult(result: ActionResult) {
    setMessage(result.message);
    setIsError(!result.success);
  }

  function changeStatus() {
    startTransition(async () => {
      try {
        const result = await updateOrderStatus(
          order.id,
          status
        );
        showResult(result);
      } catch {
        showResult({
          success: false,
          message: "Impossible de modifier le statut.",
        });
      }
    });
  }

  function planAppointment() {
    const form = new FormData();

    form.set("date", date);
    form.set("time", time);
    form.set("address", address);
    form.set("notes", notes);

    startTransition(async () => {
      try {
        const result = await saveAppointment(
          order.id,
          form
        );

        showResult(result);

        if (result.success) {
          setSaved(true);
          setConfirmed(false);
          setStatus("PLANNED");
        }
      } catch {
        showResult({
          success: false,
          message: "Impossible d'enregistrer le rendez-vous.",
        });
      }
    });
  }

  function sendEmail() {
    startTransition(async () => {
      try {
        const result =
          await sendAppointmentConfirmation(order.id);

        showResult(result);

        if (result.success) {
          setConfirmed(true);
        }
      } catch {
        showResult({
          success: false,
          message: "Impossible d'envoyer la confirmation.",
        });
      }
    });
  }

  const changed =
    date !== order.scheduledDate ||
    time !== order.scheduledTime ||
    address !==
      (order.appointmentAddress || order.address) ||
    notes !== order.appointmentNotes;

  return (
    <div className="space-y-6">
      {/* Status */}
      <section className="rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-[#142d4e]">
          Statut de la demande
        </h2>

        <p className="mt-2 text-sm text-[#64748b]">
          Suivez l'avancement de votre intervention.
        </p>

        <label
          htmlFor="order-status"
          className="mt-5 block text-xs font-bold text-[#64748b]"
        >
          Statut actuel
        </label>

        <select
          id="order-status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as OrderStatus)
          }
          disabled={pending}
          className="mt-2 h-12 w-full rounded-xl border border-[#e5eaf1] bg-[#f8fafc] px-4 text-sm font-semibold text-[#142d4e] outline-none focus:border-[#2563eb]"
        >
          {order.status === "IN_REVIEW" && (
            <option value="IN_REVIEW">
              En révision (ancien statut)
            </option>
          )}
          {order.status === "ACCEPTED" && (
            <option value="ACCEPTED">
              Acceptée (ancien statut)
            </option>
          )}
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={changeStatus}
          disabled={pending}
          className="mt-4 w-full rounded-xl bg-[#142d4e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#203f68] disabled:opacity-50"
        >
          Enregistrer le statut
        </button>
      </section>

      {/* Appointment */}
      <section className="rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
            📅
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#142d4e]">
              Planifier une intervention
            </h2>
            <p className="mt-1 text-xs text-[#64748b]">
              Définissez les détails du rendez-vous.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold text-[#64748b]">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setSaved(false);
              }}
              disabled={pending}
              className="h-12 w-full rounded-xl border border-[#e5eaf1] bg-[#f8fafc] px-4 text-sm text-[#142d4e]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-[#64748b]">
              Heure
            </label>
            <input
              type="time"
              value={time}
              onChange={(event) => {
                setTime(event.target.value);
                setSaved(false);
              }}
              disabled={pending}
              className="h-12 w-full rounded-xl border border-[#e5eaf1] bg-[#f8fafc] px-4 text-sm text-[#142d4e]"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-xs font-bold text-[#64748b]">
            Adresse de l'intervention
          </label>
          <textarea
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setSaved(false);
            }}
            rows={2}
            disabled={pending}
            className="w-full rounded-xl border border-[#e5eaf1] bg-[#f8fafc] px-4 py-3 text-sm text-[#142d4e]"
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-xs font-bold text-[#64748b]">
            Notes complémentaires
          </label>
          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              setSaved(false);
            }}
            rows={3}
            placeholder="Informations utiles pour le rendez-vous..."
            disabled={pending}
            className="w-full rounded-xl border border-[#e5eaf1] bg-[#f8fafc] px-4 py-3 text-sm text-[#142d4e]"
          />
        </div>

        <button
          type="button"
          onClick={planAppointment}
          disabled={pending || !date || !time || !address.trim()}
          className="mt-5 w-full rounded-xl bg-[#2563eb] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
        >
          {pending
            ? "Traitement..."
            : "Enregistrer le rendez-vous"}
        </button>

        {/* Email confirmation */}
        <div className="mt-6 rounded-xl border border-[#dbeafe] bg-[#f0f7ff] p-5">
          <h3 className="font-extrabold text-[#142d4e]">
            ✉️ Confirmation par courriel
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#64748b]">
            Envoyez au client la date, l'heure, l'adresse
            et le service prévu.
          </p>

          <p className="mt-3 break-all text-xs font-semibold text-[#2563eb]">
            Destinataire : {order.email || "Aucun courriel"}
          </p>

          {confirmed ? (
            <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              ✓ Confirmation envoyée
            </p>
          ) : (
            <button
              type="button"
              onClick={sendEmail}
              disabled={
                pending ||
                !saved ||
                changed ||
                !order.email ||
                status !== "PLANNED"
              }
              className="mt-4 w-full rounded-xl bg-[#142d4e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#203f68] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Envoyer la confirmation au client
            </button>
          )}

          {!order.email && (
            <p className="mt-3 text-xs text-amber-700">
              Le client n'a pas encore d'adresse courriel
              enregistrée.
            </p>
          )}
        </div>
      </section>

      {message && (
        <div
          role="status"
          className={`rounded-xl border p-4 text-sm font-semibold ${
            isError
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
