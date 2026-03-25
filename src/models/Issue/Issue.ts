import { Schema, model } from "mongoose";
import { IIssue } from "./IIssue";

const issueSchema = new Schema(
  {
    issueLink: { type: String, required: true },
    requestedById: { type: String, required: true },
    requestedByUsername: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// @ts-ignore — Mongoose v9 + TS5 deep type instantiation limit hit on model<T>
export const Issue = model<IIssue>("Issue", issueSchema);
