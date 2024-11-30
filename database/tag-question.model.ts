import { model, models, Schema, Types } from "mongoose";

export interface ITagQUestion {
  tag: Types.ObjectId;
  question: Types.ObjectId;
}

const TagQUestionSchema = new Schema<ITagQUestion>(
  {
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const TagQUestion =
  models?.TagQUestion || model<ITagQUestion>("TagQUestion", TagQUestionSchema);

export default TagQUestion;
