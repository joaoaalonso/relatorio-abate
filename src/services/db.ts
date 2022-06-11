import Database from 'tauri-plugin-sql-api'

export const getInstance = () => {
    return Database.load('sqlite:main.db')
}