import * as ExpoSQLite from "expo-sqlite";
import {
  documentDirectory,
  readAsStringAsync,
  readDirectoryAsync,
} from "expo-file-system";

class SQLite {
  db: ExpoSQLite.WebSQLDatabase;

  constructor() {
    this.db = ExpoSQLite.openDatabase("cm-catalogue.db");
  }

  initDB() {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS categories (
               id INTEGER PRIMARY KEY,
               name VARCHAR(50) NOT NULL UNIQUE,
               file_id VARCHAR(255),
               created_at TIMESTAMP NOT NULL,
               updated_at TIMESTAMP NOT NULL
             );`
          );

          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS products (
               id INTEGER PRIMARY KEY,
               category_id INTEGER REFERENCES categories(id),
               name VARCHAR(50) NOT NULL UNIQUE,
               description VARCHAR(200),
               price NUMERIC(10, 2) NOT NULL DEFAULT 0,
               status VARCHAR(50) NOT NULL,
               position NUMERIC NOT NULL,
               created_at TIMESTAMP NOT NULL,
               updated_at TIMESTAMP NOT NULL
             );`
          );

          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS products_catalogue_files (
               product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
               file_id VARCHAR(255),
               is_preview INTEGER NOT NULL DEFAULT 0,
               PRIMARY KEY (product_id, file_id)
             );`
          );
        },
        (error) => {
          reject(error);
        },
        () => {
          resolve(true);
        }
      );
    });
  }

  async importData(path: string) {
    const src = documentDirectory + path;
    const files = await readDirectoryAsync(src);
    if (files.length) {
      const dataFiles = await readDirectoryAsync(src + "/" + files[0]);
      for (let i = 0; i < dataFiles.length; i++) {
        const file = dataFiles[i];
        const data = await readAsStringAsync(src + `/${files[0]}/${file}`);
        await insertTable(this.db, data, file);
      }
    }
  }

  async selectData() {
    this.db.transaction(
      (tx) => {
        tx.executeSql("SELECT * FROM categories", [], (_, res) => {
          for (const data of res.rows._array) {
            console.log(data);
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

export const sqlite = new SQLite();

const insertTable = (
  db: ExpoSQLite.WebSQLDatabase,
  data: string,
  tableName: string
) => {
  const rows = data.split("\n");
  let truncateStmt = "";
  let insertStmt = "";
  const dataset = [];

  switch (tableName) {
    case "categories":
      truncateStmt = `DELETE FROM categories;`;
      insertStmt = `
        INSERT INTO categories (id, name, file_id, created_at, updated_at) VALUES 
      `;
      rows.map((row) => {
        const d = row.split("|");
        if (d.length === 5) {
          dataset.push(...d);
          insertStmt += "(?,?,?,?,?),";
        }
      });
      break;
    case "products":
      truncateStmt = `DELETE FROM products;`;
      insertStmt = `
        INSERT INTO products (id, category_id, name, description, price, status, 
          position, created_at, updated_at) VALUES 
      `;
      rows.map((row) => {
        const d = row.split("|");
        if (d.length === 9) {
          dataset.push(...d);
          insertStmt += "(?,?,?,?,?,?,?,?,?),";
        }
      });
      break;
    case "products_catalogue_files":
      truncateStmt = `DELETE FROM products_catalogue_files;`;
      insertStmt = `
        INSERT INTO products_catalogue_files (product_id, file_id, is_preview) VALUES 
      `;
      rows.map((row) => {
        const d = row.split("|");
        if (d.length === 3) {
          dataset.push(...d);
          insertStmt += "(?,?,?),";
        }
        return null;
      });
      break;
    default:
      return
  }

  // remove the last comma
  insertStmt = insertStmt.slice(0, -1);

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // clean up table
        tx.executeSql(truncateStmt);

        // insert data
        if (rows.length) {
          tx.executeSql(insertStmt, dataset);
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve(true);
      }
    );
  });
};
