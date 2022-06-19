import Database from 'tauri-plugin-sql-api'

export type DB = Database

export const getInstance = (): Promise<DB> => {
    return Database.load('sqlite:main.db')
}