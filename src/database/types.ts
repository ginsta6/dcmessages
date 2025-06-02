import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Messages {
  gifUrl: string
  id: Generated<number>
  messageText: string
  sentAt: string
  status: string | null
  sprintTitle: string
  username: string
}

export interface Sprints {
  createdAt: string
  id: string
  title: string
  updatedAt: string | null
}

export interface Templates {
  createdAt: string
  id: Generated<number>
  text: string
  updatedAt: string | null
}

export interface DB {
  messages: Messages
  sprints: Sprints
  templates: Templates
}
