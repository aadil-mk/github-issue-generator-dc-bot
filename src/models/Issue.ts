import { Schema, model } from "mongoose";

export interface IIssue {
    issueLink: string;
    requestedById: string;
    requestedByUsername: string;
    title: string;
    description: string;
}

const issueSchema = new Schema<IIssue>({
    issueLink: { type: String, required: true },
    requestedById: { type: String, required: true },
    requestedByUsername: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true
});

// @ts-ignore Mongoose v6+ internal deep instantiation validation bypass
export const Issue = model<IIssue>("Issue", issueSchema);
