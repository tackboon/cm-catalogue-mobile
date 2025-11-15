import * as ExpoSQLite from "expo-sqlite";
import { Directory, File, Paths } from "expo-file-system";

class SQLite {
  db: ExpoSQLite.SQLiteDatabase;

  constructor() {
    this.db = ExpoSQLite.openDatabaseSync("cm-catalogue.db");
  }

  initDB() {
    return new Promise((resolve, reject) => {
      try {
        this.db.withTransactionSync(() => {
          this.db.execSync(
            `CREATE TABLE IF NOT EXISTS categories (
               id INTEGER PRIMARY KEY,
               name VARCHAR(50) NOT NULL UNIQUE,
               file_id VARCHAR(255),
               created_at TIMESTAMP NOT NULL,
               updated_at TIMESTAMP NOT NULL
             );`
          );

          this.db.execSync(
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

          this.db.execSync(
            `CREATE TABLE IF NOT EXISTS products_catalogue_files (
               product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
               file_id VARCHAR(255),
               is_preview INTEGER NOT NULL DEFAULT 0,
               PRIMARY KEY (product_id, file_id)
             );`
          );
        });

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  async importData(path: string) {
    const src = Paths.document.uri + path;
    const folderDir = new Directory(src);
    const folders = folderDir.list();
    if (folders.length) {
      const firstFolder = new Directory(src + "/" + folders[0].name);
      const dataFiles = firstFolder.list();
      for (let i = 0; i < dataFiles.length; i++) {
        const file = dataFiles[i].name;
        const fileObj = new File(src + `/${folders[0].name}/${file}`);
        const data = await fileObj.text();
        insertTable(this.db, data, file);
      }
    }
  }
}

export const sqlite = new SQLite();

const insertTable = (
  db: ExpoSQLite.SQLiteDatabase,
  data: string,
  tableName: string
) => {
  const rows = data.split("\n");
  let columnSize = 0;
  let truncateStmt = "";
  let insertStmt = "";

  switch (tableName) {
    case "categories":
      truncateStmt = `DELETE FROM categories;`;
      insertStmt = `
        INSERT INTO categories (id, name, file_id, created_at, updated_at) 
        VALUES (?,?,?,?,?);
      `;
      columnSize = 5;
      break;
    case "products":
      truncateStmt = `DELETE FROM products;`;
      insertStmt = `
        INSERT INTO products (id, category_id, name, description, price, status,
          position, created_at, updated_at) 
          VALUES (?,?,?,?,?,?,?,?,?);
      `;
      columnSize = 9;
      break;
    case "products_catalogue_files":
      truncateStmt = `DELETE FROM products_catalogue_files;`;
      insertStmt = `
        INSERT INTO products_catalogue_files (product_id, file_id, is_preview) 
        VALUES (?,?,?);
      `;
      columnSize = 3;
      break;
    default:
      return;
  }

  return new Promise((resolve, reject) => {
    try {
      db.withTransactionSync(() => {
        // clean up table
        db.execSync(truncateStmt);

        // insert data
        rows.forEach((row) => {
          const d = row.split("|");
          const data: string[] = [];

          if (d.length === columnSize) {
            data.push(...d);
            db.runSync(insertStmt, data);
          }
        });
      });

      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};
